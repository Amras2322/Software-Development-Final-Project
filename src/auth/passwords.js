// password hashing helpers (bcryptjs)
const bcrypt = require('bcryptjs');

// higher = harder to crack but slower to log in
const SALT_ROUNDS = 10;

// plain password -> hash for storing
async function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// plain password vs stored hash -> true/false
async function verifyPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
}

module.exports = { hashPassword, verifyPassword };
