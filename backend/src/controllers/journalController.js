function getJournals(req, res) {
    res.status(501).json({
        success: false,
        message: 'Get journals endpoint is not implemented yet'
    });
}

function createJournal(req, res) {
    res.status(501).json({
        success: false,
        message: 'Create journal endpoint is not implemented yet'
    });
}

module.exports = {
    getJournals,
    createJournal
};
