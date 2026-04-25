const express = require('express'); // import express

const app = express(); // create app instance

const PORT = 8000; // define port

// create route
app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

// start server
app.listen(PORT, () => {
    console.log(`Serverd started at http://localhost:${PORT}`);
});