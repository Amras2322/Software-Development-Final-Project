// The AuditLog model: one row = one recorded event about a ticket.
//
// This is what backs our "Observer" design pattern. When something happens to
// a ticket (for example its status changes from Open to Resolved), we write a
// row here. The ticket code only *announces* that a change happened; this log
// is written separately, so the two pieces stay independent of each other.

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AuditLog = sequelize.define(
  "AuditLog",

  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // What kind of event this was, e.g. "status_changed".
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // A human-readable note about the event, e.g. "Open -> Resolved".
    detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Which ticket this entry is about. The relationship to the Ticket model
    // is set up in models/index.js.
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    tableName: "audit_logs",
    underscored: true,
    // Log entries are written once and never edited, so we only need a
    // created_at timestamp. Turning off updatedAt avoids a useless column.
    updatedAt: false,
  }
);

module.exports = AuditLog;
