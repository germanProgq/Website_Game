// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const client = require('./db/db');
const { dbConfig } = require('./config/config'); //For port Clarification
const  port = dbConfig.port

// Import routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();
const corsOptions = {
  origin: 'http://localhost:3001',  // React app URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};


// Initialize the Express app
const app = express();

// Middleware
app.use(cors(corsOptions));  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies

// API Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/game', gameRoutes);  // Game-related routes
app.use('/api/user', userRoutes);  // User-related routes

// Test route to ensure server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Game API!');
});

// Start the server
app.listen(port, async () => {
  try {
    await client.connect();
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
});
