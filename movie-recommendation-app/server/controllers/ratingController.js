const Rating = require('../models/Rating');
const { getImdbId } = require('../utils/datasetLoader');

/**
 * @route   POST /api/ratings
 * @desc    Rate a movie (upsert)
 * @access  Private
 */
const rateMovie = async (req, res, next) => {
  try {
    const { tmdbId, rating } = req.body;

    if (!tmdbId || !rating) {
      return res.status(400).json({ success: false, message: 'tmdbId and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const imdbId = getImdbId(Number(tmdbId));

    // Upsert: update if exists, create if not
    const ratingDoc = await Rating.findOneAndUpdate(
      { userId: req.user._id, tmdbId: Number(tmdbId) },
      {
        rating: Number(rating),
        imdbId: imdbId || null,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Rating saved successfully',
      rating: ratingDoc,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ratings
 * @desc    Get all ratings for the current user
 * @access  Private
 */
const getRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

module.exports = { rateMovie, getRatings };
