const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const ticketRoutes = require('./routes/tickets');
const requireLogin = require('./middleware/requireLogin');
const { sequelize, Ticket, Asset } = require('./models');

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

// tell every template whether someone is logged in (drives the nav)
app.use((req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.userId);
    next();
});

// register / login / logout
app.use(authRoutes);

// landing page
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// dashboard (only for logged-in users): open tickets grouped by priority
app.get('/dashboard', requireLogin, async (req, res) => {
    const open = await Ticket.findAll({ where: { status: 'Open' }, include: [Asset] });

    const byPriority = { High: [], Medium: [], Low: [] };
    open.forEach((ticket) => byPriority[ticket.priority].push(ticket));

    res.render('dashboard', { title: 'Dashboard', byPriority });
});

// asset pages
app.use(assetRoutes);

// ticket pages
app.use(ticketRoutes);

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
