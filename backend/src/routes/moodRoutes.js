const express = require('express');
const { getMoods, createMood } = require('../controllers/moodController');

const router = express.Router();

router.get('/', getMoods);
router.post('/', createMood);

module.exports = router;
