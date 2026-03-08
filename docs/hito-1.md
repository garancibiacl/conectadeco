# Hito 1: Diseño y Prototipo

**Proyecto:** ConectaDeco — Marketplace de fundas premium para iPhone
**Entregable principal:** `Hito_1_Diseno_y_Prototipo_ConectaDeco.pdf`

---

## Descripción

ConectaDeco es un e-commerce enfocado en la venta de carcasas florales y simétricas para iPhone y accesorios premium. El público objetivo son mujeres entre 20 y 40 años que buscan diseño, estilo y calidad. Este hito cubre la especificación técnica completa y el prototipo visual del sistema.

---

## Estructura entregada

```
hitos/01-hito-diseno-prototipo/
├── Hito_1_Diseno_y_Prototipo_ConectaDeco.pdf
├── README.md
├── api/
│   └── api-contract.md          ← Contrato REST completo
├── base_datos/
│   └── erd-conectadeco.png      ← Diagrama entidad-relación
├── dependencias/
│   ├── dependencias.md          ← Stack frontend y backend
│   └── dependencias.txt
├── navegacion/
│   └── navegacion.png           ← Diagrama de rutas y reglas de sesión
└── mockups/mockups/
    ├── Publicas/                 ← 9 pantallas públicas
    ├── Privadas/                 ← 8 pantallas privadas + HTML interactivo
    └── conectadeco_ui_kit_system/← Sistema de diseño completo
```

---

## Rúbricas

### 1. Diseño y Prototipo

**Solicitado:** Wireframes y mockups de todas las pantallas, guía de estilos y componentes, mapa de navegación y flujos de usuario documentados.

**Entregado:**

**Vistas Públicas (9 pantallas):**

| Pantalla | Ruta | Archivo |
|---|---|---|
| Home / Landing | `/` | `Publicas/conectadeco_home_screen/screen.png` |
| Catálogo de productos | `/catalogo` | `Publicas/product_catalog_grid/screen.png` |
| Detalle de producto | `/producto/:id` | `Publicas/product_detail_view/screen.png` |
| Login | `/login` | `Publicas/Login/screen.png` |
| Registro | `/registro` | `Publicas/account_access_registration/screen.png` |
| Carrito / Checkout | `/carrito` | `Publicas/shopping_cart_checkout_flow/screen.png` |
| Checkout finalizar compra | `/checkout` | `Publicas/premium_checkout_finalize_purchase/screen.png` |
| Modal editar producto (v1) | — | `Publicas/edit_product_modal_view_1/screen.png` |
| Modal editar producto (v2) | — | `Publicas/edit_product_modal_view_2/screen.png` |

**Vistas Privadas (8 pantallas):**

| Pantalla | Ruta | Archivo |
|---|---|---|
| Dashboard Admin overview | `/dashboard` | `Privadas/main_admin_dashboard_overview/screen.png` |
| Inventario de productos (admin) | `/admin/productos` | `Privadas/admin_product_inventory_dashboard/screen.png` |
| Perfil — Información | `/perfil` | `Privadas/user_profile_information_view/screen.png` |
| Perfil — Favoritos (lista) | `/favoritos` | `Privadas/user_profile_favorites_list_view/screen.png` |
| Perfil — Favoritos (vacío) | `/favoritos` | `Privadas/user_profile_favorites_empty_state_view/screen.png` |
| Perfil — Historial pedidos | `/mis-pedidos` | `Privadas/user_profile_orders_history_view/screen.png` |
| Perfil — Panel admin | — | `Privadas/user_profile_admin_panel/screen.png` |
| Perfil — Tarjeta acceso admin | — | `Privadas/user_profile_admin_access_card/screen.png` |

**UI Kit / Sistema de diseño:**
- `conectadeco_ui_kit_system/screen.png` — componentes reutilizables, tokens de color, tipografía, botones, cards e iconografía con identidad visual femenina, estética floral y moderna

**Prototipo interactivo:**
- `Privadas/user_profile_orders_history_view/code.html` — implementación funcional en HTML + Tailwind CSS con modo oscuro/claro, pestañas de navegación de perfil y tarjetas de pedidos con estados (Procesando / Entregado)

---

