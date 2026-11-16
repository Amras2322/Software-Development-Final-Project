// all models in one place, plus how they relate
const sequelize = require("../db");

const User = require("./user");
const Asset = require("./asset");
const Ticket = require("./ticket");
const AuditLog = require("./auditLog");

// one asset has many tickets
Asset.hasMany(Ticket, { foreignKey: "assetId" });
Ticket.belongsTo(Asset, { foreignKey: "assetId" });

// one ticket has many log entries
Ticket.hasMany(AuditLog, { foreignKey: "ticketId" });
AuditLog.belongsTo(Ticket, { foreignKey: "ticketId" });

// User isn't linked to anything yet (auth comes later)

module.exports = { sequelize, User, Asset, Ticket, AuditLog };
