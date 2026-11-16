// Ticket model - one row per support ticket
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// allowed values, kept here so we don't retype strings everywhere
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Open", "Resolved"];

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // TEXT holds more than STRING
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Medium",
      validate: { isIn: [PRIORITIES] },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Open",
      validate: { isIn: [STATUSES] },
    },
    // asset this ticket is about (null if it isn't tied to hardware)
    assetId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tickets",
    underscored: true, // assetId -> asset_id
  }
);

// so other files can do Ticket.PRIORITIES (e.g. for a dropdown)
Ticket.PRIORITIES = PRIORITIES;
Ticket.STATUSES = STATUSES;

module.exports = Ticket;
