import { Check, Heart, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function buildProductSwatches(producto) {
  const isPremiumSiliconeCase = normalizeText(producto.nombre) === normalizeText('Premium Silicone Case - Rojo Crimson')

  if (isPremiumSiliconeCase) {
    return [
      {
        label: 'Rojo Crimson',
        color: '#A42949',
        img: 'https://ae-pic-a1.aliexpress-media.com/kf/S44777cf674504d6a870e763dd5604cd4J.jpg_960x960q75.jpg_.avif',
      },
      {
        label: 'Celeste Ice',
        color: '#C7F0F5',
        img: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbd7ed9ee1d58448392466ad2756bc40ep.jpg_960x960q75.jpg_.avif',
      },
      {
        label: 'Beige Sand',
        color: '#EBE6DF',
        img: 'https://ae-pic-a1.aliexpress-media.com/kf/S63a0d3526a7f4e90837075467b97971aK.jpg_960x960q75.jpg_.avif',
      },
      { label: 'Negro', color: '#111111', img: producto.imagen || '' },
    ]
  }

  return [
    {
      label: 'Color principal',
      color: '#111111',
      img: producto.imagen || '',
    },
  ]
}

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

export default function ProductDetailCard({
  producto,
  modelOptions = [],
  loadingAction = false,
  favoriteActive = false,
  quantity = 1,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
}) {
  const colorSwatches = useMemo(
    () => buildProductSwatches(producto),
    [producto],
  )
  const resolvedModelOptions = useMemo(
    () =>
      modelOptions.length > 0
        ? modelOptions
        : [
            {
              id: producto.id,
              label: producto.modelo || producto.nombre,
              available: producto.stock > 0,
            },
          ],
    [modelOptions, producto.id, producto.modelo, producto.nombre, producto.stock],
  )
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0] || null)
  const [selectedModelId, setSelectedModelId] = useState(resolvedModelOptions[0]?.id || null)
  const [mainImage, setMainImage] = useState(colorSwatches[0]?.img || producto.imagen || '')
  const [imageVisible, setImageVisible] = useState(true)
  const gallery = useMemo(() => {
    const swatchGallery = colorSwatches
      .filter((swatch) => Boolean(swatch.img))
      .map((swatch) => ({
        id: `swatch-${swatch.color}`,
        src: swatch.img,
        alt: `${producto.nombre} color ${swatch.color}`,
        bg: 'bg-white',
        color: swatch.color,
      }))

    const orderedSwatches = selectedColor
      ? [
          ...swatchGallery.filter((item) => item.color === selectedColor.color),
          ...swatchGallery.filter((item) => item.color !== selectedColor.color),
        ]
      : swatchGallery

    if (orderedSwatches.length >= 4) {
      return orderedSwatches.slice(0, 4)
    }

    const fallbackGallery = buildGallery(producto)
      .filter((item) => item.src && !orderedSwatches.some((swatch) => swatch.src === item.src))
      .slice(0, Math.max(0, 4 - orderedSwatches.length))

    return [...orderedSwatches, ...fallbackGallery]
  }, [colorSwatches, producto, selectedColor])
  const previousPrice = Math.round(Number(producto.precio) * 1.35)
  const effectiveStock = producto.stock

  useEffect(() => {
    setSelectedColor(colorSwatches[0] || null)
    setMainImage(colorSwatches[0]?.img || producto.imagen || '')
  }, [colorSwatches, producto.id, producto.imagen])

  useEffect(() => {
    setSelectedModelId(resolvedModelOptions[0]?.id || null)
  }, [resolvedModelOptions])

  useEffect(() => {
    setImageVisible(false)
    const frameId = window.requestAnimationFrame(() => {
      setImageVisible(true)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [mainImage])

  const handleColorSelect = (swatch) => {
    setSelectedColor(swatch)
    setMainImage(swatch.img)
  }

  return (
    <section className="overflow-hidden rounded-[34px] border border-stone-100 bg-white shadow-[0_28px_80px_-50px_rgba(15,23,42,0.28)]">
      <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 lg:p-8">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[#f8f5f1] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={producto.nombre}
                className={`h-[420px] w-full object-cover transition-opacity duration-200 ease-out sm:h-[520px] ${
                  imageVisible ? 'opacity-100' : 'opacity-0'
                }`}
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
              const active = item.src === mainImage || (!item.src && !mainImage)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (!item.src) return
                    setMainImage(item.src)
                    const matchingSwatch = colorSwatches.find((swatch) => swatch.img === item.src)
                    if (matchingSwatch) {
                      setSelectedColor(matchingSwatch)
                    }
                  }}
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
              <div className="mt-3 flex items-center gap-2.5" role="radiogroup" aria-label="Seleccionar color">
                {colorSwatches.map((swatch) => {
                  const isActive = swatch.color === selectedColor?.color

                  return (
                  <button
                    key={swatch.color}
                    type="button"
                    onClick={() => handleColorSelect(swatch)}
                    role="radio"
                    aria-checked={isActive}
                    aria-label={swatch.label || `Color ${swatch.color}`}
                    className={`relative h-6 w-6 rounded-full transition duration-200 ease-out hover:scale-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                      isActive ? 'ring-2 ring-offset-2 ring-red-500' : ''
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full"
                      style={{ backgroundColor: swatch.color }}
                    />
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Device model
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {resolvedModelOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedModelId(option.id)}
                    className={`group relative overflow-hidden rounded-[20px] border px-5 py-4 text-center text-sm font-semibold transition-all duration-300 ${
                      option.id === selectedModelId
                        ? 'border-red-400 bg-red-50/80 text-red-500 shadow-[0_18px_35px_-28px_rgba(239,68,68,0.45)]'
                        : 'border-stone-200 bg-white text-stone-400 hover:border-stone-300 hover:text-stone-600 hover:shadow-[0_16px_32px_-28px_rgba(15,23,42,0.28)]'
                    }`}
                    aria-pressed={option.id === selectedModelId}
                  >
                    <span
                      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${
                        option.id === selectedModelId
                          ? 'bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.12),transparent_68%)] opacity-100'
                          : 'group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(231,229,228,0.55),transparent_70%)]'
                      }`}
                    />
                    <span className="relative block">{option.label}</span>
                    {!option.available && (
                      <span className="relative mt-1 block text-[11px] font-medium tracking-[0.12em] text-stone-400">
                        Sin stock
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex h-14 items-center rounded-[18px] bg-stone-100 px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <button
                  type="button"
                  onClick={onDecreaseQuantity}
                  disabled={quantity <= 1 || loadingAction || producto.stock === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-stone-500 transition-colors hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="inline-flex min-w-10 items-center justify-center px-2 text-base font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onIncreaseQuantity?.(effectiveStock)}
                  disabled={loadingAction || effectiveStock === 0 || quantity >= effectiveStock}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-stone-500 transition-colors hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={effectiveStock === 0 || loadingAction}
                onClick={() => onAddToCart?.(selectedColor)}
                className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-[20px] bg-red-500 px-6 text-base font-semibold text-white shadow-[0_20px_40px_-20px_rgba(239,68,68,0.65)] transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {loadingAction ? 'Agregando...' : 'Agregar al carro'}
              </button>

              <button
                type="button"
                onClick={onToggleFavorite}
                aria-label={favoriteActive ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors ${
                  favoriteActive
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-stone-200 bg-white text-stone-500 hover:border-rose-200 hover:text-rose-500'
                }`}
              >
                <Heart size={20} className={favoriteActive ? 'fill-current' : ''} />
              </button>
            </div>

            <button
              type="button"
              disabled={effectiveStock === 0 || loadingAction}
              onClick={() => onBuyNow?.(selectedColor)}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[20px] border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 shadow-[0_12px_30px_-25px_rgba(15,23,42,0.35)] transition-colors hover:border-stone-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar ahora
            </button>
          </div>

          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600">
            <span className={`h-2.5 w-2.5 rounded-full ${effectiveStock > 0 ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            {effectiveStock > 0
              ? `${effectiveStock} disponible${effectiveStock > 1 ? 's' : ''} en stock`
              : 'Sin stock disponible'}
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
