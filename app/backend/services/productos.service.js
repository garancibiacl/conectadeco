const { query } = require('../db/pool');
const { AppError } = require('../middlewares/error.middleware');

function mapProducto(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    stock: row.stock,
    categoria: row.categoria,
    modelo: row.modelo,
    imagen: row.imagen_url,
  };
}

function buildFilters({ categoria, q, model, modelo }) {
  const where = [];
  const values = [];

  if (categoria && categoria !== 'Todas') {
    values.push(categoria);
    where.push(`categoria ILIKE $${values.length}`);
  }

  if (q) {
    values.push(`%${q}%`);
    where.push(`nombre ILIKE $${values.length}`);
  }

  const modelValue = model || modelo;
  if (modelValue) {
    values.push(`%${modelValue}%`);
    where.push(`modelo ILIKE $${values.length}`);
  }

  return {
    clause: where.length > 0 ? `WHERE ${where.join(' AND ')}` : '',
    values,
  };
}

async function getProductos(filters = {}) {
  const { clause, values } = buildFilters(filters);
  const limit = Number(filters.limit || 0);
  const limitClause = Number.isFinite(limit) && limit > 0 ? ` LIMIT ${limit}` : '';

  const totalResult = await query(
    `SELECT COUNT(*)::int AS total FROM productos ${clause}`,
    values
  );
  const productosResult = await query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, modelo, imagen_url
     FROM productos
     ${clause}
     ORDER BY id ASC${limitClause}`,
    values
  );

  return {
    productos: productosResult.rows.map(mapProducto),
    total: totalResult.rows[0].total,
  };
}

async function getProductoById(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('El id del producto debe ser numérico.', 400);
  }

  const result = await query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, modelo, imagen_url
     FROM productos
     WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Producto no encontrado.', 404);
  }

  return mapProducto(result.rows[0]);
}

module.exports = {
  getProductos,
  getProductoById,
};
