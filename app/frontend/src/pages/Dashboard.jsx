import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  Mail,
  MapPin,
  ReceiptText,
  Settings2,
  ShoppingBag,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { useAuth } from '../hooks/useAuth'
import { useShop } from '../hooks/useShop'
import { useProductos } from '../hooks/useProductos'
import { usePedidos } from '../hooks/usePedidos'

const DASHBOARD_SECTIONS = [
  { id: 'profile', label: 'Perfil', icon: UserRound },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'orders', label: 'Mis compras', icon: ReceiptText },
]

const ORDER_SELECTIONS_STORAGE_KEY = 'order_item_selections'

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString('es-CL')}`
}

function formatOrderDate(value) {
  if (!value) return 'Pedido reciente'

  return new Date(value).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getStatusLabel(status) {
  const normalized = String(status || '').toLowerCase()

  if (normalized === 'procesando') return 'Procesando'
  if (normalized === 'enviado') return 'Enviado'
  if (normalized === 'entregado') return 'Entregado'
  if (normalized === 'cancelado') return 'Cancelado'
  return 'Confirmado'
}

function getStatusClassName(status) {
  const normalized = String(status || '').toLowerCase()

  if (normalized === 'cancelado') return 'bg-stone-100 text-stone-500'
  if (normalized === 'entregado') return 'bg-emerald-100 text-emerald-700'
  if (normalized === 'enviado') return 'bg-sky-100 text-sky-700'
  return 'bg-amber-100 text-amber-700'
}

function getTrackingConfig(status) {
  const normalized = String(status || '').toLowerCase()

  if (normalized === 'entregado') {
    return {
      progress: 100,
      eta: 'Entregado',
      location: 'Pedido recibido en destino',
      steps: [
        { label: 'Confirmado', done: true },
        { label: 'Despachado', done: true },
        { label: 'En camino', done: true },
        { label: 'Entregado', done: true },
      ],
    }
  }

  if (normalized === 'enviado') {
    return {
      progress: 72,
      eta: 'Llega en 2 a 4 días',
      location: 'Centro logístico en tránsito',
      steps: [
        { label: 'Confirmado', done: true },
        { label: 'Despachado', done: true },
        { label: 'En camino', done: true },
        { label: 'Entregado', done: false },
      ],
    }
  }

  if (normalized === 'cancelado') {
    return {
      progress: 0,
      eta: 'Pedido cancelado',
      location: 'Sin movimiento disponible',
      steps: [
        { label: 'Confirmado', done: false },
        { label: 'Despachado', done: false },
        { label: 'En camino', done: false },
        { label: 'Entregado', done: false },
      ],
    }
  }

  return {
    progress: 36,
    eta: 'Preparando despacho',
    location: 'Bodega principal ConectaDeco',
    steps: [
      { label: 'Confirmado', done: true },
      { label: 'Despachado', done: false },
      { label: 'En camino', done: false },
      { label: 'Entregado', done: false },
    ],
  }
}

function readOrderSelections() {
  try {
    const raw = localStorage.getItem(ORDER_SELECTIONS_STORAGE_KEY)
    const parsed = JSON.parse(raw || '{}')

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return parsed
  } catch {
    return {}
  }
}

function getOrderItemSelection(orderId, item) {
  const selections = readOrderSelections()
  const orderSelections = selections[String(orderId)]

  if (!Array.isArray(orderSelections)) {
    return null
  }

  return (
    orderSelections.find((selection) => {
      if (selection.product_id === item.producto_id) {
        return true
      }

      return selection.nombre && item.nombre && selection.nombre === item.nombre
    }) || null
  )
}

function getCatalogProduct(productMap, item) {
  if (item.producto_id && productMap.has(item.producto_id)) {
    return productMap.get(item.producto_id)
  }

  const itemName = normalizeText(item.nombre)

  for (const product of productMap.values()) {
    const productName = normalizeText(product.nombre)

    if (productName && itemName.startsWith(productName)) {
      return product
    }
  }

  return null
}

function extractVariantFromItemName(itemName, productName) {
  const safeItemName = String(itemName || '').trim()
  const safeProductName = String(productName || '').trim()

  if (!safeItemName || !safeProductName) return null

  const normalizedItem = normalizeText(safeItemName)
  const normalizedProduct = normalizeText(safeProductName)

  if (!normalizedItem.startsWith(normalizedProduct)) {
    return null
  }

  const rawSuffix = safeItemName.slice(safeProductName.length).trim()

  if (!rawSuffix.startsWith('-')) {
    return null
  }

  const variant = rawSuffix.replace(/^-+\s*/, '').trim()
  return variant || null
}

function getItemModelLabel(orderId, item, catalogProduct) {
  return (
    item.variant?.modelLabel ||
    item.modelLabel ||
    item.producto?.modelo ||
    catalogProduct?.modelo ||
    getOrderItemSelection(orderId, item)?.variant?.modelLabel ||
    getOrderItemSelection(orderId, item)?.producto?.modelo ||
    null
  )
}

function getItemVariantLabel(orderId, item, catalogProduct) {
  return (
    item.variant?.label ||
    item.color ||
    item.variantLabel ||
    extractVariantFromItemName(item.nombre, catalogProduct?.nombre) ||
    getOrderItemSelection(orderId, item)?.variant?.label ||
    getOrderItemSelection(orderId, item)?.variant?.color ||
    null
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { session, updateProfile } = useAuth()
  const { favorites, cart, loadingFavorites, toggleFavorite, addToCart } = useShop()
  const { productos } = useProductos()
  const { pedidos, total: totalPedidos, loading: loadingOrders, error: ordersError } = usePedidos()

  const [activeSection, setActiveSection] = useState('orders')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [profileDraft, setProfileDraft] = useState(null)

  const latestOrder = pedidos[0] || null
  const totalItemsPurchased = pedidos.reduce(
    (sum, pedido) => sum + pedido.items.reduce((itemsSum, item) => itemsSum + item.cantidad, 0),
    0,
  )
  const favoriteProductsLabel = `${favorites.length} favorito${favorites.length === 1 ? '' : 's'} guardado${favorites.length === 1 ? '' : 's'}`
  const productsById = useMemo(
    () => new Map(productos.map((producto) => [producto.id, producto])),
    [productos],
  )
  const sectionMeta = useMemo(
    () => DASHBOARD_SECTIONS.find((section) => section.id === activeSection) || DASHBOARD_SECTIONS[0],
    [activeSection],
  )
  const ActiveSectionIcon = sectionMeta.icon
  const sessionProfile = useMemo(
    () => ({
      nombre: session?.user?.nombre || '',
      email: session?.user?.email || '',
    }),
    [session?.user?.nombre, session?.user?.email],
  )
  const profileForm = profileDraft || sessionProfile
  const profileChanged =
    profileForm.nombre !== sessionProfile.nombre || profileForm.email !== sessionProfile.email
  const accountInitial = (session?.user?.nombre || session?.user?.email || 'C')
    .trim()
    .charAt(0)
    .toUpperCase()

  const handleProfileChange = (field, value) => {
    setProfileDraft((current) => ({
      ...(current || profileForm),
      [field]: value,
    }))
  }

  const handleProfileSave = async () => {
    updateProfile(profileForm)
    setProfileDraft(null)
    await Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Tus datos personales fueron editados correctamente.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[28px] shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]',
        title: 'text-slate-900',
        htmlContainer: 'text-slate-500',
        confirmButton: 'rounded-full px-6 py-3 font-semibold',
      },
    })
  }

  const handleFavoriteAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
      await Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: 'Se agregó a tu carrito.',
        confirmButtonColor: '#dc2626',
      })
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleFavoriteRemove = async (productId) => {
    try {
      await toggleFavorite(productId)
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar favoritos',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4f9] px-4 py-6 text-slate-800 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.14),_transparent_30%),#ffffff] px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
                    Mi cuenta
                  </p>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    Gestiona tu experiencia
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Una vista clara para actualizar tu perfil, retomar favoritos y seguir cada compra con contexto útil.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-stone-100 bg-white/85 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Pedidos</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{totalPedidos}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-100 bg-white/85 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Productos</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{totalItemsPurchased}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-100 bg-white/85 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Favoritos</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{favorites.length}</p>
                    <p className="mt-1 text-xs text-slate-400">{cart.total} en carrito</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 rounded-[24px] bg-[#fcfbf9] p-2">
                {DASHBOARD_SECTIONS.map((section) => {
                  const Icon = section.icon
                  const isActive = section.id === activeSection

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-[0_10px_25px_-18px_rgba(15,23,42,0.35)]'
                          : 'text-slate-500 hover:-translate-y-0.5 hover:text-slate-800'
                      }`}
                      aria-pressed={isActive}
                    >
                      <Icon size={16} />
                      {section.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
            <section className="space-y-4">
              {activeSection === 'profile' && (
                <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] transition-all duration-200">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                        Perfil
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-900">Datos personales</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Mantén tu cuenta clara y reconocible con una edición simple, feedback inmediato y estados visibles.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 rounded-[24px] border border-stone-100 bg-[#fcfbf9] px-4 py-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-300 text-xl font-bold text-white shadow-[0_18px_30px_-18px_rgba(239,68,68,0.65)]">
                        {accountInitial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{session?.user?.nombre || 'Usuario'}</p>
                        <p className="mt-1 text-xs text-slate-500">{session?.user?.email || 'Sin email registrado'}</p>
                        <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCheck size={14} />
                          Cuenta activa
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Nombre</span>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          value={profileForm.nombre}
                          onChange={(event) => handleProfileChange('nombre', event.target.value)}
                          className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 ${
                            profileChanged
                              ? 'border-stone-200 bg-[#fcfbf9] focus:border-red-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,226,226,0.8)]'
                              : 'border-emerald-200 bg-emerald-50/60'
                          }`}
                        />
                        {!profileChanged && (
                          <CheckCircle2
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600"
                          />
                        )}
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <div className="relative mt-2">
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(event) => handleProfileChange('email', event.target.value)}
                          className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 ${
                            profileChanged
                              ? 'border-stone-200 bg-[#fcfbf9] focus:border-red-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,226,226,0.8)]'
                              : 'border-emerald-200 bg-emerald-50/60'
                          }`}
                        />
                        {!profileChanged && (
                          <CheckCircle2
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600"
                          />
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                    {profileChanged ? (
                      <>
                        <Clock3 size={14} />
                        Tienes cambios sin guardar.
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Datos sincronizados en esta sesión.
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-[0_16px_30px_-20px_rgba(239,68,68,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!profileChanged}
                    >
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileDraft(null)
                      }
                      className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-red-200 hover:text-red-600"
                    >
                      Restablecer
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'favorites' &&
                (loadingFavorites ? (
                  [...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className="h-44 animate-pulse rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]"
                    />
                  ))
                ) : favorites.length === 0 ? (
                  <div className="rounded-[28px] border border-white/70 bg-white p-8 text-center shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                      <Heart size={24} />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-slate-900">No tienes favoritos guardados</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Guarda los productos que más te gusten para volver a ellos rápidamente.
                    </p>
                    <button
                      onClick={() => navigate('/catalogo')}
                      className="mt-6 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                    >
                      Explorar catálogo
                    </button>
                  </div>
                ) : (
                  favorites.map((favorite) => (
                    <article
                      key={favorite.id}
                      className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_-30px_rgba(15,23,42,0.28)]"
                    >
                      <div className="flex gap-4 p-4 sm:p-5">
                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[22px] bg-stone-100">
                          {favorite.producto.imagen ? (
                            <img
                              src={favorite.producto.imagen}
                              alt={favorite.producto.nombre}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-stone-400">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.25em] text-rose-500">
                            {favorite.producto.categoria}
                          </p>
                          <h2 className="mt-2 text-lg font-semibold text-slate-900">
                            {favorite.producto.nombre}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">{favorite.producto.modelo}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="text-xl font-semibold text-slate-900">
                              {formatCurrency(favorite.producto.precio)}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                              Stock {favorite.producto.stock}
                            </span>
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                              Oferta destacada
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 border-t border-stone-100 px-4 py-4 sm:px-5">
                        <button
                          onClick={() => handleFavoriteAddToCart(favorite.producto.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                        >
                          <ShoppingBag size={15} />
                          Agregar al carrito
                        </button>
                        <button
                          onClick={() => handleFavoriteRemove(favorite.producto.id)}
                          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600"
                        >
                          Quitar de favoritos
                        </button>
                      </div>
                    </article>
                  ))
                ))}

              {activeSection === 'orders' &&
                (loadingOrders ? (
                  [...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className="h-52 animate-pulse rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]"
                    />
                  ))
                ) : ordersError ? (
                  <div className="rounded-[28px] border border-red-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
                    <p className="text-sm font-semibold text-slate-900">No pudimos cargar tus compras</p>
                    <p className="mt-2 text-sm text-slate-500">{ordersError}</p>
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="rounded-[28px] border border-white/70 bg-white p-8 text-center shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <ReceiptText size={24} />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-slate-900">Aún no tienes compras registradas</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Cuando proceses una compra, aquí verás el resumen de tu pedido y los productos incluidos.
                    </p>
                    <button
                      onClick={() => navigate('/catalogo')}
                      className="mt-6 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                    >
                      Ir al catálogo
                    </button>
                  </div>
                ) : (
                  pedidos.map((pedido) => {
                    const tracking = getTrackingConfig(pedido.estado)
                    const isExpanded = expandedOrderId === pedido.id

                    return (
                      <article
                        key={pedido.id}
                        className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_24px_56px_-28px_rgba(15,23,42,0.3)]"
                      >
                        <div className="flex flex-col gap-4 border-b border-stone-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-lg font-semibold text-slate-900">Pedido #{pedido.id}</p>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(pedido.estado)}`}
                              >
                                {getStatusLabel(pedido.estado)}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-2">
                                <CalendarDays size={15} />
                                {formatOrderDate(pedido.creadoEn)}
                              </span>
                              <span>
                                {pedido.items.length} producto{pedido.items.length === 1 ? '' : 's'}
                              </span>
                            </div>
                          </div>

                          <div className="text-left lg:text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Total pagado
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                              {formatCurrency(pedido.total)}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
                              <button
                                type="button"
                                onClick={() => setExpandedOrderId(isExpanded ? null : pedido.id)}
                                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-red-200 hover:text-red-600"
                              >
                                Ver detalle
                                <ChevronRight
                                  size={14}
                                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate('/catalogo')}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600"
                              >
                                <ShoppingBag size={14} />
                                Recomprar
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
                          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="rounded-2xl bg-[#fcfbf9] px-4 py-4">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Seguimiento
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-slate-900">{tracking.eta}</p>
                                </div>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(pedido.estado)}`}
                                >
                                  {tracking.progress}%
                                </span>
                              </div>

                              <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 transition-all duration-500"
                                  style={{ width: `${tracking.progress}%` }}
                                />
                              </div>

                              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                <MapPin size={14} />
                                {tracking.location}
                              </div>
                            </div>

                            <div className="rounded-2xl bg-[#fcfbf9] px-4 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Timeline
                              </p>
                              <div className="mt-4 space-y-3">
                                {tracking.steps.map((step) => (
                                  <div key={step.label} className="flex items-center gap-3">
                                    <span
                                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                        step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'
                                      }`}
                                    >
                                      {step.done ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                                    </span>
                                    <span className={`text-sm ${step.done ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                                      {step.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`grid overflow-hidden px-5 transition-all duration-200 sm:px-6 ${
                            isExpanded ? 'grid-rows-[1fr] py-5 opacity-100' : 'grid-rows-[0fr] py-0 opacity-0'
                          }`}
                        >
                          <div className="min-h-0 space-y-3">
                            {pedido.items.map((item, index) => (
                              (() => {
                                const catalogProduct = getCatalogProduct(productsById, item)
                                const modelLabel = getItemModelLabel(pedido.id, item, catalogProduct)
                                const variantLabel = getItemVariantLabel(pedido.id, item, catalogProduct)

                                return (
                              <div
                                key={`${pedido.id}-${item.producto_id}-${index}`}
                                className="flex items-start justify-between gap-4 rounded-2xl bg-[#fcfbf9] px-4 py-4"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-900">{item.nombre}</p>
                                  {(modelLabel || variantLabel) && (
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                      {modelLabel && (
                                        <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 shadow-sm">
                                          Modelo: {modelLabel}
                                        </span>
                                      )}
                                      {variantLabel && (
                                        <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 shadow-sm">
                                          Variante: {variantLabel}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 shadow-sm">
                                      Cantidad: {item.cantidad}
                                    </span>
                                    <span>Unitario: {formatCurrency(item.precio_unitario)}</span>
                                  </div>
                                </div>
                                <p className="shrink-0 text-sm font-semibold text-slate-900">
                                  {formatCurrency(item.precio_unitario * item.cantidad)}
                                </p>
                              </div>
                                )
                              })()
                            ))}
                          </div>
                        </div>
                      </article>
                    )
                  })
                ))}
            </section>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                  Sección activa
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <ActiveSectionIcon size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{sectionMeta.label}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {activeSection === 'profile' && 'Edita tus datos visibles y mantén tu cuenta reconocible.'}
                      {activeSection === 'favorites' && 'Recupera productos guardados y agrégalos al carrito en un paso.'}
                      {activeSection === 'orders' && 'Consulta compras procesadas y los productos incluidos en cada pedido.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                  Resumen
                </p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-[#fcfbf9] px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <UserRound size={16} />
                      {session?.user?.nombre || 'Usuario'}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={14} />
                      {session?.user?.email || 'Sin email'}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fcfbf9] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Actividad reciente</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {latestOrder ? `Pedido #${latestOrder.id}` : favoriteProductsLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {latestOrder
                        ? formatOrderDate(latestOrder.creadoEn)
                        : 'Explora productos para comenzar tu historial.'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fcfbf9] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Configuración</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Settings2 size={15} />
                      {session?.user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{productos.length} productos visibles en catálogo.</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 px-4 py-4 text-white">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles size={16} />
                      Acción rápida
                    </div>
                    <p className="mt-2 text-sm text-white/75">
                      Vuelve al catálogo o revisa tu carrito sin salir de tu cuenta.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate('/catalogo')}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        Seguir comprando
                      </button>
                      <button
                        onClick={() => navigate('/carrito')}
                        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        Ir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
    </div>
  )
}
