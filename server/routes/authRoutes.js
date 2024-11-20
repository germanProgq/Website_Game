const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the auth controller

// Route for creating a new user (register)
router.post('/register', authController.registerUser);

// Route for user login (authenticate and get JWT)
router.post('/login', authController.loginUser);

// Route to get a user's profile (protected)
router.get('/profile/:userId', authController.getUserProfile);

// Route for updating a user's password (protected)
router.put('/profile/:userId/password', authController.updatePassword);

module.exports = router;
