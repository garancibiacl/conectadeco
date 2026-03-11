const { pool, query } = require('../db/pool');
const { AppError } = require('../middlewares/error.middleware');

function mapPedido(rows, itemsByPedido) {
  return rows.map((row) => ({
    id: row.id,
    total: Number(row.total),
    estado: row.estado,
    creadoEn: row.created_at,
    items: itemsByPedido.get(row.id) || [],
  }));
}

async function createOrder(userId, { items }) {
  const sanitizedItems = items.map((item) => ({
    productId: Number(item.product_id || item.productId || item.id),
    qty: Number(item.qty || item.cantidad),
  }));

  if (sanitizedItems.some((item) => !Number.isInteger(item.productId) || !Number.isInteger(item.qty) || item.qty <= 0)) {
    throw new AppError('Cada item debe incluir product_id y qty válidos.', 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const productIds = sanitizedItems.map((item) => item.productId);
    const productsResult = await client.query(
      `SELECT id, nombre, precio, stock
       FROM productos
       WHERE id = ANY($1::int[])
       ORDER BY id ASC
       FOR UPDATE`,
      [productIds]
    );

    if (productsResult.rows.length !== productIds.length) {
      throw new AppError('Uno o más productos no existen.', 404);
    }

    const productsById = new Map(
      productsResult.rows.map((product) => [product.id, product])
    );

    let total = 0;
    for (const item of sanitizedItems) {
      const product = productsById.get(item.productId);

      if (product.stock < item.qty) {
        throw new AppError(`Stock insuficiente para ${product.nombre}.`, 409);
      }

      total += Number(product.precio) * item.qty;
    }

    const orderResult = await client.query(
      `INSERT INTO pedidos (usuario_id, total, estado)
       VALUES ($1, $2, 'procesando')
       RETURNING id, total, estado, created_at`,
      [userId, total]
    );

    const order = orderResult.rows[0];
    const createdItems = [];

    for (const item of sanitizedItems) {
      const product = productsById.get(item.productId);

      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.qty, product.precio]
      );

      await client.query(
        `UPDATE productos
         SET stock = stock - $1
         WHERE id = $2`,
        [item.qty, item.productId]
      );

      createdItems.push({
        producto_id: item.productId,
        nombre: product.nombre,
        cantidad: item.qty,
        precio_unitario: Number(product.precio),
      });
    }

    await client.query('COMMIT');

    return {
      id: order.id,
      total: Number(order.total),
      estado: order.estado,
      creadoEn: order.created_at,
      items: createdItems,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getOrdersByUser(userId) {
  const ordersResult = await query(
    `SELECT id, total, estado, created_at
     FROM pedidos
     WHERE usuario_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  if (ordersResult.rows.length === 0) {
    return [];
  }

  const orderIds = ordersResult.rows.map((order) => order.id);
  const itemsResult = await query(
    `SELECT
       pi.pedido_id,
       pi.producto_id,
       pi.cantidad,
       pi.precio_unitario,
       p.nombre
     FROM pedido_items pi
     INNER JOIN productos p ON p.id = pi.producto_id
     WHERE pi.pedido_id = ANY($1::int[])
     ORDER BY pi.id ASC`,
    [orderIds]
  );

  const itemsByPedido = new Map();

  for (const row of itemsResult.rows) {
    const currentItems = itemsByPedido.get(row.pedido_id) || [];
    currentItems.push({
      producto_id: row.producto_id,
      nombre: row.nombre,
      cantidad: row.cantidad,
      precio_unitario: Number(row.precio_unitario),
    });
    itemsByPedido.set(row.pedido_id, currentItems);
  }

  return mapPedido(ordersResult.rows, itemsByPedido);
}

module.exports = {
  createOrder,
  getOrdersByUser,
};
