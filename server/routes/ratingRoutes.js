
const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, submitRating);

module.exports = router;