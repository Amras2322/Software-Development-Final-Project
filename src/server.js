const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

// serve the front end out of src/public (keeps our source files private)
app.use(express.static(path.join(__dirname, 'public')));


// Only start server when running directly, not when testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`IT Asset & Ticket Manager server running at http://localhost:${PORT}`);
    });
}

module.exports = app;