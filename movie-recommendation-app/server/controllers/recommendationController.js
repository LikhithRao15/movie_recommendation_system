const axios = require('axios');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite');
const { getTmdbId } = require('../utils/datasetLoader');
const { fetchMoviesBatch } = require('../utils/tmdbHelpers');

/**
 * @route   GET /api/recommendations
 * @desc    Get personalized movie recommendations
 * @access  Private
 *
 * Flow:
 * 1. Fetch all rated & favorited movies from MongoDB
 * 2. Build the payload for the ML recommendation API
 * 3. Call the ML API
 * 4. Map returned imdbIds to tmdbIds using the dataset
 * 5. Fetch full TMDB details for each recommendation
 * 6. Return enriched movie objects
 */
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Step 1: Fetch rated and favorited movies
    const [ratings, favorites] = await Promise.all([
      Rating.find({ userId }),
      Favorite.find({ userId }),
    ]);

    // Build a map of imdbId -> rating (ratings take priority over favorites)
    const movieMap = new Map();

    // Add favorites with a default rating of 4
    favorites.forEach((fav) => {
      if (fav.imdbId) {
        movieMap.set(fav.imdbId, movieMap.get(fav.imdbId) || 4);
      }
    });

    // Add/override with actual ratings
    ratings.forEach((r) => {
      if (r.imdbId) {
        movieMap.set(r.imdbId, r.rating);
      }
    });

    if (movieMap.size === 0) {
      return res.json({
        success: true,
        recommendations: [],
        message: 'Rate or favorite movies to get personalized recommendations',
      });
    }

    // Step 2: Build ML API payload
    const payload = Array.from(movieMap.entries()).map(([imdbId, rating]) => ({
      imdbId: Number(imdbId),
      rating: Number(rating),
    }));

    // Step 3: Call ML Recommendation API
    let mlResults = [];
    try {
      const { data } = await axios.post(
        process.env.RECOMMENDATION_API_URL || 'https://ml-movie-recomedetion-model.onrender.com/rec',
        payload,
        {
          timeout: 60000, // 60s timeout (Render cold start)
          headers: { 'Content-Type': 'application/json' },
        }
      );
      mlResults = Array.isArray(data) ? data : [];
    } catch (mlError) {
      console.error('ML API error:', mlError.message);
      return res.status(503).json({
        success: false,
        message: 'Recommendation service is temporarily unavailable. Please try again later.',
      });
    }

    if (mlResults.length === 0) {
      return res.json({ success: true, recommendations: [], message: 'No recommendations found' });
    }

    // Step 4: Map imdbIds to tmdbIds (exclude movies already rated/favorited)
    const ratedImdbIds = new Set(movieMap.keys());
    const tmdbIds = [];

    for (const item of mlResults) {
      const imdbId = Number(item.imdbId);
      if (ratedImdbIds.has(imdbId)) continue; // Skip already-rated movies

      const tmdbId = getTmdbId(imdbId);
      if (tmdbId) {
        tmdbIds.push(tmdbId);
      }
    }

    if (tmdbIds.length === 0) {
      return res.json({ success: true, recommendations: [], message: 'No new recommendations available' });
    }

    // Step 5: Fetch TMDB details (limit to 20 for performance)
    const limitedTmdbIds = tmdbIds.slice(0, 20);
    const movies = await fetchMoviesBatch(limitedTmdbIds, 6);

    res.json({
      success: true,
      recommendations: movies,
      count: movies.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
