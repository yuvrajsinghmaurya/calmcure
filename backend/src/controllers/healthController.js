const { testConnection } = require('../config/db');

async function getHealth(req, res, next) {
    try {
        await testConnection();

        res.json({
            success: true,
            message: 'CalmCure backend is healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getHealth
};
