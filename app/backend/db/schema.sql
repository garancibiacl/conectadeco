CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria VARCHAR(80) NOT NULL,
  modelo VARCHAR(80),
  imagen_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(40) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0)
);

CREATE TABLE IF NOT EXISTS producto_categorias (
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (producto_id, categoria_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);

INSERT INTO usuarios (nombre, email, password_hash, role)
VALUES (
  'Admin ConectaDeco',
  'admin@conectadeco.com',
  '$2a$10$hSOkLYtJ0/eihuXSE5uHSOBxc2udsFYY8wzb1QxdiL5cTGnLHMRB.',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO productos (nombre, descripcion, precio, stock, categoria, modelo, imagen_url)
VALUES
  ('Premium Silicone Case - Rojo Crimson', 'Funda premium de silicona con acabado suave y protección reforzada.', 29900, 16, 'iPhone 15', 'iPhone 15 Pro Max', 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80'),
  ('Crystal MagSafe Case', 'Carcasa transparente con compatibilidad MagSafe y bordes anti impactos.', 34500, 12, 'iPhone 15', 'iPhone 15 Pro', 'https://images.unsplash.com/photo-1560693135-581d2e8c5e4f?auto=format&fit=crop&w=900&q=80'),
  ('Wild Roses Blush', 'Diseño floral en tonos blush para uso diario.', 24990, 10, 'iPhone 14', 'iPhone 14 Pro', 'https://images.unsplash.com/photo-1551542159-1e0b48d387f6?auto=format&fit=crop&w=900&q=80'),
  ('Spring Blossom Case', 'Colección primavera con acabado mate premium.', 22990, 18, 'iPhone 14', 'iPhone 14', 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=900&q=80'),
  ('Midnight Orchid', 'Edición premium con flores oscuras y protección lateral.', 26990, 9, 'iPhone 13', 'iPhone 13 Pro', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80'),
  ('Golden Sunflower', 'Diseño vibrante con patrón de girasoles.', 24990, 14, 'iPhone 13', 'iPhone 13', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80')
ON CONFLICT DO NOTHING;

INSERT INTO categorias (nombre, slug)
SELECT DISTINCT categoria, LOWER(REPLACE(categoria, ' ', '-'))
FROM productos
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO producto_categorias (producto_id, categoria_id)
SELECT p.id, c.id
FROM productos p
INNER JOIN categorias c ON c.nombre = p.categoria
ON CONFLICT (producto_id, categoria_id) DO NOTHING;
