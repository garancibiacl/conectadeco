const { query } = require('../db/pool');
const { AppError } = require('../middlewares/error.middleware');

function normalizeProductId(productId) {
  const normalizedId = Number(productId);

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new AppError('El id del producto debe ser numérico.', 400);
  }

  return normalizedId;
}

function normalizeQty(qty) {
  const normalizedQty = Number(qty);

  if (!Number.isInteger(normalizedQty) || normalizedQty <= 0) {
    throw new AppError('La cantidad debe ser un entero positivo.', 400);
  }

  return normalizedQty;
}

function mapCartItem(row) {
  return {
    id: row.id,
    productoId: row.producto_id,
    cantidad: row.cantidad,
    agregadoEn: row.created_at,
    subtotal: Number(row.precio) * row.cantidad,
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

async function getProductById(productId) {
  const result = await query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, modelo, imagen_url
     FROM productos
     WHERE id = $1`,
    [productId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Producto no encontrado.', 404);
  }

  return result.rows[0];
}

async function getExistingCartItem(userId, productId) {
  const result = await query(
    `SELECT id, cantidad
     FROM cart_items
     WHERE usuario_id = $1 AND producto_id = $2`,
    [userId, productId]
  );

  return result.rows[0] || null;
}

async function getCartByUser(userId) {
  const result = await query(
    `SELECT
       ci.id,
       ci.producto_id,
       ci.cantidad,
       ci.created_at,
       p.nombre,
       p.descripcion,
       p.precio,
       p.stock,
       p.categoria,
       p.modelo,
       p.imagen_url
     FROM cart_items ci
     INNER JOIN productos p ON p.id = ci.producto_id
     WHERE ci.usuario_id = $1
     ORDER BY ci.created_at DESC`,
    [userId]
  );

  const items = result.rows.map(mapCartItem);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    items,
    total: items.length,
    subtotal,
  };
}

async function upsertCartItem(userId, productId, qty, mode = 'replace') {
  const normalizedProductId = normalizeProductId(productId);
  const normalizedQty = normalizeQty(qty);
  const product = await getProductById(normalizedProductId);
  const existingItem = await getExistingCartItem(userId, normalizedProductId);
  const finalQty = mode === 'increment'
    ? (existingItem?.cantidad || 0) + normalizedQty
    : normalizedQty;

  if (product.stock < finalQty) {
    throw new AppError(`Stock insuficiente para ${product.nombre}.`, 409);
  }

  const result = await query(
    `INSERT INTO cart_items (usuario_id, producto_id, cantidad)
     VALUES ($1, $2, $3)
     ON CONFLICT (usuario_id, producto_id)
     DO UPDATE SET cantidad = EXCLUDED.cantidad
     RETURNING id, producto_id, cantidad, created_at`,
    [userId, normalizedProductId, finalQty]
  );

  const [itemRow] = result.rows;
  const cart = await getCartByUser(userId);
  return cart.items.find((item) => item.id === itemRow.id);
}

async function removeCartItem(userId, productId) {
  const normalizedProductId = normalizeProductId(productId);
  const result = await query(
    `DELETE FROM cart_items
     WHERE usuario_id = $1 AND producto_id = $2
     RETURNING id`,
    [userId, normalizedProductId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Producto no encontrado en el carrito.', 404);
  }
}

module.exports = {
  getCartByUser,
  addCartItem: (userId, productId, qty) => upsertCartItem(userId, productId, qty, 'increment'),
  updateCartItem: (userId, productId, qty) => upsertCartItem(userId, productId, qty, 'replace'),
  removeCartItem,
};
