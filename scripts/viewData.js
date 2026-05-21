require('dotenv').config();
const { sequelize, User, Product, Cart, CartItem, Order, OrderItem } = require('../src/models');

async function viewData() {
  try {
    await sequelize.authenticate();

    console.log('\n========== USERS ==========' + '\n');
    const users = await User.findAll();
    console.table(users.map((user) => ({
      ID: user.id.substring(0, 8),
      Email: user.email,
      'Full name': user.fullName,
      'Created at': user.createdAt,
    })));

    console.log('\n========== PRODUCTS ==========' + '\n');
    const products = await Product.findAll();
    console.table(products.map((product) => ({
      ID: product.id.substring(0, 8),
      Name: product.name,
      Description: product.description,
      Price: `$${product.price}`,
      Stock: product.stock,
      'Image URL': product.imageUrl,
    })));

    console.log('\n========== CARTS ==========' + '\n');
    const carts = await Cart.findAll();
    console.table(carts.map((cart) => ({
      ID: cart.id.substring(0, 8),
      'Total amount': `$${cart.totalAmount}`,
      'Created at': cart.createdAt,
    })));

    console.log('\n========== CART ITEMS ==========' + '\n');
    const cartItems = await CartItem.findAll();
    console.table(cartItems.map((item) => ({
      ID: item.id.substring(0, 8),
      Quantity: item.quantity,
      'Unit price': `$${item.unitPrice}`,
      Subtotal: `$${item.subtotal}`,
    })));

    console.log('\n========== ORDERS ==========' + '\n');
    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: { model: Product },
      },
    });
    console.table(orders.map((order) => ({
      ID: order.id.substring(0, 8),
      'Order number': order.orderNumber,
      'Total amount': `$${order.totalAmount}`,
      Status: order.status,
      'Order date': order.orderDate,
    })));

    console.log('\n========== ORDER ITEMS ==========' + '\n');
    const orderItems = await OrderItem.findAll({
      include: [
        { model: Order },
        { model: Product },
      ],
    });
    console.table(orderItems.map((item) => ({
      ID: item.id.substring(0, 8),
      'Order ID': item.orderId.substring(0, 8),
      Product: item.Product ? item.Product.name : '',
      Quantity: item.quantity,
      'Unit price': `$${item.unitPrice}`,
      Subtotal: `$${item.subtotal}`,
    })));

    console.log('\n✅ Data loaded successfully!\n');
  } catch (error) {
    console.error('Error viewing data:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

viewData();