-- =============================================================
-- DDL.sql — ConectaDeco
-- Estructura de base de datos (solo tablas, PK, FK, constraints)
-- Ejecutar PRIMERO en Render / PostgreSQL
-- =============================================================

-- 1. Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL        PRIMARY KEY,
  nombre        VARCHAR(120)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL DEFAULT 'usuario',
  created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- 2. Productos (sin dependencias)
CREATE TABLE IF NOT EXISTS productos (
  id          SERIAL         PRIMARY KEY,
  nombre      VARCHAR(160)   NOT NULL UNIQUE,
  descripcion TEXT,
  precio      NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria   VARCHAR(80)    NOT NULL,
  modelo      VARCHAR(80),
  imagen_url  TEXT,
  created_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- 3. Categorías (sin dependencias)
CREATE TABLE IF NOT EXISTS categorias (
  id         SERIAL      PRIMARY KEY,
  nombre     VARCHAR(80) NOT NULL UNIQUE,
  slug       VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- 4. Pedidos → depende de usuarios
CREATE TABLE IF NOT EXISTS pedidos (
  id         SERIAL         PRIMARY KEY,
  usuario_id INTEGER        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  total      NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  estado     VARCHAR(40)    NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- 5. Items de pedido → depende de pedidos y productos
CREATE TABLE IF NOT EXISTS pedido_items (
  id              SERIAL         PRIMARY KEY,
  pedido_id       INTEGER        NOT NULL REFERENCES pedidos(id)   ON DELETE CASCADE,
  producto_id     INTEGER        NOT NULL REFERENCES productos(id),
  cantidad        INTEGER        NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0)
);

-- 6. Relación producto-categoría N:M → depende de productos y categorias
CREATE TABLE IF NOT EXISTS producto_categorias (
  producto_id  INTEGER   NOT NULL REFERENCES productos(id)  ON DELETE CASCADE,
  categoria_id INTEGER   NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (producto_id, categoria_id)
);

-- 7. Carrito → depende de usuarios y productos
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL    PRIMARY KEY,
  usuario_id  INTEGER   NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
  producto_id INTEGER   NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad    INTEGER   NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);

-- 8. Favoritos → depende de usuarios y productos
CREATE TABLE IF NOT EXISTS favorites (
  id          SERIAL    PRIMARY KEY,
  usuario_id  INTEGER   NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
  producto_id INTEGER   NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);
