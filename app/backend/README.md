# ConectaDeco Backend

API REST del Hito 3 para ConectaDeco, implementada con Express, PostgreSQL (`pg`) y JWT.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalación

```bash
cd app/backend
npm install
cp .env.example .env
```

## Variables de entorno

```env
PORT=3000
API_HOST=localhost
FRONTEND_URL=http://localhost:5173
JWT_SECRET=define_un_secreto_seguro
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/conectadeco
```

## Base de datos

Crear la base `conectadeco` en PostgreSQL y ejecutar:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

El script crea tablas `usuarios`, `productos`, `pedidos`, `pedido_items`, además de:

- usuario admin demo: `admin@conectadeco.com` / `admin123`
- productos semilla para catálogo y carrito demo

## Scripts npm

- `npm run dev`: levanta el backend con nodemon
- `npm start`: ejecuta el servidor con Node
- `npm test`: corre tests con Jest + Supertest

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/orders`
- `GET /api/orders/me`

## Respuestas esperadas

- `POST /api/auth/register` y `POST /api/auth/login` retornan `{ token, user }`
- `GET /api/productos` retorna `{ productos, total }`
- `GET /api/orders/me` retorna `{ pedidos, total }`
- Errores retornan `{ ok: false, message }`

## Tests

Los tests cubren:

- registro exitoso
- login inválido
- perfil autenticado
- listado y detalle de productos
- autorización y creación de pedidos
- historial de pedidos
