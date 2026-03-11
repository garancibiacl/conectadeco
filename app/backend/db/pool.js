const { Pool } = require('pg');

const { env } = require('../config/env');

const poolConfig = env.databaseUrl
  ? { connectionString: env.databaseUrl }
  : {
      host: env.dbHost,
      port: env.dbPort,
      database: env.dbName,
      user: env.dbUser,
      password: env.dbPassword,
    };

if (env.dbSsl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (error) => {
  console.error('Pool PostgreSQL en estado inesperado:', error.message);
});

function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
