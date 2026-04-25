const env = require('./env');

let pool;

function getPool() {
    if (pool) return pool;

    const { Pool } = require('pg');

    pool = new Pool({
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        max: 10
    });

    return pool;
}

async function testConnection() {
    const client = await getPool().connect();
    client.release();
}

module.exports = {
    getPool,
    testConnection
};
