
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllStores } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/stores', getAllStores);

module.exports = router;