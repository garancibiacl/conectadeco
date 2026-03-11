const express = require('express');

const ordersController = require('../controllers/orders.controller');
const { asyncHandler } = require('../middlewares/async-handler');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', asyncHandler(requireAuth), asyncHandler(ordersController.createOrder));
router.get('/me', asyncHandler(requireAuth), asyncHandler(ordersController.getMyOrders));

module.exports = router;
