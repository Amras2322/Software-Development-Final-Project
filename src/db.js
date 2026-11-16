// This file creates the single connection to our SQLite database.
//
// "Sequelize" is an ORM (Object-Relational Mapper). Instead of writing raw SQL
// by hand, we describe our data as JavaScript objects and Sequelize turns our
// calls into SQL for us.
//
// Every model in src/models/ imports this same connection, so the whole app
// talks to one database.

const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

// When we run the tests, use a temporary in-memory database so tests are fast
// and never touch our real data. Everywhere else, use a file on disk.
const isTest = process.env.NODE_ENV === "test";
const storage = isTest
  ? ":memory:" // lives only in RAM, thrown away when the process ends
  : path.join(__dirname, "..", "instance", "app.db"); // a real file in ./instance

// SQLite will create the database *file* for us, but not the *folder* it sits
// in, so we make sure that folder exists first.
if (!isTest) {
  fs.mkdirSync(path.dirname(storage), { recursive: true });
}

// Create the connection object. `storage` is where the database lives.
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false, // change to console.log to watch the SQL Sequelize runs
});

// Other files do `const sequelize = require("../db")` to reuse this connection.
module.exports = sequelize;
