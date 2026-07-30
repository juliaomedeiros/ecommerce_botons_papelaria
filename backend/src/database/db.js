const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://tutas_admin:tutas_password_123@localhost:5432/tutaspaper_db';

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no Pool do PostgreSQL:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
