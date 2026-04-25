const express = require('express');
const { getProgress } = require('../controllers/progressController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getProgress);

module.exports = router;
