const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Supabase connections
    }
});

pool.connect()
    .then(() => console.log('✅ Connected to StoreScore Database'))
    .catch(err => console.error('❌ Database connection error:', err.stack));

module.exports = pool;