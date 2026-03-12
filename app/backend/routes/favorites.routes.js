const express = require('express');

const favoritesController = require('../controllers/favorites.controller');
const { asyncHandler } = require('../middlewares/async-handler');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', asyncHandler(requireAuth), asyncHandler(favoritesController.getMyFavorites));
router.post('/:productId', asyncHandler(requireAuth), asyncHandler(favoritesController.addFavorite));
router.delete('/:productId', asyncHandler(requireAuth), asyncHandler(favoritesController.removeFavorite));

module.exports = router;
