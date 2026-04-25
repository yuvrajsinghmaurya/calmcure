const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { testConnection } = require('./src/config/db');

async function startServer() {
    try {
        await testConnection();
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed');
        console.error(error.message);
    }

    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
}

startServer();