### 2. Navegación (Rutas Públicas y Privadas)

**Solicitado:** Definir las rutas del sistema, separación entre sección pública y privada, y las reglas de acceso por sesión.

**Entregado** (`navegacion/navegacion.png`):

**Sección Pública:**

| Ruta | Descripción |
|---|---|
| `/` | Home |
| `/registro` | Crear cuenta |
| `/login` | Ingresar |
| `/catalogo` | Tienda |
| `/carrito` | Carrito |
| `/producto/:id` | Detalle de producto |

**Sección Privada (requiere sesión):**

| Ruta | Descripción |
|---|---|
| `/dashboard` | Usuario logueado |
| `/perfil` | Mi Perfil |
| `/mis-pedidos` | Mis Compras |
| `/mis-ventas` | Mis Ventas |
| `/favoritos` | Mis Favoritos |
| `/checkout` | Checkout |

**Regla de acceso:** Si no existe sesión → redirigir automáticamente a `/login`

**Estructura de sesión frontend:**
```json
{ "token": "string", "user": { "id": "number", "email": "string", "role": "string" } }
```

---

### 3. Base de Datos (Modelo Relacional)

**Solicitado:** Modelo de base de datos relacional con tablas, relaciones y diagrama ERD.

**Entregado** (`base_datos/erd-conectadeco.png`):

**Tablas principales:**
- `users`
- `products`
- `categories`
- `product_categories`
- `cart_items`
- `orders`
- `order_items`
- `favorites`

**Relaciones:**
- 1:N — usuarios → pedidos
- 1:N — pedidos → items de pedido
- N:M — productos ↔ categorías (via `product_categories`)
- N:M — usuarios ↔ productos favoritos (via `favorites`)

Modelo diseñado en formato ERD compatible con draw.io, entregado como PNG.

---

### 4. Contrato API REST

**Solicitado:** Especificación de endpoints REST con métodos, rutas, cuerpos de request/response y reglas de autenticación.

**Entregado** (`api/api-contract.md`):

**AUTH:**

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de usuario, retorna `{ id, email, name }` |
| `POST` | `/api/auth/login` | Login, retorna `{ token, user: { id, email, role } }` |

**PRODUCTS:**

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/products?category=&model=&q=` | Público |
| `GET` | `/api/products/:id` | Público |
| `POST` | `/api/products` | Admin |
| `PUT` | `/api/products/:id` | Admin |
| `DELETE` | `/api/products/:id` | Admin |

**ORDERS:**

| Método | Ruta | Acceso |
|---|---|---|
| `POST` | `/api/orders` | Autenticado |

Body: `{ items: [{ product_id, qty }] }` → Response: `{ order_id, total, status }`

**FAVORITES:**

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/favorites` | Autenticado |
| `POST` | `/api/favorites/:productId` | Autenticado |
| `DELETE` | `/api/favorites/:productId` | Autenticado |

**Autenticación:** Bearer Token en header `Authorization`. Rutas privadas requieren token; rutas admin requieren token + `role: admin`.

---

### 5. Stack Tecnológico y Dependencias

**Solicitado:** Definir el stack completo del proyecto con las dependencias para frontend y backend.

**Entregado** (`dependencias/dependencias.md`):

**Frontend (React):**
- `react` + `react-dom`
- `react-router-dom` — navegación por rutas
- `axios` — consumo de API REST
- `tailwindcss` — framework CSS
- `lucide-react` — iconografía
- `sweetalert2` — alertas y confirmaciones

**Backend (Node/Express):**
- `express` — servidor HTTP
- `pg` — conexión a PostgreSQL
- `jsonwebtoken` — autenticación JWT
- `cors` — control de acceso cross-origin
- `dotenv` — variables de entorno
- `express-validator` — validación de datos

**Dev / Testing (hitos futuros):**
- `nodemon`, `jest`, `supertest`

---

## Contexto del Proyecto

> ConectaDeco es un e-commerce enfocado en la venta de carcasas florales y simétricas para iPhone y accesorios premium. El público objetivo son mujeres entre 20 y 40 años que buscan diseño, estilo y calidad. La arquitectura está preparada para escalar en hitos siguientes hacia integración backend, testing y deployment.
