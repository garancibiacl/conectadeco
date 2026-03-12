const express = require('express');

const cartController = require('../controllers/cart.controller');
const { asyncHandler } = require('../middlewares/async-handler');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', asyncHandler(requireAuth), asyncHandler(cartController.getMyCart));
router.post('/', asyncHandler(requireAuth), asyncHandler(cartController.addCartItem));
router.put('/:productId', asyncHandler(requireAuth), asyncHandler(cartController.updateCartItem));
router.delete('/:productId', asyncHandler(requireAuth), asyncHandler(cartController.removeCartItem));

module.exports = router;
