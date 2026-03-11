class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error(error);
  }

  const payload = {
    ok: false,
    message: error.message || 'Error interno del servidor.',
  };

  if (error.details) {
    payload.errors = error.details;
  }

  return res.status(statusCode).json(payload);
}

module.exports = { AppError, errorHandler };
