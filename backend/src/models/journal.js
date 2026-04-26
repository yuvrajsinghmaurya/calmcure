const { getPool } = require('../config/db');

async function getJournalsByUser(userId) {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM journals WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
}

async function createJournal({ user_id, mood, content, reflection }) {
    const pool = getPool();
    const res = await pool.query(
        'INSERT INTO journals (user_id, mood, content, reflection) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, mood, content, reflection]
    );
    return res.rows[0];
}

async function deleteJournalById(userId, journalId) {
    const pool = getPool();
    const res = await pool.query('DELETE FROM journals WHERE id = $1 AND user_id = $2 RETURNING *', [journalId, userId]);
    return res.rows[0];
}

module.exports = {
    getJournalsByUser,
    createJournal,
    deleteJournalById
};
