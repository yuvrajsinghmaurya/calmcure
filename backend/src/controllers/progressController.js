const { getPool } = require('../config/db');

async function getProgress(req, res) {
    try {
        const userId = req.user.id;
        const pool = getPool();

        const totalMoodsRes = await pool.query('SELECT COUNT(*) AS count FROM moods WHERE user_id = $1', [userId]);
        const totalJournalsRes = await pool.query('SELECT COUNT(*) AS count FROM journals WHERE user_id = $1', [userId]);
        const dominantRes = await pool.query(
            `SELECT mood, COUNT(*) AS cnt FROM moods WHERE user_id = $1 GROUP BY mood ORDER BY cnt DESC LIMIT 1`,
            [userId]
        );

        const total_moods = Number(totalMoodsRes.rows[0].count || 0);
        const total_journals = Number(totalJournalsRes.rows[0].count || 0);
        const dominant_mood = dominantRes.rows[0] ? dominantRes.rows[0].mood : null;

        res.json({ success: true, total_moods, total_journals, dominant_mood });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to compute progress', error: err.message });
    }
}

module.exports = {
    getProgress
};
