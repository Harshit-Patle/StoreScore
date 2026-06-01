
const express = require('express');
const router = express.Router();
const { getStoresForUser } = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getStoresForUser);

module.exports = router;