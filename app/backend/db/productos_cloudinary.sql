BEGIN;

-- Reemplaza TU_CLOUD_NAME y los public IDs por los reales de tu cuenta.
-- Este script sirve para:
-- 1. actualizar los productos semilla existentes con URLs de Cloudinary
-- 2. insertar nuevos productos usando imagen_url

UPDATE productos
SET imagen_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-15-pro-max/premium-silicone-case-rojo-crimson-01'
WHERE nombre = 'Premium Silicone Case - Rojo Crimson';

UPDATE productos
SET imagen_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-15-pro/crystal-magsafe-case-01'
WHERE nombre = 'Crystal MagSafe Case';

UPDATE productos
SET imagen_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-14-pro/wild-roses-blush-01'
WHERE nombre = 'Wild Roses Blush';

UPDATE productos
SET imagen_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-14/spring-blossom-case-01'
WHERE nombre = 'Spring Blossom Case';

UPDATE productos
SET imagen_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-13-pro/midnight-orchid-01'
WHERE nombre = 'Midnight Orchid';

UPDATE productos
SET imagen_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-13/golden-sunflower-01'
WHERE nombre = 'Golden Sunflower';

-- Plantilla para crear productos nuevos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, modelo, imagen_url)
VALUES
  (
    'Funda Premium Negra',
    'Funda premium con acabado mate y refuerzo lateral.',
    31990,
    20,
    'iPhone 15',
    'iPhone 15 Pro',
    'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-15-pro/funda-premium-negra-01'
  ),
  (
    'Funda Floral Rosa',
    'Diseño floral de uso diario con acabado suave.',
    24990,
    14,
    'iPhone 14',
    'iPhone 14 Pro',
    'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/f_auto,q_auto/productos/fundas/iphone-14-pro/funda-floral-rosa-01'
  )
ON CONFLICT DO NOTHING;

COMMIT;

-- Verificación rápida
SELECT id, nombre, categoria, modelo, imagen_url
FROM productos
ORDER BY id ASC;
