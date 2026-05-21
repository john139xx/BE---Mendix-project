const { sequelize } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "role";');
    console.log('Dropped role column from users table');

    process.exit(0);
  } catch (error) {
    console.error('Failed to remove role column:', error);
    process.exit(1);
  }
})();
