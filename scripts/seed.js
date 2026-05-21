require('dotenv').config();
const { sequelize, User, Product, Cart, CartItem, Order, OrderItem } = require('../src/models');

const calculateSubtotal = (quantity, unitPrice) => Number(quantity) * Number(unitPrice);

const ids = {
  users: {
    customer1: 1,
    customer2: 2,
    customer3: 3,
    customer4: 4,
    admin: 5,
  },
  products: {
    laptop: 1,
    tablet: 2,
    monitor: 3,
    keyboard: 4,
    mouse: 5,
    headset: 6,
    chair: 7,
    desk: 8,
  },
  carts: {
    cart1: 1,
    cart2: 2,
    cart3: 3,
    cart4: 4,
  },
  orders: {
    order1: 1,
    order2: 2,
    order3: 3,
    order4: 4,
  },
};

const users = [
  {
    id: ids.users.customer1,
    email: 'customer1@example.com',
    fullName: 'Nguyen Van A',
    phoneNumber: '0123456789',
    address: '123 Le Loi',
    city: 'Ho Chi Minh City',
    province: 'Ho Chi Minh',
    postalCode: '700000',
    role: 'customer',
  },
  {
    id: ids.users.customer2,
    email: 'customer2@example.com',
    fullName: 'Tran Thi B',
    phoneNumber: '0987654321',
    address: '45 Tran Hung Dao',
    city: 'Ha Noi',
    province: 'Ha Noi',
    postalCode: '100000',
    role: 'customer',
  },
  {
    id: ids.users.customer3,
    email: 'customer3@example.com',
    fullName: 'Le Van C',
    phoneNumber: '0901234567',
    address: '88 Nguyen Trai',
    city: 'Da Nang',
    province: 'Da Nang',
    postalCode: '550000',
    role: 'customer',
  },
  {
    id: ids.users.customer4,
    email: 'customer4@example.com',
    fullName: 'Pham Thi D',
    phoneNumber: '0911222333',
    address: '19 Phan Dinh Phung',
    city: 'Hai Phong',
    province: 'Hai Phong',
    postalCode: '040000',
    role: 'customer',
  },
  {
    id: ids.users.admin,
    email: 'admin@example.com',
    fullName: 'Admin User',
    phoneNumber: '0999888777',
    address: '1 System Plaza',
    city: 'Ho Chi Minh City',
    province: 'Ho Chi Minh',
    postalCode: '710000',
    role: 'admin',
  },
];

const products = [
  {
    id: ids.products.laptop,
    productName: 'Laptop Dell XPS 13',
    description: 'High performance laptop for work and gaming',
    price: 1299.99,
    category: 'Electronics',
    quantity: 20,
    sku: 'ELEC-LAP-001',
    image: 'https://example.com/images/laptop-dell-xps-13.jpg',
  },
  {
    id: ids.products.tablet,
    productName: 'Apple iPad Pro',
    description: 'Powerful tablet for creative professionals',
    price: 999.99,
    category: 'Tablets',
    quantity: 25,
    sku: 'TAB-IPAD-001',
    image: 'https://example.com/images/apple-ipad-pro.jpg',
  },
  {
    id: ids.products.monitor,
    productName: 'Samsung 4K Monitor',
    description: '32 inch 4K Ultra HD Monitor',
    price: 599.99,
    category: 'Displays',
    quantity: 15,
    sku: 'DISP-MON-001',
    image: 'https://example.com/images/samsung-4k-monitor.jpg',
  },
  {
    id: ids.products.keyboard,
    productName: 'Mechanical Keyboard',
    description: 'RGB Mechanical Gaming Keyboard',
    price: 149.99,
    category: 'Accessories',
    quantity: 50,
    sku: 'ACC-KEY-001',
    image: 'https://example.com/images/mechanical-keyboard.jpg',
  },
  {
    id: ids.products.mouse,
    productName: 'Wireless Mouse',
    description: 'Precision Wireless Mouse with fast scrolling',
    price: 49.99,
    category: 'Accessories',
    quantity: 70,
    sku: 'ACC-MOU-001',
    image: 'https://example.com/images/wireless-mouse.jpg',
  },
  {
    id: ids.products.headset,
    productName: 'Noise Cancelling Headset',
    description: 'Comfortable headset for meetings and gaming',
    price: 89.99,
    category: 'Audio',
    quantity: 35,
    sku: 'AUD-HSE-001',
    image: 'https://example.com/images/noise-cancelling-headset.jpg',
  },
  {
    id: ids.products.chair,
    productName: 'Ergonomic Office Chair',
    description: 'Adjustable chair for long working hours',
    price: 229.99,
    category: 'Furniture',
    quantity: 18,
    sku: 'FUR-CHR-001',
    image: 'https://example.com/images/ergonomic-office-chair.jpg',
  },
  {
    id: ids.products.desk,
    productName: 'Standing Desk',
    description: 'Height adjustable desk for home office',
    price: 399.99,
    category: 'Furniture',
    quantity: 12,
    sku: 'FUR-DSK-001',
    image: 'https://example.com/images/standing-desk.jpg',
  },
];

