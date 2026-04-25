
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/user');
const env = require('../config/env');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        const password_hash = await bcrypt.hash(password, 10);
        const user = await createUser({ name, email, password_hash });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required.' });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
}

module.exports = {
    register,
    login
};
