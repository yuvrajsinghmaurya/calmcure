const { getPool } = require('../config/db');

async function getMoodsByUser(userId) {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM moods WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
}

async function createMood({ user_id, mood, intensity, note }) {
    const pool = getPool();
    const res = await pool.query(
        'INSERT INTO moods (user_id, mood, intensity, note) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, mood, intensity, note]
    );
    return res.rows[0];
}

async function deleteMoodById(userId, moodId) {
    const pool = getPool();
    const res = await pool.query('DELETE FROM moods WHERE id = $1 AND user_id = $2 RETURNING *', [moodId, userId]);
    return res.rows[0];
}

module.exports = {
    getMoodsByUser,
    createMood,
    deleteMoodById
};
