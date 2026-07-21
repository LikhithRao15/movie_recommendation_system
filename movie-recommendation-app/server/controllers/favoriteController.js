const Favorite = require('../models/Favorite');
const { getImdbId } = require('../utils/datasetLoader');
const { fetchCompactMovie } = require('../utils/tmdbHelpers');

/**
 * @route   POST /api/favorites
 * @desc    Add a movie to favorites
 * @access  Private
 */
const addFavorite = async (req, res, next) => {
  try {
    const { tmdbId } = req.body;
    if (!tmdbId) {
      return res.status(400).json({ success: false, message: 'tmdbId is required' });
    }

    const imdbId = getImdbId(Number(tmdbId));

    const favorite = await Favorite.create({
      userId: req.user._id,
      tmdbId: Number(tmdbId),
      imdbId: imdbId || null,
    });

    res.status(201).json({ success: true, message: 'Added to favorites', favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Movie already in favorites' });
    }
    next(error);
  }
};

/**
 * @route   GET /api/favorites
 * @desc    Get all favorites with TMDB movie details
 * @access  Private
 */
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });

    if (favorites.length === 0) {
      return res.json({ success: true, favorites: [] });
    }

    // Fetch compact movie details for all favorites in parallel
    const moviePromises = favorites.map((fav) =>
      fetchCompactMovie(fav.tmdbId).catch(() => null)
    );
    const movies = await Promise.all(moviePromises);

    const enriched = favorites
      .map((fav, idx) => ({
        _id: fav._id,
        tmdbId: fav.tmdbId,
        imdbId: fav.imdbId,
        addedAt: fav.createdAt,
        movie: movies[idx],
      }))
      .filter((f) => f.movie !== null);

    res.json({ success: true, favorites: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/favorites/:id
 * @desc    Remove a favorite by tmdbId
 * @access  Private
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params; // This is tmdbId

    const deleted = await Favorite.findOneAndDelete({
      userId: req.user._id,
      tmdbId: Number(id),
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
