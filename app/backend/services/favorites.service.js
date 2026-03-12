const { query } = require('../db/pool');
const { AppError } = require('../middlewares/error.middleware');

function normalizeProductId(productId) {
  const normalizedId = Number(productId);

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new AppError('El id del producto debe ser numérico.', 400);
  }

  return normalizedId;
}

function mapFavorite(row) {
  return {
    id: row.id,
    productoId: row.producto_id,
    agregadoEn: row.created_at,
    producto: {
      id: row.producto_id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: Number(row.precio),
      stock: row.stock,
      categoria: row.categoria,
      modelo: row.modelo,
      imagen: row.imagen_url,
    },
  };
}

async function ensureProductExists(productId) {
  const result = await query(
    'SELECT id FROM productos WHERE id = $1',
    [productId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Producto no encontrado.', 404);
  }
}

async function getFavoritesByUser(userId) {
  const result = await query(
    `SELECT
       f.id,
       f.producto_id,
       f.created_at,
       p.nombre,
       p.descripcion,
       p.precio,
       p.stock,
       p.categoria,
       p.modelo,
       p.imagen_url
     FROM favorites f
     INNER JOIN productos p ON p.id = f.producto_id
     WHERE f.usuario_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return result.rows.map(mapFavorite);
}

async function addFavorite(userId, productId) {
  const normalizedProductId = normalizeProductId(productId);
  await ensureProductExists(normalizedProductId);

  const result = await query(
    `INSERT INTO favorites (usuario_id, producto_id)
     VALUES ($1, $2)
     ON CONFLICT (usuario_id, producto_id)
     DO UPDATE SET created_at = favorites.created_at
     RETURNING id, producto_id, created_at`,
    [userId, normalizedProductId]
  );

  const [favoriteRow] = result.rows;
  const favorites = await getFavoritesByUser(userId);
  return favorites.find((favorite) => favorite.id === favoriteRow.id);
}

async function removeFavorite(userId, productId) {
  const normalizedProductId = normalizeProductId(productId);
  const result = await query(
    `DELETE FROM favorites
     WHERE usuario_id = $1 AND producto_id = $2
     RETURNING id`,
    [userId, normalizedProductId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Favorito no encontrado.', 404);
  }
}

module.exports = {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
};
