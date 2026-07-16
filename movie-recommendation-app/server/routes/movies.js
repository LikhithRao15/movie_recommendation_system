const express = require('express');
const {
  searchMovies,
  getTrending,
  getTopRated,
  getLatest,
  getByGenre,
  getMovieDetails,
} = require('../controllers/movieController');

const router = express.Router();

router.get('/search', searchMovies);
router.get('/trending', getTrending);
router.get('/top-rated', getTopRated);
router.get('/latest', getLatest);
router.get('/genre/:genre', getByGenre);
router.get('/details/:tmdbId', getMovieDetails);

module.exports = router;
