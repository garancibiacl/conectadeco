const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.ENV_FILE || path.resolve(process.cwd(), '.env'),
});

const nodeEnv = process.env.NODE_ENV || 'development';
// Acepta JWT_SECRET o JWT_SECRET_KEY (formato del ejemplo de clase)
const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

if (!jwtSecret && nodeEnv !== 'test') {
  throw new Error('Falta definir JWT_SECRET en las variables de entorno.');
}

const env = {
  nodeEnv,
  port: Number(process.env.PORT || process.env.API_PORT || 3000),
  apiHost: process.env.API_HOST || 'localhost',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 5432),
  // Acepta DB_NAME o DB_DATABASE (formato del ejemplo de clase)
  dbName: process.env.DB_NAME || process.env.DB_DATABASE || 'conectadeco',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',
  dbSsl: process.env.DB_SSL === 'true',
  jwtSecret: jwtSecret || 'test-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = { env };
