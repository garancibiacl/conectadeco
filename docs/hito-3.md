# Hito 3: Desarrollo Backend

**Proyecto:** ConectaDeco — Marketplace de fundas premium para iPhone
**Stack:** Node.js + Express + PostgreSQL (`pg`) + JWT + CORS + Jest + Supertest

---

## Descripción

En este hito desarrollé la parte backend del proyecto, construyendo una API REST conectada a PostgreSQL y preparada para responder a las necesidades del frontend trabajado en el Hito 2. Además de la autenticación y los pedidos, en esta etapa quedó integrada la persistencia real del carrito y los favoritos, de forma que la aplicación ya no depende de datos temporales en memoria.

---

## Estructura entregada

```text
app/backend/
├── config/
│   ├── cors.js                 ← Configuración de orígenes permitidos
│   └── env.js                  ← Carga de variables de entorno
├── controllers/
│   ├── auth.controller.js      ← Registro, login y perfil
│   ├── cart.controller.js      ← Gestión del carrito autenticado
│   ├── favorites.controller.js ← Gestión de favoritos autenticados
│   ├── orders.controller.js    ← Creación e historial de pedidos
│   └── productos.controller.js ← Listado y detalle de productos
├── db/
│   ├── pool.js                 ← Conexión a PostgreSQL
│   └── schema.sql              ← Modelo relacional y datos semilla
├── middlewares/
│   ├── async-handler.js        ← Manejo de errores async
│   ├── auth.middleware.js      ← Validación de token Bearer
│   ├── error.middleware.js     ← Respuesta centralizada de errores
│   └── not-found.middleware.js ← Manejo de rutas no encontradas
├── routes/
│   ├── auth.routes.js          ← Rutas de autenticación
│   ├── cart.routes.js          ← Rutas del carrito
│   ├── favorites.routes.js     ← Rutas de favoritos
│   ├── orders.routes.js        ← Rutas de pedidos
│   └── productos.routes.js     ← Rutas de productos
├── services/
│   ├── auth.service.js         ← Lógica de autenticación y JWT
│   ├── cart.service.js         ← Persistencia de carrito en PostgreSQL
│   ├── favorites.service.js    ← Persistencia de favoritos en PostgreSQL
│   ├── orders.service.js       ← Lógica de pedidos y stock
│   └── productos.service.js    ← Consulta de productos y filtros
├── tests/
│   ├── auth.test.js            ← Tests de autenticación
│   ├── cart.test.js            ← Tests de carrito
│   ├── favorites.test.js       ← Tests de favoritos
│   ├── orders.test.js          ← Tests de pedidos
│   ├── productos.test.js       ← Tests de productos
│   └── setupEnv.js             ← Configuración de entorno de test
├── .env.example                ← Variables de entorno de ejemplo
├── index.js                    ← Inicio del servidor
├── server.js                   ← Aplicación Express
├── package.json                ← Dependencias y scripts
└── README.md                   ← Guía técnica del backend
```

---

## Rúbricas

### 1. Crear un nuevo proyecto de npm e instalar todas las dependencias que necesitarás

**Solicitado:** Crear un proyecto npm para el backend e instalar las dependencias necesarias para desarrollar la API REST.

**Entregado:**

- Se creó la carpeta `app/backend` como proyecto independiente
- Se configuró `package.json` con scripts:
  - `npm run dev`
  - `npm start`
  - `npm test`
- Dependencias principales instaladas:
  - `express` — servidor HTTP y definición de rutas
  - `pg` — comunicación con PostgreSQL
  - `jsonwebtoken` — autenticación con JWT
  - `bcryptjs` — hash de contraseñas
  - `cors` — control de acceso entre frontend y backend
  - `dotenv` — variables de entorno
- Dependencias de desarrollo:
  - `jest`
  - `supertest`
  - `nodemon`

**En palabras simples:**  
En esta parte dejé armado el proyecto backend desde cero con npm, con todas las librerías necesarias para conectarse a la base de datos, autenticar usuarios, proteger rutas y ejecutar pruebas.

