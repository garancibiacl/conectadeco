# ConectaDeco Frontend

Frontend de ConectaDeco desarrollado con React + Vite.
Este documento está actualizado para el **Hito 2** y en español.

## Objetivo del Hito 2
Implementar la base funcional del e-commerce con foco en:
- Autenticación de usuarios.
- Navegación por catálogo.
- Flujo inicial de carrito.
- Área privada de usuario (dashboard).

## Stack tecnológico
- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 3
- Axios
- SweetAlert2
- Lucide React

## Requisitos
- Node.js 18+
- npm 9+
- Backend ejecutándose (API en `http://localhost:3000/api` o URL configurada)

## Instalación y ejecución
```bash
npm install
npm run dev
```

La app quedará disponible (por defecto) en `http://localhost:5173`.

## Variables de entorno
Crear archivo `.env` en `frontend/` con:

```env
VITE_API_URL=http://localhost:3000/api
```

Si no se define, el frontend usa `http://localhost:3000/api` por defecto.

## Scripts disponibles
- `npm run dev`: levanta entorno local con HMR.
- `npm run build`: genera build de producción en `dist/`.
- `npm run preview`: sirve build localmente.
- `npm run lint`: ejecuta ESLint.

## Alcance implementado (Hito 2)
- **Autenticación**:
  - Registro (`/registro`) y login (`/login`).
  - Persistencia de sesión en `localStorage`.
  - Envío automático de token JWT por interceptor de Axios.
- **Rutas y protección**:
  - Ruta privada `/dashboard` mediante `PrivateRoute`.
  - Redirección a `/login` si no hay sesión.
- **Catálogo (`/catalogo`)**:
  - Carga de productos desde API (`GET /productos`).
  - Búsqueda por nombre y filtro por categorías.
- **Carrito (`/carrito`)**:
  - Vista funcional con estado local demo.
  - Ajuste de cantidades, eliminación de ítems y resumen de compra.
- **Dashboard (`/dashboard`)**:
  - Vista privada con datos de sesión y rol.
  - Estadísticas iniciales (productos/pedidos base).
- **Home (`/`)**:
  - Landing principal y navegación al catálogo.

## Rutas del frontend
- `/` Home
- `/catalogo` Catálogo
- `/carrito` Carrito
- `/login` Inicio de sesión
- `/registro` Registro
- `/dashboard` Área privada

## Estructura del proyecto
```text
frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── router/
│   └── services/
├── public/
├── index.html
└── package.json
```

## Cuenta demo (según interfaz actual)
- Email: `admin@conectadeco.com`
- Contraseña: `admin123`

## Pendientes para siguiente hito
- Conectar carrito a estado global/contexto y persistencia real en backend.
- Implementar vista `/perfil` (actualmente enlazada desde dashboard, no implementada).
- Completar flujo de pedidos reales y métricas de dashboard.
- Incorporar pruebas (unitarias/integración) para rutas y auth.
