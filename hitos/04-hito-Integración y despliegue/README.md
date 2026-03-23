# Hito 4: Integración y Despliegue

**Proyecto:** ConectaDeco — Marketplace de fundas premium para iPhone
**Stack de despliegue:** Vercel (frontend) + Render (backend + PostgreSQL)

---

## Descripción

En este hito se realizó la integración completa del proyecto a internet, conectando el frontend desarrollado en el Hito 2 con el backend del Hito 3, utilizando una base de datos PostgreSQL alojada en la nube. El resultado es una aplicación funcional en producción donde todas las operaciones del usuario persisten en una base de datos real.

---

## Estructura entregada

```text
app/
├── frontend/
│   ├── vercel.json             ← Configuración SPA routing para Vercel
│   └── src/
│       └── services/api.js     ← VITE_API_URL apunta al backend en Render
└── backend/
    ├── config/
    │   ├── env.js              ← Soporte DATABASE_URL, DB_DATABASE y JWT_SECRET_KEY
    │   └── cors.js             ← FRONTEND_URL configurable por entorno
    ├── db/
    │   └── pool.js             ← SSL automático en producción (NODE_ENV=production)
    └── server/
        └── database/
            ├── DDL.sql         ← Estructura de tablas lista para ejecutar en Render
            └── DML.sql         ← Datos semilla listos para ejecutar en Render
```

---

## Rúbricas

### 1. Realizar el deploy de la aplicación cliente
**(2 puntos)**

**Solicitado:** Realizar el deploy de la aplicación cliente sin problemas de carga de recursos.

**Entregado:**

- El frontend fue desplegado en **Vercel** conectado al repositorio de GitHub
- Se creó `vercel.json` para resolver el problema de rutas en SPA — al hacer F5 en cualquier ruta como `/catalogo`, `/carrito` o `/dashboard`, la aplicación no pierde el estado ni lanza un 404
- Se configuró la variable de entorno `VITE_API_URL` en Vercel apuntando al backend en Render
- Vercel realiza deploy automático ante cada push a la rama `main`

**URL de producción del cliente:** `https://conectadeco.vercel.app`

**En palabras simples:**
El frontend quedó publicado en internet y disponible para cualquier usuario. Todos los recursos cargan correctamente y la navegación funciona como en local, incluyendo el refresco de página en rutas internas.

---

### 2. Realizar el deploy de la aplicación backend
**(2 puntos)**

**Solicitado:** Realizar el deploy del servidor backend sin problemas de carga de recursos.

**Entregado:**

- El backend fue desplegado en **Render** como Web Service
- Se configuró correctamente el Root Directory (`app/backend`), Build Command (`npm install`) y Start Command (`npm start`)
- Se ajustó `config/env.js` para soportar los formatos de variables de entorno requeridos por Render:
  - `DB_DATABASE` como alternativa a `DB_NAME`
  - `JWT_SECRET_KEY` como alternativa a `JWT_SECRET`
- Se ajustó `db/pool.js` para activar SSL automáticamente cuando `NODE_ENV=production`, sin requerir configuración adicional
- Se configuró `config/cors.js` con `FRONTEND_URL=https://conectadeco.vercel.app` para permitir peticiones del cliente en producción

**URL de producción del backend:** `https://conectadeco.onrender.com`

**En palabras simples:**
El servidor quedó corriendo en la nube respondiendo peticiones reales. Se resolvieron los errores de CORS, puerto y SSL que impiden que un backend funcione correctamente en un entorno de producción.

---

### 3. Realizar el deploy de la base de datos
**(2 puntos)**

**Solicitado:** Realizar el deploy de la base de datos creando las tablas correctamente.

**Entregado:**

- Se creó una base de datos PostgreSQL en **Render** (`dbconectadeco`)
- Se separó el SQL en dos archivos organizados por responsabilidad:
  - `server/database/DDL.sql` — estructura de tablas, claves primarias, claves foráneas y constraints
  - `server/database/DML.sql` — datos iniciales (usuario admin y productos semilla)
- Se ejecutó primero `DDL.sql` y luego `DML.sql` desde el Query tab de Render
- Se verificó la creación correcta de las 8 tablas del modelo relacional
- Se corrigió la duplicación de productos agregando `UNIQUE` en `productos.nombre` y usando `ON CONFLICT (nombre) DO NOTHING`

