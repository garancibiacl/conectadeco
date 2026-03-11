const productosService = require('../services/productos.service');

async function getProductos(req, res) {
  const result = await productosService.getProductos(req.query);
  res.status(200).json(result);
}

async function getProductoById(req, res) {
  const producto = await productosService.getProductoById(Number(req.params.id));
  res.status(200).json(producto);
}

module.exports = { getProductos, getProductoById };
