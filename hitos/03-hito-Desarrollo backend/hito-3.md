# Hito 3: Desarrollo Backend

**Proyecto:** ConectaDeco — Marketplace de fundas premium para iPhone  
**Stack:** Node.js + Express + PostgreSQL (`pg`) + JWT + CORS + Jest + Supertest

---

## Descripción

En este hito desarrollé la parte backend del proyecto, creando una API REST conectada a PostgreSQL. También implementé autenticación con JWT, middlewares para proteger rutas y pruebas de varias rutas para validar que el servidor responde bien en distintos casos.

---

## Estructura entregada

```text
app/backend/
├── config/
│   ├── cors.js                ← Configuración de orígenes permitidos
│   └── env.js                 ← Carga y validación de variables de entorno
├── controllers/
│   ├── auth.controller.js     ← Registro, login y perfil del usuario
│   ├── orders.controller.js   ← Creación e historial de pedidos
│   └── productos.controller.js← Listado y detalle de productos
├── db/
│   ├── pool.js                ← Conexión a PostgreSQL con pg
│   └── schema.sql             ← Tablas y datos semilla
├── middlewares/
│   ├── async-handler.js       ← Manejo simple de errores async
│   ├── auth.middleware.js     ← Validación de token Bearer
│   ├── error.middleware.js    ← Respuesta centralizada de errores
│   └── not-found.middleware.js← Manejo de rutas inexistentes
├── routes/
│   ├── auth.routes.js         ← Rutas de autenticación
│   ├── orders.routes.js       ← Rutas de pedidos
│   └── productos.routes.js    ← Rutas de productos
├── services/
│   ├── auth.service.js        ← Lógica de usuarios y JWT
│   ├── orders.service.js      ← Lógica de pedidos y stock
│   └── productos.service.js   ← Lógica de consulta de productos
├── tests/
│   ├── auth.test.js           ← Tests de autenticación
│   ├── orders.test.js         ← Tests de pedidos
│   ├── productos.test.js      ← Tests de productos
│   └── setupEnv.js            ← Configuración de entorno de test
├── .env.example               ← Variables de entorno de ejemplo
├── index.js                   ← Inicio del servidor
├── server.js                  ← App Express y montaje de rutas
├── package.json               ← Dependencias y scripts
└── README.md                  ← Instrucciones de uso del backend
```

---

## Rúbricas

### 1. Crear un nuevo proyecto de npm e instalar todas las dependencias que necesitarás

**Solicitado:** Crear un nuevo proyecto npm e instalar las dependencias necesarias para levantar el backend.

**Entregado:**

- Se creó el proyecto backend dentro de `app/backend`
- Se agregó `package.json` con scripts:
  - `npm run dev`
  - `npm start`
  - `npm test`
- Se instalaron las dependencias principales:
  - `express` para crear la API REST
  - `pg` para conectarse a PostgreSQL
  - `jsonwebtoken` para autenticación con JWT
  - `bcryptjs` para encriptar contraseñas
  - `cors` para permitir consultas desde el frontend
  - `dotenv` para variables de entorno
- También se instalaron dependencias de apoyo:
  - `jest`
  - `supertest`
  - `nodemon`

**En palabras simples:**  
Primero armé el proyecto backend con npm y dejé instaladas todas las librerías necesarias para que el servidor funcione, se conecte a la base de datos, maneje login y además pueda probarse.

---

### 2. Utilizar el paquete pg para gestionar la comunicación con la base de datos PostgreSQL

**Solicitado:** Conectar la API con PostgreSQL usando el paquete `pg`.

**Entregado:**