---

### 2. Utilizar el paquete pg para gestionar la comunicación con la base de datos PostgreSQL

**Solicitado:** Utilizar `pg` para que la API se comunique con PostgreSQL y trabaje con información persistente.

**Entregado:**

- Se creó `db/pool.js` para manejar la conexión con PostgreSQL usando `Pool`
- La configuración funciona mediante `DATABASE_URL`
- Se creó `db/schema.sql` con un modelo relacional alineado al ERD del Hito 1

**Tablas implementadas:**
- `usuarios`
- `productos`
- `categorias`
- `producto_categorias`
- `pedidos`
- `pedido_items`
- `cart_items`
- `favorites`

**Relaciones implementadas:**
- 1:N — `usuarios` → `pedidos`
- 1:N — `pedidos` → `pedido_items`
- N:M — `productos` ↔ `categorias` mediante `producto_categorias`
- N:M — `usuarios` ↔ `productos` favoritos mediante `favorites`
- 1:N — `usuarios` → `cart_items`

**Datos semilla agregados:**
- usuario admin demo
- productos iniciales para catálogo
- categorías derivadas desde los productos cargados

**En palabras simples:**  
La base de datos ya no quedó solo como diseño teórico. En este hito la conecté de verdad con el backend, respetando la estructura relacional planteada antes y usándola para usuarios, productos, pedidos, carrito y favoritos.

---

### 3. Implementar la autenticación y autorización de usuarios con JWT

**Solicitado:** Implementar autenticación y autorización de usuarios usando JWT.

**Entregado:**

- Rutas implementadas:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- El registro y login retornan:
  - `token`
  - `user`
- El token JWT incluye información del usuario:
  - `id`
  - `email`
  - `role`
  - `nombre`
- Las contraseñas se almacenan encriptadas con `bcryptjs`
- Las rutas privadas validan el token y cargan el usuario autenticado

**En palabras simples:**  
Con esto el usuario puede crear cuenta, iniciar sesión y trabajar con su propia información. El token Bearer es el que permite acceder al carrito, favoritos, pedidos y perfil autenticado.

---

### 4. Usar el paquete CORS para permitir las consultas de orígenes cruzados

**Solicitado:** Configurar CORS para permitir que el frontend consuma el backend correctamente.

**Entregado:**

- Se creó `config/cors.js`
- El backend lee `FRONTEND_URL` desde variables de entorno
- Se soporta más de un origen si se define separado por comas
- Se habilitó el intercambio seguro entre frontend y backend para las rutas de la API

**En palabras simples:**  
Configuré el backend para aceptar peticiones del frontend del proyecto y evitar problemas de acceso por origen cruzado mientras se desarrolla y se prueba la aplicación.

---

### 5. Utilizar middlewares para validar las credenciales o token en cabeceras en las rutas que aplique

**Solicitado:** Utilizar middlewares para validar credenciales o token en rutas protegidas.

**Entregado:**

- Se implementó `auth.middleware.js`
- El middleware valida el header:
  - `Authorization: Bearer <token>`
- Si el token no existe o no es válido, responde con `401`
- Si el token es correcto, se adjunta el usuario en `req.user`
- También se implementaron:
  - `async-handler.js`
  - `error.middleware.js`
  - `not-found.middleware.js`

