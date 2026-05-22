const { Cart, CartItem, Product } = require('../models');

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const serializeProduct = (product) => ({
  id: product.id,
  productName: product.productName,
  description: product.description,
  price: toNumber(product.price),
  quantity: product.quantity,
  category: product.category,
  image: product.image,
  sku: product.sku,
  active: product.active,
});

const enrichCartItems = async (items) => {
  const sourceItems = Array.isArray(items) ? items : [];
  const productIds = [...new Set(sourceItems
    .map((item) => item && item.productId)
    .filter((value) => value !== undefined && value !== null))];

  const products = productIds.length > 0
    ? await Product.findAll({ where: { id: productIds } })
    : [];

  const productMap = new Map(products.map((product) => [String(product.id), product]));

  const enrichedItems = sourceItems.map((item, index) => {
    const product = productMap.get(String(item.productId)) || null;
    const quantity = toNumber(item.quantity, 1);
    const unitPrice = toNumber(item.unitPrice, product ? product.price : 0);
    const subtotal = toNumber(item.subtotal, unitPrice * quantity);

    return {
      id: item.id || `${item.productId || 'item'}-${index + 1}`,
      productId: item.productId || (product ? product.id : null),
      quantity,
      unitPrice,
      subtotal,
      product: product ? serializeProduct(product) : item.product || null,
    };
  });

  const totalPrice = enrichedItems.reduce((sum, item) => sum + toNumber(item.subtotal), 0);

  return { items: enrichedItems, totalPrice };
};

const buildCartResponse = async (cart) => {
  if (!cart) {
    return cart;
  }

  const plainCart = cart.toJSON ? cart.toJSON() : cart;
  const { items, totalPrice } = await enrichCartItems(plainCart.items || []);

  return {
    cart_id: plainCart.id,
    userId: plainCart.userId,
    createdDate: plainCart.createdDate,
    lastModified: plainCart.lastModified,
    items,
    CartItems: items,
    totalPrice,
  };
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    const formatted = await Promise.all(carts.map((cart) => buildCartResponse(cart)));
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

    const formatted = await Promise.all(carts.map((cart) => buildCartResponse(cart)));

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

    res.json(await buildCartResponse(cart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.create({
      userId: req.body.userId ?? null,
      createdDate: new Date(),
      lastModified: new Date(),
      items: [],
    });
    
    res.status(201).json(await buildCartResponse(cart));
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

    const updates = {
      lastModified: new Date(),
    };

    if (Object.prototype.hasOwnProperty.call(req.body, 'userId')) {
      updates.userId = req.body.userId;
    }

    if (Array.isArray(req.body.items)) {
      const normalizedItems = await Promise.all(req.body.items.map(async (item, index) => {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const quantity = toNumber(item.quantity, 1);
        const unitPrice = toNumber(item.unitPrice, product.price);
        const subtotal = toNumber(item.subtotal, unitPrice * quantity);

        return {
          id: item.id || `${product.id}-${index + 1}`,
          productId: product.id,
          quantity,
          unitPrice,
          subtotal,
          product: serializeProduct(product),
        };
      }));

      updates.items = normalizedItems;
    } else if (Object.prototype.hasOwnProperty.call(req.body, 'productId')) {
      const product = await Product.findByPk(req.body.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const currentItems = Array.isArray(cart.items) ? [...cart.items] : [];
      const quantityToAdd = toNumber(req.body.quantity, 1);
      const existingIndex = currentItems.findIndex((item) => String(item.productId) === String(product.id));

      if (existingIndex >= 0) {
        const existingItem = currentItems[existingIndex];
        const newQuantity = toNumber(existingItem.quantity, 0) + quantityToAdd;
        const unitPrice = toNumber(existingItem.unitPrice, toNumber(product.price));

        currentItems[existingIndex] = {
          ...existingItem,
          productId: product.id,
          quantity: newQuantity,
          unitPrice,
          subtotal: unitPrice * newQuantity,
          product: serializeProduct(product),
        };
      } else {
        const unitPrice = toNumber(product.price);
        currentItems.push({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          quantity: quantityToAdd,
          unitPrice,
          subtotal: unitPrice * quantityToAdd,
          product: serializeProduct(product),
        });
      }

      updates.items = currentItems;
    } else if (Object.prototype.hasOwnProperty.call(req.body, 'items')) {
      updates.items = req.body.items;
    }

    await cart.update(updates);
    await cart.reload();

    res.json(await buildCartResponse(cart));
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

