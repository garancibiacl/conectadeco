# README Técnico: Rediseño Home - ConectaDeco

## 1. Objetivo del cambio
Recrear la Home pública de ConectaDeco en React + Tailwind, siguiendo el mockup de referencia y priorizando:
- estética moderna/minimalista,
- paleta suave (rosado/lila/crema),
- estructura modular,
- diseño responsive mobile-first,
- componentes reutilizables para escalar el front.

## 2. Alcance implementado
La página `Home` por una versión modular con 5 bloques:
1. Hero Section
2. Categorías / Destacados
3. Productos destacados (dinámico)
4. Banner promocional
5. Footer simple con redes

## 3. Archivos creados / modificados
### Modificado
- `app/frontend/src/pages/Home.jsx`

### Nuevos componentes
- `app/frontend/src/components/home/HeroSection.jsx`
- `app/frontend/src/components/home/FeaturedSection.jsx`
- `app/frontend/src/components/home/PromoBanner.jsx`

## 4. Estructura técnica de la Home

### Home.jsx (composición principal)
Responsabilidades:
- Orquestar las secciones de la página.
- Cargar productos mock destacados con `useState + useEffect`.
- Renderizar el grid de `ProductCard` usando `map()`.
- Definir footer y CTA secundaria hacia catálogo.

Estado local usado:
- `products`: arreglo de productos destacados.
- `loadingProducts`: estado de carga para skeleton cards.

Flujo:
1. Al montar, `useEffect` simula carga asíncrona con `setTimeout`.
2. Se setean productos mock.
3. Se renderiza grid responsive de `ProductCard`.

### HeroSection.jsx
Incluye:
- badge superior de colección,
- título principal ("Florece tu estilo"),
- subtítulo,
- CTA principal (`/catalogo`) y secundario (`/registro`),
- imagen destacada en contenedor con tarjeta flotante informativa.

### FeaturedSection.jsx
Incluye:
- grid responsive `1 columna mobile / 3 desktop`,
- cards de categoría con imagen + overlay degradado,
- título, subtítulo y botón de acción por card,
- hover con zoom suave.

### PromoBanner.jsx
Incluye:
- bloque promocional visualmente diferenciado (fondo oscuro elegante),
- mensaje de comunidad + incentivo de descuento,
- botón a registro.

## 5. Decisiones de UI/UX
- **Paleta:** base clara con acentos rosa/lila para mantener identidad floral suave.
- **Jerarquía visual:** hero dominante, seguido de categorías y luego productos.
- **Espaciado:** uso consistente de paddings amplios (`px-4 sm:px-6 lg:px-8`, secciones con `py-12`/`py-14`).
- **Bordes y profundidad:** `rounded` pronunciado + `shadow` sutil en cards y bloques.
- **Microinteracciones:** transiciones en hover (scale, color, elevación ligera).

## 6. Responsive (mobile-first)
Breakpoints utilizados con Tailwind:
- `sm`: ajustes de tipografía y layout intermedio.
- `md`: categorías en 3 columnas.
- `lg`: distribución hero en 2 columnas + productos en 4 columnas.

Comportamiento clave:
- Hero apila contenido en mobile y pasa a `2 columnas` en desktop.
- Categorías: `grid-cols-1 md:grid-cols-3`.
- Productos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.

## 7. Integración con componentes existentes
Se reutilizó `ProductCard` existente para mantener consistencia con el catálogo y evitar duplicación de lógica visual.

## 8. Datos mock de productos
Se definió `mockFeaturedProducts` dentro de `Home.jsx` para simular backend.
Campos usados por `ProductCard`:
- `id`
- `nombre`
- `precio`
- `imagen`
- `categoria`
- `stock`

## 9. Validación técnica realizada
Se ejecutó build de frontend:
- comando: `npm run build`
- resultado: compilación exitosa con Vite, sin errores.

## 10. Resultado final
La Home quedó alineada al mockup y requerimientos funcionales:
- modular,
- responsive,
- estética coherente con marca,
- lista para conectar datos reales desde backend cuando se requiera.