const carts = [
  {
    id: ids.carts.cart1,
    userId: ids.users.customer1,
    createdDate: new Date('2026-05-01T08:00:00.000Z'),
    lastModified: new Date('2026-05-02T09:00:00.000Z'),
  },
  {
    id: ids.carts.cart2,
    userId: ids.users.customer2,
    createdDate: new Date('2026-05-03T08:00:00.000Z'),
    lastModified: new Date('2026-05-04T09:00:00.000Z'),
  },
  {
    id: ids.carts.cart3,
    userId: ids.users.customer3,
    createdDate: new Date('2026-05-05T08:00:00.000Z'),
    lastModified: new Date('2026-05-06T09:00:00.000Z'),
  },
  {
    id: ids.carts.cart4,
    userId: ids.users.customer4,
    createdDate: new Date('2026-05-07T08:00:00.000Z'),
    lastModified: new Date('2026-05-08T09:00:00.000Z'),
  },
];

const orders = [
  {
    id: ids.orders.order1,
    orderNumber: 'ORD-001',
    userId: ids.users.customer1,
    totalAmount: 1449.98,
    orderDate: new Date('2026-05-10T10:00:00.000Z'),
    status: 'processing',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    shippingAddress: '123 Le Loi, Ho Chi Minh City',
    notes: 'Deliver during office hours',
  },
  {
    id: ids.orders.order2,
    orderNumber: 'ORD-002',
    userId: ids.users.customer2,
    totalAmount: 1049.98,
    orderDate: new Date('2026-05-11T10:00:00.000Z'),
    status: 'pending',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shippingAddress: '45 Tran Hung Dao, Ha Noi',
    notes: null,
  },
  {
    id: ids.orders.order3,
    orderNumber: 'ORD-003',
    userId: ids.users.customer3,
    totalAmount: 829.98,
    orderDate: new Date('2026-05-12T10:00:00.000Z'),
    status: 'shipped',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'completed',
    shippingAddress: '88 Nguyen Trai, Da Nang',
    notes: 'Call before delivery',
  },
  {
    id: ids.orders.order4,
    orderNumber: 'ORD-004',
    userId: ids.users.customer4,
    totalAmount: 629.98,
    orderDate: new Date('2026-05-13T10:00:00.000Z'),
    status: 'delivered',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    shippingAddress: '19 Phan Dinh Phung, Hai Phong',
    notes: null,
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding');

    console.log('Clearing existing data...');
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await CartItem.destroy({ where: {} });
    await Cart.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('Creating users...');
    await User.bulkCreate(users);

    console.log('Creating products...');
    await Product.bulkCreate(products);

    console.log('Creating carts...');
    await Cart.bulkCreate(carts);

    console.log('Adding items to carts...');
    await CartItem.bulkCreate([
      {
        cartId: ids.carts.cart1,
        productId: ids.products.laptop,
        quantity: 1,
        unitPrice: products[0].price,
        subtotal: calculateSubtotal(1, products[0].price),
      },
      {
        cartId: ids.carts.cart1,
        productId: ids.products.monitor,
        quantity: 2,
        unitPrice: products[2].price,
        subtotal: calculateSubtotal(2, products[2].price),
      },
      {
        cartId: ids.carts.cart2,
        productId: ids.products.tablet,
        quantity: 1,
        unitPrice: products[1].price,
        subtotal: calculateSubtotal(1, products[1].price),
      },
      {
        cartId: ids.carts.cart2,
        productId: ids.products.keyboard,
        quantity: 3,
        unitPrice: products[3].price,
        subtotal: calculateSubtotal(3, products[3].price),
      },
      {
        cartId: ids.carts.cart3,
        productId: ids.products.mouse,
        quantity: 2,
        unitPrice: products[4].price,
        subtotal: calculateSubtotal(2, products[4].price),
      },
      {
        cartId: ids.carts.cart3,
        productId: ids.products.headset,
        quantity: 1,
        unitPrice: products[5].price,
        subtotal: calculateSubtotal(1, products[5].price),
      },
      {
        cartId: ids.carts.cart4,
        productId: ids.products.chair,
        quantity: 1,
        unitPrice: products[6].price,
        subtotal: calculateSubtotal(1, products[6].price),
      },
      {
        cartId: ids.carts.cart4,
        productId: ids.products.desk,
        quantity: 1,
        unitPrice: products[7].price,
        subtotal: calculateSubtotal(1, products[7].price),
      },
    ]);

    console.log('Creating orders...');
    await Order.bulkCreate(orders);

    await OrderItem.bulkCreate([
      {
        orderId: ids.orders.order1,
        productId: ids.products.laptop,
        quantity: 1,
        unitPrice: products[0].price,
        subtotal: calculateSubtotal(1, products[0].price),
      },
      {
        orderId: ids.orders.order1,
        productId: ids.products.keyboard,
        quantity: 1,
        unitPrice: products[3].price,
        subtotal: calculateSubtotal(1, products[3].price),
      },
      {
        orderId: ids.orders.order2,
        productId: ids.products.tablet,
        quantity: 1,
        unitPrice: products[1].price,
        subtotal: calculateSubtotal(1, products[1].price),
      },
      {
        orderId: ids.orders.order2,
        productId: ids.products.mouse,
        quantity: 1,
        unitPrice: products[4].price,
        subtotal: calculateSubtotal(1, products[4].price),
      },
      {
        orderId: ids.orders.order2,
        productId: ids.products.headset,
        quantity: 1,
        unitPrice: products[5].price,
        subtotal: calculateSubtotal(1, products[5].price),
      },
      {
        orderId: ids.orders.order3,
        productId: ids.products.monitor,
        quantity: 1,
        unitPrice: products[2].price,
        subtotal: calculateSubtotal(1, products[2].price),
      },
      {
        orderId: ids.orders.order3,
        productId: ids.products.chair,
        quantity: 1,
        unitPrice: products[6].price,
        subtotal: calculateSubtotal(1, products[6].price),
      },
      {
        orderId: ids.orders.order4,
        productId: ids.products.desk,
        quantity: 1,
        unitPrice: products[7].price,
        subtotal: calculateSubtotal(1, products[7].price),
      },
    ]);

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nSample data created:');
    console.log('- Users: 5 records, including 1 admin');
    console.log('- Products: 8 records with simple SKU codes');
    console.log('- Carts: 4 carts with items');
    console.log('- Orders: 4 orders with items');
    console.log('- IDs: fixed numeric IDs so you can reference them directly in Mendix or API tests');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();