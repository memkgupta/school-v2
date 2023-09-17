const { Pool } = require('pg');
const pool = new Pool({
    host:process.env.POSTGRES_HOST||'localhost',
    user:process.env.POSTGRES_USER||'postgres',
    password:process.env.POSTGRES_PASS||'pass123',
    database: 'postgres',
  port: process.env.POSTGRES_PORT,
  idleTimeoutMillis: 30000
}) ;

module.exports = pool;