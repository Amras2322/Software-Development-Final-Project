// Observer pattern: ticket code announces a change, this listens and logs it.
// ref: https://nodejs.org/api/events.html
const { EventEmitter } = require('events');
const { AuditLog } = require('../models');

const ticketEvents = new EventEmitter();

// write a row whenever a ticket's status changes
ticketEvents.on('ticket:statusChanged', ({ ticketId, from, to }) => {
    AuditLog.create({
        ticketId,
        action: 'status_changed',
        detail: `${from} -> ${to}`,
    });
});

module.exports = { ticketEvents };
