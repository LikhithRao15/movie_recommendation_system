const express = require('express');
const { rateMovie, getRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', rateMovie);
router.get('/', getRatings);

module.exports = router;
