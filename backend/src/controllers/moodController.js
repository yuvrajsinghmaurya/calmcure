
const { getMoodsByUser, createMood: createMoodDb } = require('../models/mood');

const { deleteMoodById } = require('../models/mood');

async function getMoods(req, res) {
    try {
        const userId = req.user.id;
        const moods = await getMoodsByUser(userId);
        res.json({ success: true, moods });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch moods', error: err.message });
    }
}

async function createMood(req, res) {
    try {
        const userId = req.user.id;
        const { mood, intensity, note } = req.body;
        if (!mood || !intensity) {
            return res.status(400).json({ success: false, message: 'Mood and intensity required' });
        }
        const newMood = await createMoodDb({ user_id: userId, mood, intensity, note });
        res.status(201).json({ success: true, mood: newMood });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create mood', error: err.message });
    }
}

async function deleteMood(req, res) {
    try {
        const userId = req.user.id;
        const moodId = req.params.id;
        const deleted = await deleteMoodById(userId, moodId);
        if (!deleted) return res.status(404).json({ success: false, message: 'Mood not found' });
        res.json({ success: true, mood: deleted });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete mood', error: err.message });
    }
}

module.exports = {
    getMoods,
    createMood
    , deleteMood
};
