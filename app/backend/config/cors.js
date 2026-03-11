const { env } = require('./env');

const allowedOrigins = env.frontendUrl
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS.'));
  },
  credentials: true,
};

module.exports = { corsOptions };