**Tablas desplegadas en producción:**

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios registrados con rol y hash de contraseña |
| `productos` | Catálogo de fundas con precio, stock y modelo |
| `categorias` | Agrupación de productos por modelo de iPhone |
| `producto_categorias` | Relación N:M entre productos y categorías |
| `pedidos` | Órdenes de compra por usuario |
| `pedido_items` | Productos incluidos en cada pedido |
| `cart_items` | Carrito persistente por usuario |
| `favorites` | Favoritos persistentes por usuario |

**En palabras simples:**
La base de datos quedó creada en la nube con la estructura relacional definida desde el Hito 1. Los datos se cargan desde PostgreSQL real, no desde simulaciones ni datos en memoria.

---

### 4. Integrar la aplicación cliente con la aplicación backend en producción
**(4 puntos — máximo puntaje)**

**Solicitado:** Integrar la aplicación cliente con el backend en producción con persistencia de datos.

**Entregado:**

- El frontend en Vercel consume el backend en Render a través de `VITE_API_URL`
- El backend en Render se conecta a PostgreSQL en Render mediante variables de entorno
- La integración completa fue verificada en producción:

| Funcionalidad | Estado |
|--------------|--------|
| Catálogo carga productos desde PostgreSQL | ✅ |
| Registro de usuario persiste en base de datos | ✅ |
| Login retorna JWT válido | ✅ |
| Carrito persiste por usuario autenticado | ✅ |
| Favoritos persisten por usuario autenticado | ✅ |
| Pedidos se generan y guardan en PostgreSQL | ✅ |
| CORS configurado entre Vercel y Render | ✅ |
| SSL activado en conexión backend-PostgreSQL | ✅ |

**Flujo de producción:**

```
Usuario en Vercel (https://conectadeco.vercel.app)
        ↓  HTTPS
Backend en Render (https://conectadeco.onrender.com/api)
        ↓  SSL + autenticación por variables de entorno
PostgreSQL en Render (dbconectadeco)
```

**En palabras simples:**
La aplicación funciona de extremo a extremo en producción. Un usuario puede entrar a la URL pública, ver el catálogo real, registrarse, iniciar sesión, agregar productos al carrito y a favoritos, y realizar pedidos — todo guardado en la base de datos en la nube.

---

## Variables de entorno configuradas

### Vercel (frontend)

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://conectadeco.onrender.com/api` |

### Render (backend)

| Variable | Descripción |
|----------|-------------|
| `NODE_ENV` | `production` |
| `DB_HOST` | Hostname interno de PostgreSQL en Render |
| `DB_PORT` | `5432` |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_DATABASE` | `dbconectadeco` |
| `DB_SSL` | `true` |
| `JWT_SECRET_KEY` | Clave secreta para firmar tokens JWT |
| `FRONTEND_URL` | `https://conectadeco.vercel.app` |

---

## Coherencia con Hito 1, Hito 2 y Hito 3

- Se mantuvo la idea central del proyecto definida desde el Hito 1: marketplace de fundas premium para iPhone con público objetivo femenino
- La estructura de tablas desplegada en Render respeta el ERD diseñado en el Hito 1
- El contrato de la API desplegada respeta el diseño definido en `hitos/01-hito-diseno-prototipo/api/api-contract.md`
- El frontend deployado en Vercel es el mismo desarrollado en el Hito 2, sin cambios en la lógica de componentes
- El backend deployado en Render es el mismo desarrollado en el Hito 3, adaptado únicamente en configuración de entorno
- La sesión de usuario sigue el formato `{ token, user }` definido en el Hito 2 y respetado en el Hito 3
- El color primario `red-600` y la identidad visual se mantienen igual desde el Hito 1

---

## Conclusión

En este hito el proyecto ConectaDeco pasó de ser una aplicación local a estar completamente disponible en internet. El frontend, el backend y la base de datos quedaron desplegados en plataformas de producción reales, integrados entre sí y funcionando con persistencia de datos. Esto cierra el ciclo del proyecto iniciado en el Hito 1 con el diseño y el prototipo, continuado en el Hito 2 con el frontend y el Hito 3 con el backend.
