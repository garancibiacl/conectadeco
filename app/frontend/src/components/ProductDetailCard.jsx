import { Check, Heart, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

function buildGallery(producto) {
  if (!producto.imagen) {
    return []
  }

  return [
    { id: 'main', src: producto.imagen, alt: producto.nombre, bg: 'bg-white' },
    { id: 'detail-1', src: producto.imagen, alt: `${producto.nombre} vista detalle`, bg: 'bg-[#f7f4ee]' },
    { id: 'detail-2', src: producto.imagen, alt: `${producto.nombre} textura`, bg: 'bg-[#efe7df]' },
    { id: 'detail-3', src: producto.imagen, alt: `${producto.nombre} lifestyle`, bg: 'bg-[#eef3ea]' },
  ]
}

function buildColorOptions(producto) {
  const baseOptions = [
    { id: 'rojo', label: 'Rojo coral', className: 'bg-[#ff6b6b]' },
    { id: 'azul', label: 'Azul noche', className: 'bg-[#19376d]' },
    { id: 'gris', label: 'Perla', className: 'bg-[#e5e7eb]' },
    { id: 'negro', label: 'Negro grafito', className: 'bg-[#111827]' },
  ]

  const text = `${producto.nombre} ${producto.descripcion || ''}`.toLowerCase()
  const keywordMap = [
    { match: ['rojo', 'crimson', 'blush', 'rose'], id: 'rojo' },
    { match: ['blue', 'azul', 'night', 'midnight'], id: 'azul' },
    { match: ['black', 'negro', 'graphite', 'orchid'], id: 'negro' },
  ]

  const activeColor =
    keywordMap.find(({ match }) => match.some((keyword) => text.includes(keyword)))?.id || 'negro'

  return baseOptions.map((option) => ({ ...option, active: option.id === activeColor }))
}

function buildModelOptions(producto) {
  const options = [producto.modelo, producto.categoria]
    .filter(Boolean)
    .map((label, index) => ({
      id: `${label}-${index}`,
      label,
      active: index === 0,
    }))

  if (options.length === 1) {
    options.push({
      id: `${producto.categoria || 'catalogo'}-alt`,
      label: producto.categoria === producto.modelo ? 'Otras versiones' : producto.categoria,
      active: false,
      disabled: true,
    })
  }

  return options
}

export default function ProductDetailCard({
  producto,
  loadingAction = false,
  favoriteActive = false,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
}) {
  const gallery = useMemo(() => buildGallery(producto), [producto])
  const colorOptions = useMemo(() => buildColorOptions(producto), [producto])
  const modelOptions = useMemo(() => buildModelOptions(producto), [producto])
  const [selectedImage, setSelectedImage] = useState(gallery[0]?.src || producto.imagen || '')
  const previousPrice = Math.round(Number(producto.precio) * 1.35)

  useEffect(() => {
    setSelectedImage(gallery[0]?.src || producto.imagen || '')
  }, [gallery, producto.imagen])

  return (
    <section className="overflow-hidden rounded-[34px] border border-stone-100 bg-white shadow-[0_28px_80px_-50px_rgba(15,23,42,0.28)]">
      <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 lg:p-8">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[#f8f5f1] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={producto.nombre}
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-sm text-stone-400 sm:h-[520px]">
                Sin imagen
              </div>
            )}
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-label={favoriteActive ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              className={`absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors ${
                favoriteActive
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-stone-500 hover:text-red-600'
              }`}
            >
              <Heart size={18} className={favoriteActive ? 'fill-current' : ''} />
            </button>
            {producto.stock === 0 && (
              <span className="absolute left-5 top-5 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
                Sin stock
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {(gallery.length ? gallery : [{ id: 'fallback', src: '', alt: 'Sin imagen', bg: 'bg-stone-100' }]).map((item) => {
              const active = item.src === selectedImage || (!item.src && !selectedImage)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.src && setSelectedImage(item.src)}
                  className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-all ${
                    active
                      ? 'border-red-500 ring-2 ring-red-100'
                      : 'border-stone-200 hover:border-stone-300'
                  } ${item.bg}`}
                  aria-label={`Vista ${item.id}`}
                >
                  {item.src ? (
                    <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-stone-400">Sin imagen</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-500">
              New arrival
              <span className="ml-3 text-stone-400">Categoria {producto.categoria}</span>
            </p>

            <h1 className="mt-3 max-w-lg text-[2rem] font-bold leading-[1.05] tracking-tight text-stone-900 sm:text-[2.75rem]">
              {producto.nombre}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-500 sm:text-[15px]">
              {producto.descripcion || 'Diseño premium con acabado pulido, protección reforzada y presencia visual limpia para uso diario.'}
            </p>

            <div className="mt-7 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight text-red-500 sm:text-[3rem]">
                ${Number(producto.precio).toLocaleString('es-CL')}
              </span>
              <span className="pb-1 text-sm font-medium text-stone-400 line-through">
                ${previousPrice.toLocaleString('es-CL')}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Color
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`relative h-7 w-7 rounded-full border-2 transition-transform hover:scale-105 ${
                      option.active ? 'border-stone-900' : 'border-transparent'
                    }`}
                    aria-label={option.label}
                  >
                    <span className={`block h-full w-full rounded-full ${option.className}`} />
                    {option.active && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Device model
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {modelOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={option.disabled}
                    className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition-colors ${
                      option.active
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-stone-200 bg-white text-stone-400 hover:border-stone-300 hover:text-stone-600'
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <button
              type="button"
              disabled={producto.stock === 0 || loadingAction}
              onClick={onAddToCart}
              className="inline-flex min-h-16 items-center justify-center gap-2 rounded-[22px] border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.35)] transition-colors hover:border-stone-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={17} />
              {loadingAction ? 'Agregando...' : 'Agregar al carrito'}
            </button>
            <button
              type="button"
              disabled={producto.stock === 0 || loadingAction}
              onClick={onBuyNow}
              className="inline-flex min-h-16 items-center justify-center gap-2 rounded-[22px] bg-red-500 px-6 text-sm font-semibold text-white shadow-[0_20px_40px_-20px_rgba(239,68,68,0.65)] transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar ahora
            </button>
          </div>

          <div className="mt-8 grid gap-4 border-t border-stone-100 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-4">
              <div className="rounded-full bg-red-50 p-2 text-red-500">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">Envío gratis</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">En pedidos superiores a $50.000.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-4">
              <div className="rounded-full bg-red-50 p-2 text-red-500">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">Garantía total</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">30 días de protección por defectos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
