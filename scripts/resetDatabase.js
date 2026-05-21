require('dotenv').config();
const { sequelize } = require('../src/models');

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ force: true });
    console.log('Database reset completed');
  } catch (error) {
    console.error('Error resetting database:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

resetDatabase();
