const favoritesService = require('../services/favorites.service');

async function getMyFavorites(req, res) {
  const favoritos = await favoritesService.getFavoritesByUser(req.user.id);
  res.status(200).json({ favoritos, total: favoritos.length });
}

async function addFavorite(req, res) {
  const favorito = await favoritesService.addFavorite(req.user.id, req.params.productId);
  res.status(201).json({ favorito });
}

async function removeFavorite(req, res) {
  await favoritesService.removeFavorite(req.user.id, req.params.productId);
  res.status(200).json({ ok: true, message: 'Favorito eliminado.' });
}

module.exports = {
  getMyFavorites,
  addFavorite,
  removeFavorite,
};
