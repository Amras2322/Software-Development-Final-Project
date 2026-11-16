// The User model: one row in this table = one account that can log in.
//
// A "model" is just a description of a database table. Sequelize reads this
// description and can then create, read, and update rows for us.

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  // 1. The model name (used internally and in error messages).
  "User",

  // 2. The columns of the table.
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // uniquely identifies each row
      autoIncrement: true, // 1, 2, 3, ... handled automatically
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false, // every user must have an email
      unique: true, // no two users can share an email
      validate: { isEmail: true }, // reject values that aren't email-shaped
    },

    // We never store the real password. We store a one-way hash of it, so even
    // if the database is seen, the passwords can't be read.
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  // 3. Extra options.
  {
    tableName: "users", // the actual table name in SQLite
    underscored: true, // name columns like created_at instead of createdAt
    // timestamps are on by default, which adds created_at and updated_at
  }
);

// Other files do `const User = require("./user")` to use this model.
module.exports = User;
