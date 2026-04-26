const { getPool } = require('../config/db');

async function findUserByEmail(email) {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
}

async function createUser({ name, email, password_hash }) {
    const pool = getPool();
    const res = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password_hash]
    );
    return res.rows[0];
}

module.exports = {
    findUserByEmail,
    createUser
};
