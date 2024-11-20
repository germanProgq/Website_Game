// userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db/db');  // Database connection
const { jwtSecret } = require('../config/config');  // JWT Secret from .env

// Create a new user
const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE username = $1';
    const existingUser = await client.query(existingUserQuery, [username]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery = 'INSERT INTO users (username, password, items) VALUES ($1, $2, $3) RETURNING *';
    const newUser = await client.query(insertQuery, [username, hashedPassword, []]);

    res.json({ message: 'Registration successful', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const user = await client.query(userQuery, [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Login a user and generate JWT token
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const user = await client.query(userQuery, [username]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password with the hashed one in the database
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      jwtSecret,
      { expiresIn: '3h' }  // Token expiration (3 hours for example)
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Update user information
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, password, items } = req.body;

  try {
    let updateQuery = 'UPDATE users SET';
    const updateValues = [];
    let queryIndex = 1;

    if (username) {
      updateQuery += ` username = $${queryIndex++},`;
      updateValues.push(username);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ` password = $${queryIndex++},`;
      updateValues.push(hashedPassword);
    }
    if (items !== undefined) {
      updateQuery += ` items = $${queryIndex++},`;
      updateValues.push(items);
    }

    // Remove trailing comma
    updateQuery = updateQuery.slice(0, -1);
    updateQuery += ` WHERE id = $${queryIndex} RETURNING *;`;

    updateValues.push(userId);
    const updatedUser = await client.query(updateQuery, updateValues);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user: updatedUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const deletedUser = await client.query(deleteQuery, [userId]);

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Export functions for routing
module.exports = {
  createUser,
  getUserById,
  loginUser,
  updateUser,
  deleteUser,
};
