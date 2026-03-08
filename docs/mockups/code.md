# ConectaDeco Home - Ajuste UX

## Objetivo
Mejorar la experiencia de usuario en Home priorizando claridad visual, jerarquía de contenido y conversión hacia catálogo/registro.

## Estructura UX aplicada

### 1. Hero principal
- Mensaje de valor claro: `Florece tu estilo`.
- Subcopy breve enfocada en beneficio (diseño + protección).
- CTA primaria: `Ir a tienda`.
- CTA secundaria: `Personalizar`.
- Composición 2 columnas en desktop y apilado en mobile.

### 2. Colecciones destacadas
- Grid responsive: `1 columna mobile / 3 desktop`.
- Cards con imagen, título y subtítulo para escaneo rápido.
- Hover con zoom suave para feedback visual.
- Acción contextual: `Ver colección`.

### 3. Top carcasas (productos)
- Render dinámico con `useState + useEffect` y `map()`.
- Skeleton de carga para evitar layout shift.
- Grid responsive: `1 / 2 / 4 columnas` según breakpoint.
- Reutilización de `ProductCard` para consistencia del e-commerce.

### 4. Banner promocional
- Bloque visual de contraste para romper ritmo y captar atención.
- Mensaje corto con incentivo (descuento + lanzamientos).
- CTA directa a registro.

### 5. Footer simple
- Navegación por bloques: tienda, soporte, legal.
- Redes sociales visibles con iconos (`lucide-react`).
- Cierre legal y branding.

## Decisiones UX
- Jerarquía: Hero -> Categorías -> Productos -> Promo -> Footer.
- Espaciado amplio para lectura y percepción premium.
- Botones redondeados para lenguaje visual amable.
- Sombras suaves para profundidad sin ruido visual.
- Paleta suave rosado/lila/crema con alto contraste en CTAs.

## Responsive
- Mobile-first con Tailwind.
- Breakpoints usados: `sm`, `md`, `lg`.
- Contenedores consistentes: `max-w-7xl` + paddings adaptativos.

## Componentes involucrados
- `src/pages/Home.jsx`
- `src/components/home/HeroSection.jsx`
- `src/components/home/FeaturedSection.jsx`
- `src/components/home/PromoBanner.jsx`
- `src/components/ProductCard.jsx` (reutilizado)

## Resultado esperado
Una Home más clara, elegante y orientada a conversión, manteniendo identidad floral de marca y buena usabilidad en móvil y desktop.
