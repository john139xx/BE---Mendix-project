require('dotenv').config();
const { Client } = require('pg');

async function listTables() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db',
  };

  const client = new Client(config);
  try {
    await client.connect();
    const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') ORDER BY tablename;");
    if (res.rows.length === 0) {
      console.log('No tables found in database.');
    } else {
      console.log('Tables in database:');
      res.rows.forEach(r => console.log('-', r.tablename));
    }
  } catch (err) {
    console.error('Error listing tables:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

listTables();
