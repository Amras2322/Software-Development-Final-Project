// The Asset model: one row = one piece of hardware we keep track of
// (a laptop, a network switch, a server, etc.).

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Asset = sequelize.define(
  "Asset",

  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false, // e.g. "Front desk laptop"
    },

    // What kind of device it is, e.g. "laptop", "switch", "server".
    // Stored as text rather than a fixed list so we can add new kinds freely.
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // The manufacturer's serial number. Optional, because not every asset
    // will have one recorded.
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    tableName: "assets",
    underscored: true,
  }
);

module.exports = Asset;
