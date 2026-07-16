const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one favorite per user per movie
favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
