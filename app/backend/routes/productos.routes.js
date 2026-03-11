const express = require('express');

const productosController = require('../controllers/productos.controller');
const { asyncHandler } = require('../middlewares/async-handler');

const router = express.Router();

router.get('/', asyncHandler(productosController.getProductos));
router.get('/:id', asyncHandler(productosController.getProductoById));

module.exports = router;
