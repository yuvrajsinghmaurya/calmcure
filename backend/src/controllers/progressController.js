function getProgress(req, res) {
    res.status(501).json({
        success: false,
        message: 'Progress endpoint is not implemented yet'
    });
}

module.exports = {
    getProgress
};
