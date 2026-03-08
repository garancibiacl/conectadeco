# Hito 2: Desarrollo Frontend

**Proyecto:** ConectaDeco — Marketplace de fundas premium para iPhone
**Stack:** Vite + React JS + React Router DOM + Axios + Tailwind CSS + Lucide React + SweetAlert2

---

## Descripción

Desarrollo de la aplicación cliente con React, implementando navegación por rutas, manejo de estado global con Context API, componentes reutilizables y consumo preparado de la API REST definida en el Hito 1.

---

## Estructura entregada

```
app/frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          ← Barra de navegación con estado de sesión
│   │   ├── ProductCard.jsx     ← Tarjeta de producto reutilizable
│   │   └── PrivateRoute.jsx    ← Protección de rutas autenticadas
│   ├── pages/
│   │   ├── Home.jsx            ← Hero + productos destacados
│   │   ├── Catalogo.jsx        ← Grid con búsqueda y filtros
│   │   ├── Login.jsx           ← Formulario de autenticación
│   │   ├── Registro.jsx        ← Formulario de registro
│   │   ├── Dashboard.jsx       ← Panel de usuario/admin
│   │   └── Carrito.jsx         ← Resumen y gestión del carrito
│   ├── context/
│   │   └── AuthContext.jsx     ← Estado global de sesión
│   ├── router/
│   │   └── AppRouter.jsx       ← Definición de todas las rutas
│   └── services/
│       └── api.js              ← Instancia axios con interceptor de token
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Rúbricas

### 1. Crear un nuevo proyecto usando npx e instalar las dependencias

**Solicitado:** Crear un nuevo proyecto React con npx e instalar las dependencias necesarias acorde al diseño y temática del Hito 1.

**Entregado:**
- Proyecto inicializado con `npm create vite@latest` (invoca npx internamente) con template React JS
- Dependencias instaladas:
  - `react-router-dom` — navegación entre vistas
  - `axios` — consumo de API REST
  - `lucide-react` — iconografía
  - `sweetalert2` — alertas y confirmaciones
  - `tailwindcss@3` + `postcss` + `autoprefixer` — framework CSS

---

### 2. Utilizar React Router para la navegación entre rutas

**Solicitado:** Usar React Router para la navegación entre vistas, incluyendo la redirección programática.

**Entregado:**

| Elemento | Implementación |
|---|---|
| `<BrowserRouter>` | `App.jsx` — envuelve toda la aplicación |
| `<Routes>` + `<Route>` | `AppRouter.jsx` — declara todas las rutas públicas y privadas |
| `<Link>` | `Navbar.jsx`, `Login.jsx`, `Registro.jsx` — navegación declarativa |
| `<Navigate>` | `PrivateRoute.jsx` (redirige a `/login`), ruta `*` (fallback a `/`) |
| `useNavigate` | `AuthContext.jsx` (post-login y post-registro), `Home.jsx`, `Catalogo.jsx`, `Dashboard.jsx`, `Carrito.jsx` — redirección programática |

Rutas definidas:

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Home | Pública |
| `/catalogo` | Catalogo | Pública |
| `/login` | Login | Pública |
| `/registro` | Registro | Pública |
| `/carrito` | Carrito | Pública |
| `/dashboard` | Dashboard | Privada (requiere sesión) |
| `*` | → `/` | Fallback |

---

### 3. Reutilizar componentes haciendo uso del paso de props y renderización dinámica

**Solicitado:** Usar componentes con paso de props y renderización dinámica para la reutilización de código.

**Entregado:**

- `ProductCard.jsx` recibe el objeto `producto` como prop y renderiza: nombre, precio, imagen, categoría, estado de stock y botón de acción
- Utilizado en `Home.jsx` y `Catalogo.jsx` mediante `.map()` sobre arrays de datos
- Renderizado condicional implementado: skeleton de carga, estado vacío, badge sin stock, visibilidad de botones en hover
- `PrivateRoute.jsx` recibe `children` como prop y decide si renderiza o redirige

---

### 4. Hacer uso de los hooks para un desarrollo ágil y reactivo

**Solicitado:** Utilizar los hooks de React necesarios para un desarrollo ágil y reactivo.

**Entregado:**

| Hook | Uso |
|---|---|
| `useState` | Formularios (Login, Registro), filtros y búsqueda (Catalogo), menú mobile (Navbar), items del carrito (Carrito), estadísticas (Dashboard) |
| `useEffect` | Fetch de productos destacados (Home), fetch del catálogo completo (Catalogo), fetch de estadísticas (Dashboard) |
| `useContext` | Consumo de `AuthContext` via `useAuth()` en Navbar, Login, Registro, Dashboard, PrivateRoute |
| `useNavigate` | Redirección programática en 5 componentes tras acciones del usuario |

---

### 5. Utilizar Context para el manejo del estado global

**Solicitado:** Implementar Context API para el manejo del estado global de la aplicación.

**Entregado:**

`AuthContext.jsx` maneja el estado global de autenticación:

- **Estado:** `session` — objeto `{ token, user: { id, nombre, email, role } }` persistido en `localStorage`
- **Acciones expuestas:** `login(email, password)`, `registro(nombre, email, password)`, `logout()`
- **Provider:** `<AuthProvider>` envuelve toda la aplicación desde `App.jsx`
- **Consumo activo** mediante el custom hook `useAuth()` en:
  - `Navbar.jsx` — muestra nombre de usuario y botón de logout
  - `Login.jsx` — llama a `login()` y maneja errores
  - `Registro.jsx` — llama a `registro()` y maneja errores
  - `Dashboard.jsx` — accede a `session.user.nombre` y `session.user.role`
  - `PrivateRoute.jsx` — verifica `session` para proteger rutas

`services/api.js` incluye un interceptor de axios que lee el token desde el estado global de `localStorage` e inyecta el header `Authorization: Bearer <token>` en cada request automáticamente.

---

## Coherencia con Hito 1

- Paleta de colores: rojo primario `#dc2626`, fondos blancos, grises neutros — fiel a los mockups entregados
- Rutas implementadas acorde al diagrama de navegación: sección pública (`/`, `/catalogo`, `/login`, `/registro`, `/carrito`) y sección privada (`/dashboard`)
- Regla de sesión aplicada: sin token → redirige a `/login`
- Estructura de sesión: `{ token, user: { id, email, role } }` coincide con el contrato definido en el Hito 1
- Endpoints consumidos desde `api.js` siguen el contrato REST del Hito 1: `GET /productos`, `POST /auth/login`, `POST /auth/register`
