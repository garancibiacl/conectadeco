const authService = require('../services/auth.service');
const { AppError } = require('../middlewares/error.middleware');

async function register(req, res) {
  const { nombre, name, email, password } = req.body;

  if (!email || !password || !(nombre || name)) {
    throw new AppError('Debes enviar nombre, email y password.', 400);
  }

  const result = await authService.register({
    nombre: nombre || name,
    email,
    password,
  });

  res.status(201).json(result);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Debes enviar email y password.', 400);
  }

  const result = await authService.login({ email, password });
  res.status(200).json(result);
}

async function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { register, login, me };
