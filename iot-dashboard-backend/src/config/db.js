// src/config/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Otros ajustes para Cloud SQL: SSL, etc.
});

// Función para ejecutar consultas
module.exports = {
  query: (text, params) => pool.query(text, params),
};