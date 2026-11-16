// The Ticket model: one row = one support ticket.
//
// A ticket can (optionally) point at a specific asset, which is how we "link a
// ticket to a piece of hardware". That link is a foreign key: the assetId
// column here holds the id of a row in the assets table.

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// The only values we allow for priority and status. Keeping them as constants
// means the rest of the app can reuse them instead of retyping raw strings
// (and we can't accidentally typo "High" as "high" somewhere).
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

    // The long description. TEXT allows more characters than STRING.
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Medium",
      validate: { isIn: [PRIORITIES] }, // must be one of the three values above
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Open",
      validate: { isIn: [STATUSES] },
    },

    // Which asset this ticket is about. Allowed to be empty (null) because a
    // ticket doesn't have to be tied to a specific piece of hardware.
    // The relationship to the Asset model is set up in models/index.js.
    assetId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },

  {
    tableName: "tickets",
    underscored: true, // assetId is stored in the column asset_id
  }
);

// Attach the allowed values so other files can import them, e.g.
// `Ticket.PRIORITIES`. Useful when building a dropdown in a form.
Ticket.PRIORITIES = PRIORITIES;
Ticket.STATUSES = STATUSES;

module.exports = Ticket;
