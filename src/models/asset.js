// Asset model - one row per piece of hardware
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
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING, // laptop, switch, server...
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true, // not every asset has one recorded
    },
  },
  {
    tableName: "assets",
    underscored: true,
  }
);

module.exports = Asset;
