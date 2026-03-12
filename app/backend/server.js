const express = require('express');
const cors = require('cors');

const { corsOptions } = require('./config/cors');
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const ordersRoutes = require('./routes/orders.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const cartRoutes = require('./routes/cart.routes');
const { notFoundHandler } = require('./middlewares/not-found.middleware');
const { errorHandler } = require('./middlewares/error.middleware');

function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/productos', productosRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/cart', cartRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
