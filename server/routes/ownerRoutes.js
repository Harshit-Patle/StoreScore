const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { verifyToken, isOwner } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, isOwner, getOwnerDashboard);

module.exports = router;