const express = require('express');

const app = express();
const PORT = 3000;


// Only start server when running directly, not when testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`IT Asset & Ticket Manager server running at http://localhost:${PORT}`);
    });
}

module.exports = app;