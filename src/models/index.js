// This file is the single entry point for all of our models.
//
// Each model lives in its own file. Here we:
//   1. import them all,
//   2. describe how they relate to each other, and
//   3. export them together.
//
// That way the rest of the app only needs one line:
//
//     const { User, Asset, Ticket, AuditLog } = require("./models");

const sequelize = require("../db");

const User = require("./user");
const Asset = require("./asset");
const Ticket = require("./ticket");
const AuditLog = require("./auditLog");

// --- Relationships ("associations") -----------------------------------------
//
// An association tells Sequelize how two tables are linked. Declaring both
// directions lets us go either way in our code, e.g. `ticket.asset` to get a
// ticket's asset, or `asset.tickets` to get all tickets for an asset.

// One asset can have many tickets; each ticket belongs to one asset.
// This is what creates the asset_id column on the tickets table.
Asset.hasMany(Ticket, { foreignKey: "assetId" });
Ticket.belongsTo(Asset, { foreignKey: "assetId" });

// One ticket can have many audit log entries; each entry belongs to one ticket.
// This creates the ticket_id column on the audit_logs table.
Ticket.hasMany(AuditLog, { foreignKey: "ticketId" });
AuditLog.belongsTo(Ticket, { foreignKey: "ticketId" });

// User isn't linked to anything yet. It exists so we can add login/logout in a
// later step, at which point we can connect users to the tickets they create.

// Everything is exported together. `sequelize` is included so other files can
// run database setup (like sequelize.sync()) without importing it separately.
module.exports = { sequelize, User, Asset, Ticket, AuditLog };
