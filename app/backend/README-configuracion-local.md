# Configuracion Local de Base de Datos

Este proyecto ya quedo conectado a la base de datos local de PostgreSQL.

## Estado actual

- La app local si se conecta a la base `conectadeco`.
- El backend usa el usuario `postgres`.
- La contraseña local configurada es `1234`.
- La conexion se toma desde `app/backend/.env`.
- El endpoint local de productos responde en `http://localhost:3000/api/productos`.

## Archivo usado

El backend carga por defecto el archivo:

```env
app/backend/.env
```

Con esta configuracion local:

```env
PORT=3000
API_HOST=localhost
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=define_un_secreto_seguro_aqui
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conectadeco
DB_USER=postgres
DB_PASSWORD=1234
DB_SSL=false
```

## Que significa en simple

- El frontend local habla con el backend local.
- El backend local habla con tu PostgreSQL local.
- Los productos del catalogo se leen desde la base `conectadeco`.

## Prueba rapida

Si el backend esta levantado, esta URL deberia devolver los productos:

```bash
http://localhost:3000/api/productos
```

## Nota

Esta configuracion es solo para local.
La configuracion de produccion debe ir en `.env.render`.
