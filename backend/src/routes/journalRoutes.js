const express = require('express');
const { getJournals, createJournal } = require('../controllers/journalController');

const router = express.Router();

router.get('/', getJournals);
router.post('/', createJournal);

module.exports = router;
