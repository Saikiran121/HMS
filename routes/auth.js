const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login: set req.session.user
router.post('/login', authController.login);

// Get current session user
router.get('/user', authController.getCurrentUser);

// Logout: destroy session
router.post('/logout', authController.logout);

module.exports = router;
