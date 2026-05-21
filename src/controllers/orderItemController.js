const { OrderItem } = require('../models');

const formatOrderItem = (orderItem) => {
  if (!orderItem) {
    return orderItem;
  }

  const plainItem = orderItem.toJSON ? orderItem.toJSON() : orderItem;
  return {
    quantity: plainItem.quantity,
    unitPrice: plainItem.unitPrice,
    subtotal: plainItem.subtotal,
  };
};

exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll({
      attributes: ['quantity', 'unitPrice', 'subtotal'],
    });
    res.json(orderItems.map(formatOrderItem));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      attributes: ['quantity', 'unitPrice', 'subtotal'],
    });
    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    res.json(formatOrderItem(orderItem));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity, unitPrice, subtotal } = req.body;
    const resolvedSubtotal = subtotal ?? Number(quantity) * Number(unitPrice);
    const orderItem = await OrderItem.create({ orderId, productId, quantity, unitPrice, subtotal: resolvedSubtotal });
    res.status(201).json(formatOrderItem(orderItem));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    const nextPayload = { ...req.body };
    if (nextPayload.quantity !== undefined || nextPayload.unitPrice !== undefined) {
      const quantity = nextPayload.quantity ?? orderItem.quantity;
      const unitPrice = nextPayload.unitPrice ?? orderItem.unitPrice;
      nextPayload.subtotal = nextPayload.subtotal ?? Number(quantity) * Number(unitPrice);
    }

    await orderItem.update(nextPayload);
    res.json(formatOrderItem(orderItem));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    await orderItem.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
