const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import the user controller

// Route for creating a new user
router.post('/register', userController.createUser);

// Route for logging in a user
router.post('/login', userController.loginUser);

// Route for fetching a user's details by ID
router.get('/:userId', userController.getUserById);

// Route for updating a user's information
router.put('/:userId', userController.updateUser);

// Route for deleting a user account
router.delete('/:userId', userController.deleteUser);

module.exports = router;
