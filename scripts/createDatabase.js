require('dotenv').config();
const { Client } = require('pg');

async function ensureDatabase() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres',
  };

  const client = new Client(config);
  try {
    await client.connect();

    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" not found. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error ensuring database exists:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

ensureDatabase();
