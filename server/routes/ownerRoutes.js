const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { verifyToken } = require('../middleware/authMiddleware');

const isOwner = (req, res, next) => {
    if (req.user.role !== 'STORE_OWNER') {
        return res.status(403).json({ error: 'Forbidden. Store Owner access required.' });
    }
    next();
};

router.get('/dashboard', verifyToken, isOwner, getOwnerDashboard);

module.exports = router;