const express = require('express');
const { getJournals, createJournal, deleteJournal } = require('../controllers/journalController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getJournals);
router.post('/', auth, createJournal);
router.delete('/:id', auth, deleteJournal);

module.exports = router;
