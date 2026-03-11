const { AppError } = require('./error.middleware');

function notFoundHandler(req, res, next) {
  next(new AppError(`Ruta ${req.method} ${req.originalUrl} no encontrada.`, 404));
}

module.exports = { notFoundHandler };
