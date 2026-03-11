const ordersService = require('../services/orders.service');
const { AppError } = require('../middlewares/error.middleware');

async function createOrder(req, res) {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Debes enviar al menos un item para crear el pedido.', 400);
  }

  const pedido = await ordersService.createOrder(req.user.id, { items });
  res.status(201).json({ pedido });
}

async function getMyOrders(req, res) {
  const pedidos = await ordersService.getOrdersByUser(req.user.id);
  res.status(200).json({ pedidos, total: pedidos.length });
}

module.exports = { createOrder, getMyOrders };
