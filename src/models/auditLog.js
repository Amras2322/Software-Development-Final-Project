// AuditLog model - records events about tickets (Observer pattern)
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
    action: {
      type: DataTypes.STRING, // e.g. status_changed
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING, // e.g. Open -> Resolved
      allowNull: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "audit_logs",
    underscored: true,
    updatedAt: false, // entries never change, so no updated_at
  }
);

module.exports = AuditLog;
