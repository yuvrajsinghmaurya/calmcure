const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS for browser-based frontend requests
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        app: 'CalmCure API',
        status: 'running',
        version: '1.0.0'
    });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
