const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const migrationsDir = path.join(rootDir, 'database', 'migrations');

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) continue;

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) continue;

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}

function getClient(databaseName) {
    return new Client({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: databaseName
    });
}

function quoteIdentifier(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
}

async function ensureDatabase(database, maintenanceDatabase) {
    const client = getClient(maintenanceDatabase);
    await client.connect();

    try {
        const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1;', [database]);

        if (result.rowCount === 0) {
            console.log(`Creating database ${database}`);
            await client.query(`CREATE DATABASE ${quoteIdentifier(database)};`);
        }
    } finally {
        await client.end();
    }
}

async function runMigrations(database) {
    const client = getClient(database);
    await client.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const appliedResult = await client.query('SELECT name FROM schema_migrations ORDER BY name;');
        const applied = new Set(appliedResult.rows.map((row) => row.name));

        const migrationFiles = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort();

        for (const file of migrationFiles) {
            if (applied.has(file)) {
                console.log(`Skipping ${file}`);
                continue;
            }

            const migrationPath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(migrationPath, 'utf8');

            console.log(`Applying ${file}`);

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO schema_migrations (name) VALUES ($1);', [file]);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        }
    } finally {
        await client.end();
    }
}

async function main() {
    loadEnvFile(envPath);

    const database = process.env.DB_NAME || 'mydb';
    const maintenanceDatabase = process.env.DB_MAINTENANCE_NAME || 'postgres';

    await ensureDatabase(database, maintenanceDatabase);
    await runMigrations(database);

    console.log('Migrations completed');
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
