// register, login, logout
const express = require('express');
const { User } = require('../models');
const { hashPassword, verifyPassword } = require('../auth/passwords');

const router = express.Router();

// show the register form
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// create the account, then log them straight in
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('register', { error: 'Email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
        return res.status(400).render('register', { error: 'That email is already taken' });
    }

    const user = await User.create({
        email,
        passwordHash: await hashPassword(password),
    });

    req.session.userId = user.id;
    res.redirect('/dashboard');
});

// show the login form
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// check the password and start a session
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    const ok = user && (await verifyPassword(password, user.passwordHash));

    if (!ok) {
        return res.status(400).render('login', { error: 'Invalid email or password' });
    }

    req.session.userId = user.id;
    res.redirect('/dashboard');
});

// end the session
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
