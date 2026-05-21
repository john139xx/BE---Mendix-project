const { Cart, CartItem, Product } = require('../models');

const formatCart = (cart) => {
  if (!cart) {
    return cart;
  }

  const plainCart = cart.toJSON ? cart.toJSON() : cart;
  return {
    cart_id: plainCart.id,
    createdDate: plainCart.createdDate,
    lastModified: plainCart.lastModified,
  };
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    const formatted = carts.map((c) => {
      const plain = c.toJSON ? c.toJSON() : c;
      return {
        cart_id: plain.id,
        createdDate: plain.createdDate,
        lastModified: plain.lastModified,
        userId: plain.userId,
        CartItems: plain.items || [],
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCartsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await Cart.findAll({
      where: { userId },
    });

    const formatted = carts.map((c) => {
      const plainCart = c.toJSON ? c.toJSON() : c;
      return {
        cart_id: plainCart.id,
        createdDate: plainCart.createdDate,
        lastModified: plainCart.lastModified,
        CartItems: plainCart.items || [],
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const plainCart = cart.toJSON ? cart.toJSON() : cart;
    res.json({
      cart_id: plainCart.id,
      createdDate: plainCart.createdDate,
      lastModified: plainCart.lastModified,
      CartItems: plainCart.items || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.create({
      createdDate: new Date(),
      lastModified: new Date(),
      items: [],
    });
    
    res.status(201).json(formatCart(cart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.update({
      ...req.body,
      lastModified: new Date(),
    });
    await cart.reload(); // Reload từ database
    
    res.json(formatCart(cart));
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

