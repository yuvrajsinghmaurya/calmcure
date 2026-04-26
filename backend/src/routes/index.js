const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const moodRoutes = require('./moodRoutes');
const journalRoutes = require('./journalRoutes');
const progressRoutes = require('./progressRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/moods', moodRoutes);
router.use('/journals', journalRoutes);
router.use('/progress', progressRoutes);

module.exports = router;
