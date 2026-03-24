-- =============================================================
-- DML.sql — ConectaDeco
-- Datos iniciales (seed data)
-- Ejecutar DESPUÉS de DDL.sql
-- =============================================================

-- 1. Usuario administrador
-- Contraseña plana: admin1234  (hash bcrypt cost 10)
INSERT INTO usuarios (nombre, email, password_hash, role)
VALUES (
  'Admin ConectaDeco',
  'admin@conectadeco.com',
  '$2a$10$hSOkLYtJ0/eihuXSE5uHSOBxc2udsFYY8wzb1QxdiL5cTGnLHMRB.',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- 2. Productos semilla
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, modelo, imagen_url)
VALUES
  (
    'Premium Silicone Case - Rojo Crimson',
    'Funda premium de silicona con acabado suave y protección reforzada.',
    29900, 16, 'iPhone 15', 'iPhone 15 Pro Max',
    'https://res.cloudinary.com/dwfexginq/image/upload/v1773617625/tclp19gngfzlhowadmxx.png'
  ),
  (
    'Crystal MagSafe Case',
    'Carcasa transparente con compatibilidad MagSafe y bordes anti impactos.',
    34500, 12, 'iPhone 15', 'iPhone 15 Pro',
    'https://images.unsplash.com/photo-1560693135-581d2e8c5e4f?auto=format&fit=crop&w=900&q=80'
  ),
  (
    'Wild Roses Blush',
    'Diseño floral en tonos blush para uso diario.',
    24990, 10, 'iPhone 14', 'iPhone 14 Pro',
    'https://images.unsplash.com/photo-1551542159-1e0b48d387f6?auto=format&fit=crop&w=900&q=80'
  ),
  (
    'Spring Blossom Case',
    'Colección primavera con acabado mate premium.',
    22990, 18, 'iPhone 14', 'iPhone 14',
    'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=900&q=80'
  ),
  (
    'Midnight Orchid',
    'Edición premium con flores oscuras y protección lateral.',
    26990, 9, 'iPhone 13', 'iPhone 13 Pro',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80'
  ),

  (
    'Golden Sunflower',
    'Diseño vibrante con patrón de girasoles.',
    24990, 14, 'iPhone 13', 'iPhone 13',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
  )
ON CONFLICT (nombre) DO NOTHING;

-- 3. Categorías derivadas automáticamente de los productos insertados
INSERT INTO categorias (nombre, slug)
SELECT DISTINCT
  categoria,
  LOWER(REPLACE(categoria, ' ', '-'))
FROM productos
ON CONFLICT (nombre) DO NOTHING;

-- 4. Relaciones producto-categoría
INSERT INTO producto_categorias (producto_id, categoria_id)
SELECT p.id, c.id
FROM productos p
INNER JOIN categorias c ON c.nombre = p.categoria
ON CONFLICT (producto_id, categoria_id) DO NOTHING;

-- Verificación rápida
SELECT id, nombre, categoria, modelo FROM productos ORDER BY id;