**Rutas protegidas:**
- `GET /api/auth/me`
- `POST /api/orders`
- `GET /api/orders/me`
- `GET /api/favorites`
- `POST /api/favorites/:productId`
- `DELETE /api/favorites/:productId`
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:productId`
- `DELETE /api/cart/:productId`

**En palabras simples:**  
Los middlewares permiten controlar quién puede entrar a cada ruta privada. Gracias a eso, cada usuario ve y modifica solo su propio carrito, sus favoritos y su historial de pedidos.

---

### 6. Realizar test de por lo menos 4 rutas de la API REST comprobando los códigos de estados de diferentes escenarios

**Solicitado:** Probar al menos 4 rutas revisando distintos códigos de estado y escenarios.

**Entregado:**

- Se agregaron pruebas automáticas con `Jest` y `Supertest`
- Archivos de prueba implementados:
  - `auth.test.js`
  - `productos.test.js`
  - `orders.test.js`
  - `favorites.test.js`
  - `cart.test.js`

**Escenarios cubiertos:**
- registro exitoso con código `201`
- login inválido con código `401`
- perfil autenticado con código `200`
- listado de productos con código `200`
- producto inexistente con código `404`
- pedido sin token con código `401`
- pedido autenticado con código `201`
- historial de pedidos con código `200`
- favoritos autenticados con código `200` y `201`
- carrito autenticado con código `200` y `201`

**En palabras simples:**  
No solo dejé el backend funcionando, también verifiqué con pruebas que las rutas importantes respondan bien en casos correctos y en errores frecuentes.

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
| `GET` | `/api/orders/me` | Ver historial de pedidos |
| `GET` | `/api/favorites` | Listar favoritos del usuario |
| `POST` | `/api/favorites/:productId` | Agregar producto a favoritos |
| `DELETE` | `/api/favorites/:productId` | Eliminar producto de favoritos |
| `GET` | `/api/cart` | Obtener carrito del usuario |
| `POST` | `/api/cart` | Agregar producto al carrito |
| `PUT` | `/api/cart/:productId` | Actualizar cantidad en carrito |
| `DELETE` | `/api/cart/:productId` | Eliminar producto del carrito |

---

## Integración con el Frontend

Una parte importante de este hito fue conectar el backend real con el frontend desarrollado en React en el Hito 2. La integración quedó resuelta de la siguiente manera:

- `services/api.js` en el frontend utiliza `axios` con `baseURL` apuntando al backend
- El interceptor de axios envía automáticamente el token Bearer guardado en `localStorage`
- `AuthContext.jsx` consume:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- `Catalogo.jsx` consume:
  - `GET /api/productos`
- `ShopContext.jsx` consume:
  - `GET /api/cart`
  - `POST /api/cart`
  - `PUT /api/cart/:productId`
  - `DELETE /api/cart/:productId`
  - `GET /api/favorites`
  - `POST /api/favorites/:productId`
  - `DELETE /api/favorites/:productId`
- `Carrito.jsx` consume:
  - `POST /api/orders`
- `Dashboard.jsx` consume:
  - `GET /api/orders/me`

**Resultado de la integración:**
- los productos ya se cargan desde PostgreSQL y no desde datos simulados
- el carrito ya no es temporal, sino persistente por usuario
- los favoritos quedan guardados en la base de datos
- las compras generan pedidos reales en PostgreSQL
- el frontend y el backend comparten el mismo flujo de autenticación

**En palabras simples:**  
Con esta integración el proyecto dio un paso importante, porque la aplicación dejó de ser solo interfaz y pasó a trabajar con información real guardada en la base de datos.

---

## Coherencia con Hito 1 y Hito 2

- Se mantuvo la idea central del proyecto definida desde el Hito 1: marketplace de fundas premium para iPhone
- La base de datos respeta la estructura relacional planteada en el ERD del Hito 1
- La autenticación conserva el formato de sesión esperado desde el Hito 2: `{ token, user }`
- El frontend ya consume el backend real para login, registro, productos, carrito, favoritos y pedidos
- Las rutas implementadas responden a los flujos de navegación definidos en los hitos anteriores
- La arquitectura quedó modular para facilitar futuras integraciones y despliegue

---

## Conclusión

En este hito quedó desarrollado el backend funcional de ConectaDeco y además se completó la integración real con el frontend. La API ya permite registrar usuarios, iniciar sesión, consultar productos, administrar favoritos, trabajar con carrito persistente y generar pedidos conectados a PostgreSQL. De esta manera, el proyecto avanza desde la planificación y prototipado de los hitos anteriores hacia una aplicación web mucho más completa y cercana a un entorno real.
