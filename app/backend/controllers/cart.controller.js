const cartService = require('../services/cart.service');
const { AppError } = require('../middlewares/error.middleware');

async function getMyCart(req, res) {
  const carrito = await cartService.getCartByUser(req.user.id);
  res.status(200).json(carrito);
}

async function addCartItem(req, res) {
  const { product_id, productId, qty, cantidad } = req.body;

  if (!product_id && !productId) {
    throw new AppError('Debes enviar product_id.', 400);
  }

  const item = await cartService.addCartItem(
    req.user.id,
    product_id || productId,
    qty || cantidad || 1
  );

  res.status(201).json({ item });
}

async function updateCartItem(req, res) {
  const { qty, cantidad } = req.body;

  if (qty == null && cantidad == null) {
    throw new AppError('Debes enviar qty para actualizar el carrito.', 400);
  }

  const item = await cartService.updateCartItem(
    req.user.id,
    req.params.productId,
    qty || cantidad
  );

  res.status(200).json({ item });
}

async function removeCartItem(req, res) {
  await cartService.removeCartItem(req.user.id, req.params.productId);
  res.status(200).json({ ok: true, message: 'Producto eliminado del carrito.' });
}

module.exports = {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
};
