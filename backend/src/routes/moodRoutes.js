const express = require('express');
const { getMoods, createMood, deleteMood } = require('../controllers/moodController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getMoods);
router.post('/', auth, createMood);
router.delete('/:id', auth, deleteMood);

module.exports = router;
