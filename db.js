// db.js
// Conexión a la base de datos PostgreSQL

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
};
