// ticket pages (list, create, edit, resolve, delete)
const express = require('express');
const { Ticket, Asset } = require('../models');
const requireLogin = require('../middleware/requireLogin');
const { ticketEvents } = require('../audit/observer');

const router = express.Router();

// every ticket page needs a login
router.use('/tickets', requireLogin);

// used to fill the "asset" dropdown
function assetOptions() {
    return Asset.findAll({ order: [['name', 'ASC']] });
}

// list all tickets
router.get('/tickets', async (req, res) => {
    const tickets = await Ticket.findAll({ include: [Asset], order: [['createdAt', 'DESC']] });
    res.render('tickets/index', { title: 'Tickets', tickets });
});

// show the empty form
router.get('/tickets/new', async (req, res) => {
    res.render('tickets/form', {
        title: 'New ticket',
        ticket: null,
        assets: await assetOptions(),
        priorities: Ticket.PRIORITIES,
        error: null,
    });
});

// save a new ticket
router.post('/tickets', async (req, res) => {
    const { title, description, priority, assetId } = req.body;

    if (!title) {
        return res.status(400).render('tickets/form', {
            title: 'New ticket',
            ticket: req.body,
            assets: await assetOptions(),
            priorities: Ticket.PRIORITIES,
            error: 'A title is required',
        });
    }

    await Ticket.create({
        title,
        description,
        priority: priority || 'Medium',
        assetId: assetId || null,
    });

    res.redirect('/tickets');
});

// show one ticket
router.get('/tickets/:id', async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id, { include: [Asset] });
    if (!ticket) {
        return res.status(404).send('Ticket not found');
    }

    res.render('tickets/show', { title: ticket.title, ticket });
});

// show the form filled in
router.get('/tickets/:id/edit', async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
        return res.status(404).send('Ticket not found');
    }

    res.render('tickets/form', {
        title: 'Edit ticket',
        ticket,
        assets: await assetOptions(),
        priorities: Ticket.PRIORITIES,
        error: null,
    });
});

// save changes to a ticket
router.post('/tickets/:id', async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
        return res.status(404).send('Ticket not found');
    }

    const { title, description, priority, assetId } = req.body;

    if (!title) {
        return res.status(400).render('tickets/form', {
            title: 'Edit ticket',
            ticket: { ...req.body, id: ticket.id },
            assets: await assetOptions(),
            priorities: Ticket.PRIORITIES,
            error: 'A title is required',
        });
    }

    await ticket.update({
        title,
        description,
        priority: priority || ticket.priority,
        assetId: assetId || null,
    });

    res.redirect('/tickets/' + ticket.id);
});

// mark a ticket resolved, then announce it (the observer logs it)
router.post('/tickets/:id/resolve', async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
        return res.status(404).send('Ticket not found');
    }

    const from = ticket.status;
    if (from !== 'Resolved') {
        await ticket.update({ status: 'Resolved' });
        ticketEvents.emit('ticket:statusChanged', { ticketId: ticket.id, from, to: 'Resolved' });
    }

    res.redirect('/tickets/' + ticket.id);
});

// delete a ticket
router.post('/tickets/:id/delete', async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (ticket) {
        await ticket.destroy();
    }

    res.redirect('/tickets');
});

module.exports = router;
