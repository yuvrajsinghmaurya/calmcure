
const { getJournalsByUser, createJournal: createJournalDb } = require('../models/journal');
const { deleteJournalById } = require('../models/journal');

async function getJournals(req, res) {
    try {
        const userId = req.user.id;
        const journals = await getJournalsByUser(userId);
        res.json({ success: true, journals });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch journals', error: err.message });
    }
}

async function createJournal(req, res) {
    try {
        const userId = req.user.id;
        const { mood, content, reflection } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, message: 'Content required' });
        }
        const newJournal = await createJournalDb({ user_id: userId, mood, content, reflection });
        res.status(201).json({ success: true, journal: newJournal });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create journal', error: err.message });
    }
}

async function deleteJournal(req, res) {
    try {
        const userId = req.user.id;
        const journalId = req.params.id;
        const deleted = await deleteJournalById(userId, journalId);
        if (!deleted) return res.status(404).json({ success: false, message: 'Journal not found' });
        res.json({ success: true, journal: deleted });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete journal', error: err.message });
    }
}

module.exports = {
    getJournals,
    createJournal
    , deleteJournal
};
