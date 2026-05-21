const { Order } = require('../models');

const formatOrder = (order) => {
  if (!order) {
    return order;
  }

  const plainOrder = order.toJSON ? order.toJSON() : order;
  return {
    orderNumber: plainOrder.orderNumber,
    orderDate: plainOrder.orderDate,
    totalAmount: plainOrder.totalAmount,
  };
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: ['orderNumber', 'orderDate', 'totalAmount'],
    });
    res.json(orders.map(formatOrder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      attributes: ['orderNumber', 'orderDate', 'totalAmount'],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(formatOrder(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { orderNumber, totalAmount, orderDate } = req.body;
    const order = await Order.create({
      orderNumber,
      totalAmount,
      orderDate,
    });

    res.status(201).json(formatOrder(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update(req.body);
    await order.reload(); // Reload từ database
    res.json(formatOrder(order));
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
