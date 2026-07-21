const axios = require('axios');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite');
const tmdbClient = require('../config/tmdb');
const { getTmdbId } = require('../utils/datasetLoader');
const { fetchCompactBatch, formatMovie } = require('../utils/tmdbHelpers');

/**
 * Helper to fetch TMDB native recommendations for a set of tmdbIds (Fallback mechanism)
 */
const fetchTmdbFallbackRecommendations = async (userTmdbIds) => {
  try {
    const seedIds = userTmdbIds.slice(0, 4); // Take up to 4 movies to seed recommendations
    const tmdbReqs = seedIds.map((id) =>
      tmdbClient.get(`/movie/${id}/recommendations`).catch(() => null)
    );

    const responses = await Promise.all(tmdbReqs);
    const setSeen = new Set(userTmdbIds);
    const recs = [];

    for (const res of responses) {
      if (res?.data?.results) {
        for (const m of res.data.results) {
          if (!setSeen.has(m.id)) {
            setSeen.add(m.id);
            recs.push(formatMovie(m));
          }
        }
      }
    }
    return recs.slice(0, 20);
  } catch (err) {
    console.error('TMDB fallback error:', err.message);
    return [];
  }
};

/**
 * @route   GET /api/recommendations
 * @desc    Get personalized movie recommendations (ML model + TMDB fallback)
 * @access  Private
 */
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Step 1: Fetch rated and favorited movies
    const [ratings, favorites] = await Promise.all([
      Rating.find({ userId }),
      Favorite.find({ userId }),
    ]);

    // Build lists of user movies
    const userTmdbIds = new Set();
    const movieMap = new Map(); // imdbId -> rating

    favorites.forEach((fav) => {
      userTmdbIds.add(fav.tmdbId);
      if (fav.imdbId) {
        movieMap.set(fav.imdbId, movieMap.get(fav.imdbId) || 4);
      }
    });

    ratings.forEach((r) => {
      userTmdbIds.add(r.tmdbId);
      if (r.imdbId) {
        movieMap.set(r.imdbId, r.rating);
      }
    });

    // If user has no favorites/ratings yet
    if (movieMap.size === 0 && userTmdbIds.size === 0) {
      return res.json({
        success: true,
        recommendations: [],
        message: 'Rate or favorite movies to get personalized recommendations',
      });
    }

    // Step 2: Try ML Recommendation API with a fast 3.5s timeout
    let mlResults = [];
    if (movieMap.size > 0) {
      const payload = Array.from(movieMap.entries()).map(([imdbId, rating]) => ({
        imdbId: Number(imdbId),
        rating: Number(rating),
      }));

      try {
        const { data } = await axios.post(
          process.env.RECOMMENDATION_API_URL || 'https://ml-movie-recomedetion-model.onrender.com/rec',
          payload,
          {
            timeout: 3500, // 3.5s fast timeout to prevent page blocking
            headers: { 'Content-Type': 'application/json' },
          }
        );
        mlResults = Array.isArray(data) ? data : [];
      } catch (mlError) {
        console.warn('ML API timeout/error, switching to TMDB recommendation fallback:', mlError.message);
      }
    }

    // Step 3: Extract recommended TMDB IDs from ML model
    const ratedImdbIds = new Set(movieMap.keys());
    const tmdbIds = [];

    for (const item of mlResults) {
      const imdbId = Number(item.imdbId);
      if (ratedImdbIds.has(imdbId)) continue;

      const tmdbId = getTmdbId(imdbId);
      if (tmdbId && !userTmdbIds.has(tmdbId)) {
        tmdbIds.push(tmdbId);
      }
    }

    // Step 4: If ML returned valid TMDB IDs, fetch compact movie details fast
    let finalRecommendations = [];
    if (tmdbIds.length > 0) {
      const limitedTmdbIds = tmdbIds.slice(0, 20);
      finalRecommendations = await fetchCompactBatch(limitedTmdbIds, 10);
    }

    // Step 5: Fallback if ML model was offline/cold or gave empty results
    if (finalRecommendations.length === 0 && userTmdbIds.size > 0) {
      finalRecommendations = await fetchTmdbFallbackRecommendations(Array.from(userTmdbIds));
    }

    res.json({
      success: true,
      recommendations: finalRecommendations,
      count: finalRecommendations.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
