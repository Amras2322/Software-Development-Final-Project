const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const requireLogin = require('./middleware/requireLogin');
const { sequelize } = require('./models');

const app = express();
const PORT = 3000;

// render EJS templates from src/views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// serve the front end out of src/public (keeps our source files private)
app.use(express.static(path.join(__dirname, 'public')));

// so req.body has the fields from submitted <form>s
app.use(express.urlencoded({ extended: false }));

// keeps users logged in between requests
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
    },
}));

// register / login / logout
app.use(authRoutes);

// dashboard (only for logged-in users)
app.get('/dashboard', requireLogin, (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

// Only start server when running directly, not when testing
if (require.main === module) {
    // create any missing tables, then start listening
    sequelize.sync().then(() => {
        app.listen(PORT, () => {
            console.log(`IT Asset & Ticket Manager server running at http://localhost:${PORT}`);
        });
    });
}

module.exports = app;
