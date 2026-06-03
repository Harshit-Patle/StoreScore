
const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { validateSignup } = require('../middleware/validateAuth');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.put('/password', verifyToken, updatePassword);

module.exports = router;