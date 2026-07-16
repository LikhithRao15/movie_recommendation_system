const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getRecommendations);

module.exports = router;
