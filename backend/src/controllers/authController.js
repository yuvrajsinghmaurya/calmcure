function register(req, res) {
    res.status(501).json({
        success: false,
        message: 'Register endpoint is not implemented yet'
    });
}

function login(req, res) {
    res.status(501).json({
        success: false,
        message: 'Login endpoint is not implemented yet'
    });
}

module.exports = {
    register,
    login
};