- Se creó `db/pool.js` para administrar la conexión con PostgreSQL mediante `Pool`
- La conexión puede funcionar usando `DATABASE_URL` o también con variables separadas como:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`
- Se creó `db/schema.sql` con las tablas:
  - `usuarios`
  - `productos`
  - `pedidos`
  - `pedido_items`
- Se agregaron datos semilla:
  - usuario administrador demo
  - productos de ejemplo
- Los servicios usan consultas SQL reales para:
  - registrar usuarios
  - iniciar sesión
  - listar productos
  - ver detalle de productos
  - crear pedidos
  - consultar historial de pedidos

**En palabras simples:**  
Usé `pg` para conectar el servidor con PostgreSQL y guardar la información real del proyecto. No quedó solo en memoria: los usuarios, productos y pedidos se trabajan desde la base de datos.

---

### 3. Implementar la autenticación y autorización de usuarios con JWT

**Solicitado:** Implementar autenticación y autorización usando JWT.

**Entregado:**

- Se implementaron las rutas:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Al registrarse o iniciar sesión, la API devuelve:
  - `token`
  - `user`
- El token JWT incluye datos del usuario como:
  - `id`
  - `email`
  - `role`
  - `nombre`
- Las contraseñas se guardan encriptadas con `bcryptjs`
- Se validan credenciales incorrectas y usuarios no encontrados
- La autorización se aplica a rutas privadas como:
  - `POST /api/orders`
  - `GET /api/orders/me`

**En palabras simples:**  
El usuario puede registrarse e iniciar sesión. Cuando entra, el sistema entrega un token JWT y ese token sirve para demostrar quién es y permitirle entrar a rutas privadas, como ver sus pedidos o comprar.

---

### 4. Usar el paquete CORS para permitir las consultas de orígenes cruzados

**Solicitado:** Configurar CORS para que el frontend pueda comunicarse con el backend.

**Entregado:**

- Se creó `config/cors.js`
- Los orígenes permitidos se leen desde la variable `FRONTEND_URL`
- Se permite más de un origen si vienen separados por coma
- La configuración acepta peticiones válidas del frontend y bloquea orígenes no autorizados
- Se habilitó `credentials: true`

**En palabras simples:**  
Configuré CORS para que el frontend del proyecto pueda hacer peticiones al backend sin problemas, pero al mismo tiempo evitando accesos desde orígenes no permitidos.

---

### 5. Utilizar middlewares para validar las credenciales o token en cabeceras en las rutas que aplique

**Solicitado:** Crear middlewares que validen credenciales o token en las cabeceras de las rutas protegidas.

**Entregado:**

- Se creó `auth.middleware.js`
- El middleware revisa el header:
  - `Authorization: Bearer <token>`
- Si no viene el token, responde con error `401`
- Si el token es inválido o expiró, responde con error `401`
- Si el token es válido, busca al usuario y lo deja disponible en `req.user`
- Este middleware se usa en rutas protegidas de autenticación y pedidos
- También se agregaron middlewares extra para mejorar el backend:
  - `async-handler.js`
  - `error.middleware.js`
  - `not-found.middleware.js`

**En palabras simples:**  
Hice middlewares para revisar si el usuario manda bien su token antes de entrar a ciertas rutas. Si no está autenticado, no puede avanzar. Así se protegen los datos del usuario y la creación de pedidos.

---

### 6. Realizar test de por lo menos 4 rutas de la API REST comprobando los códigos de estados de diferentes escenarios

**Solicitado:** Probar al menos 4 rutas de la API REST, revisando códigos de estado en distintos escenarios.

**Entregado:**

- Se agregaron pruebas con `Jest` y `Supertest`
- Se crearon archivos de test para:
  - `auth`
  - `productos`
  - `orders`
- Escenarios cubiertos:
  - registro exitoso con código `201`
  - login con credenciales inválidas con código `401`
  - perfil autenticado con código `200`
  - listado de productos con código `200`
  - detalle de producto inexistente con código `404`
  - creación de pedido sin token con código `401`
  - creación de pedido autenticado con código `201`
  - historial de pedidos con código `200`

**En palabras simples:**  
Probé varias rutas importantes para asegurarme de que el backend responde bien. No solo revisé casos correctos, también errores como token faltante, credenciales inválidas o producto inexistente.

---

## Endpoints implementados

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/auth/me` | Obtener usuario autenticado |
| `GET` | `/api/productos` | Listar productos |
| `GET` | `/api/productos/:id` | Ver detalle de un producto |
| `POST` | `/api/orders` | Crear pedido autenticado |
| `GET` | `/api/orders/me` | Ver historial de pedidos del usuario |

---

## Coherencia con Hito 1 y Hito 2

- Se respetó la idea del proyecto definida desde el Hito 1: marketplace de fundas premium
- La base PostgreSQL mantiene la estructura relacional esperada desde el ERD del Hito 1: usuarios, productos, pedidos, items de pedido, categorías, relación producto-categoría, carrito y favoritos
- Las rutas del backend responden a las necesidades del frontend desarrollado en el Hito 2
- El frontend ya consume este backend para login, registro, productos, carrito y pedidos
- Se mantuvo una estructura modular para que el proyecto quede más ordenado y fácil de seguir
- La respuesta de autenticación sigue el formato esperado por el frontend: `{ token, user }`

---

## Conclusión

En este hito quedó construido el backend funcional de ConectaDeco. La API ya permite registrar usuarios, iniciar sesión, consultar productos, crear pedidos y ver el historial de compras, todo conectado a PostgreSQL y con validaciones mediante JWT, CORS, middlewares y pruebas automáticas.
