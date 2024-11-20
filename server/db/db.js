// db.js
const { Client } = require('pg');
const { dbConfig } = require('../config/config');
const client = new Client(dbConfig);

module.exports = client;
