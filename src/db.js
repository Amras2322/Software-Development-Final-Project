// database connection (sequelize orm)
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

// tests get a throwaway in-memory db, otherwise a file in ./instance
const isTest = process.env.NODE_ENV === "test";
const storage = isTest
  ? ":memory:"
  : process.env.DB_STORAGE || path.join(__dirname, "..", "instance", "app.db");

// sqlite makes the file but not the folder, so create it first
if (!isTest) {
  fs.mkdirSync(path.dirname(storage), { recursive: true });
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false, // set to console.log to see the SQL
});

module.exports = sequelize;
