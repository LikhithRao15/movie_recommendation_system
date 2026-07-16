const express = require('express');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All favorites routes require authentication

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/:id', removeFavorite); // :id = tmdbId

module.exports = router;
