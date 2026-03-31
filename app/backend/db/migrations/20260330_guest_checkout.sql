ALTER TABLE pedidos
  DROP CONSTRAINT IF EXISTS pedidos_usuario_id_fkey;

ALTER TABLE pedidos
  ALTER COLUMN usuario_id DROP NOT NULL;

ALTER TABLE pedidos
  ADD CONSTRAINT pedidos_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;
