function getMoods(req, res) {
    res.status(501).json({
        success: false,
        message: 'Get moods endpoint is not implemented yet'
    });
}

function createMood(req, res) {
    res.status(501).json({
        success: false,
        message: 'Create mood endpoint is not implemented yet'
    });
}

module.exports = {
    getMoods,
    createMood
};
