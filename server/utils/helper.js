// helper.js

// Function to validate if an input is a valid username
const isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{3,30}$/; // Example: alphanumeric with underscores, 3-30 chars
    return regex.test(username);
  };
  
  // Function to validate if an input is a valid password (e.g., min 6 characters, with at least one digit)
  const isValidPassword = (password) => {
    const regex = /^(?=.*[0-9])[A-Za-z0-9!@#$%^&*]{6,}$/;
    return regex.test(password);
  };
  
  // Function to generate a random unique game ID (could be a timestamp or a more complex ID)
  const generateGameId = () => {
    return 'game_' + Date.now();  // Example: simple timestamp-based ID
  };
  
  // Function to send a success response
  const sendSuccessResponse = (res, message, data = {}) => {
    res.json({
      status: 'success',
      message,
      data,
    });
  };
  
  // Function to send an error response
  const sendErrorResponse = (res, message, error = null, statusCode = 400) => {
    res.status(statusCode).json({
      status: 'error',
      message,
      error,
    });
  };
  
  // Function to format a date for the game (e.g., convert a timestamp to a readable date)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();  // Example: "12/12/2024, 3:25:00 PM"
  };
  
  module.exports = {
    isValidUsername,
    isValidPassword,
    generateGameId,
    sendSuccessResponse,
    sendErrorResponse,
    formatDate,
  };
  