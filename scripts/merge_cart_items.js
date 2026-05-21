const { Cart, CartItem, Product, sequelize } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // ensure items column exists
    try {
      await sequelize.query("ALTER TABLE \"carts\" ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;");
      console.log('Ensured items column exists');
    } catch (e) {
      console.warn('Could not ensure items column via raw query, continuing:', e.message || e);
    }

    const carts = await Cart.findAll();
    for (const cart of carts) {
      const cartId = cart.id;
      const items = await CartItem.findAll({ where: { cartId } });
      const migrated = [];
      for (const it of items) {
        const plain = it.toJSON();
        // try to fetch product snapshot
        let product = null;
        try {
          product = await Product.findByPk(plain.productId);
        } catch (e) {
          product = null;
        }
        const productPlain = product ? (product.toJSON ? product.toJSON() : product) : null;
        migrated.push({
          id: plain.id,
          productId: plain.productId,
          quantity: plain.quantity,
          unitPrice: plain.unitPrice,
          subtotal: plain.subtotal,
          Product: productPlain,
        });
      }

      if (migrated.length > 0) {
        cart.items = migrated;
        await cart.save();
        console.log(`Migrated ${migrated.length} items into cart ${cartId}`);
        // delete cart items
        await CartItem.destroy({ where: { cartId } });
        console.log(`Deleted CartItem rows for cart ${cartId}`);
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration error', error);
    process.exit(1);
  }
})();
