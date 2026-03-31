const jwt = require('jsonwebtoken');

const { env } = require('../config/env');
const authService = require('../services/auth.service');
const { AppError } = require('./error.middleware');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Token Bearer requerido.', 401));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await authService.getUserById(Number(payload.sub));
    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado.', 401));
  }
}

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await authService.getUserById(Number(payload.sub));
    req.user = user;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
}

module.exports = { requireAuth, optionalAuth };
