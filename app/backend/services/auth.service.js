const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { query } = require('../db/pool');
const { env } = require('../config/env');
const { AppError } = require('../middlewares/error.middleware');

function mapUser(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    role: row.role,
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
      nombre: user.nombre,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

async function getUserById(id) {
  const result = await query(
    'SELECT id, nombre, email, role FROM usuarios WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  return mapUser(result.rows[0]);
}

async function register({ nombre, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await query(
    'SELECT id FROM usuarios WHERE email = $1',
    [normalizedEmail]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError('El email ya está registrado.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const createdUser = await query(
    `INSERT INTO usuarios (nombre, email, password_hash, role)
     VALUES ($1, $2, $3, 'usuario')
     RETURNING id, nombre, email, role`,
    [nombre.trim(), normalizedEmail, passwordHash]
  );

  const user = mapUser(createdUser.rows[0]);

  return {
    token: generateToken(user),
    user,
  };
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await query(
    `SELECT id, nombre, email, role, password_hash
     FROM usuarios
     WHERE email = $1`,
    [normalizedEmail]
  );

  if (result.rows.length === 0) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  const userRow = result.rows[0];
  const validPassword = await bcrypt.compare(password, userRow.password_hash);

  if (!validPassword) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  const user = mapUser(userRow);

  return {
    token: generateToken(user),
    user,
  };
}

module.exports = {
  register,
  login,
  getUserById,
};
