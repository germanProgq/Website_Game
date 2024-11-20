// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db/db');  // Database connection
const { jwtSecret } = require('../config/config');  // JWT Secret from .env
const { 
  isValidUsername, 
  isValidPassword, 
  sendSuccessResponse, 
  sendErrorResponse 
} = require('../utils/helper');  // Import helper functions

// Register a new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate username and password
    if (!isValidUsername(username)) {
      return sendErrorResponse(res, 'Invalid username format');
    }
    if (!isValidPassword(password)) {
      return sendErrorResponse(res, 'Password must be at least 6 characters long and contain at least one number');
    }

    // Check if the user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE username = $1';
    const existingUser = await client.query(existingUserQuery, [username]);

    if (existingUser.rows.length > 0) {
      return sendErrorResponse(res, 'User already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery = 'INSERT INTO users (username, password, items) VALUES ($1, $2, $3) RETURNING *';
    const newUser = await client.query(insertQuery, [username, hashedPassword, []]);

    // Send success response
    sendSuccessResponse(res, 'Registration successful', { user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 'Server error', err);
  }
};

// Login a user and generate JWT token
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate username and password
    if (!isValidUsername(username)) {
      return sendErrorResponse(res, 'Invalid username format');
    }
    if (!isValidPassword(password)) {
      return sendErrorResponse(res, 'Password must be at least 6 characters long and contain at least one number');
    }

    // Find the user by username
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const user = await client.query(userQuery, [username]);

    if (user.rows.length === 0) {
      return sendErrorResponse(res, 'User not found');
    }

    // Compare the password with the hashed one in the database
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return sendErrorResponse(res, 'Invalid credentials');
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      jwtSecret,
      { expiresIn: '3h' }  // Token expiration (3 hours)
    );

    // Send success response with token
    sendSuccessResponse(res, 'Login successful', { token });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 'Server error', err);
  }
};

// Get user profile (protected route, needs token)
const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user profile by ID
    const userQuery = 'SELECT id, username, items FROM users WHERE id = $1';
    const user = await client.query(userQuery, [userId]);

    if (user.rows.length === 0) {
      return sendErrorResponse(res, 'User not found');
    }

    sendSuccessResponse(res, 'User profile fetched successfully', { userProfile: user.rows[0] });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 'Server error', err);
  }
};

// Update user password (protected route, needs token)
const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Validate password formats
    if (!isValidPassword(newPassword)) {
      return sendErrorResponse(res, 'New password must be at least 6 characters long and contain at least one number');
    }

    // Check if the user exists
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const user = await client.query(userQuery, [userId]);

    if (user.rows.length === 0) {
      return sendErrorResponse(res, 'User not found');
    }

    // Compare the old password
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);

    if (!isMatch) {
      return sendErrorResponse(res, 'Old password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
    const updatedUser = await client.query(updateQuery, [hashedPassword, userId]);

    sendSuccessResponse(res, 'Password updated successfully', { user: updatedUser.rows[0] });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 'Server error', err);
  }
};

// Export functions to be used in the routes
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updatePassword,
};