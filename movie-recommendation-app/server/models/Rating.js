const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    imdbId: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one rating per user per movie
ratingSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
