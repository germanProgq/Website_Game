// config.js
require('dotenv').config();

module.exports = {
    dbConfig: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    },
    jwtSecret: process.env.JWT_SECRET,
    socketPort: process.env.SOCKET_PORT || 3001,
  };
  