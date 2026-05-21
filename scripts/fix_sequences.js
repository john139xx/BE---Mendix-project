const { sequelize } = require('../src/models');

async function fix() {
  try {
    await sequelize.authenticate();
    const tables = ['products','users','carts','orders','cart_items','order_items'];
    for (const t of tables) {
      try {
        await sequelize.query(`SELECT setval(pg_get_serial_sequence('${t}','id'), (SELECT COALESCE(MAX(id),1) FROM ${t}))`);
        console.log(`Set sequence for ${t}`);
      } catch (e) {
        console.warn(`Skipping ${t}:`, e.message);
      }
    }
  } catch (e) {
    console.error('DB connect error', e.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

fix();
