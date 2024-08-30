const express = require('express');
const router = express.Router();
const { register, login, resetPassword } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;
