import { AlertCircle, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProductDetailCard from '../components/ProductDetailCard'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'
import api from '../services/api'

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function getProductFamily(producto, products) {
  if (!producto) return []

  const productCategory = normalizeText(producto.categoria)
  const family = products.filter(
    (item) => normalizeText(item.categoria) === productCategory,
  )

  return family
    .filter((item, index, items) => items.findIndex((entry) => entry.id === item.id) === index)
    .sort((a, b) => String(a.modelo || a.nombre).localeCompare(String(b.modelo || b.nombre), 'es'))
}

function buildModelOptions(producto, family) {
  const source = family.length > 0 ? family : [producto]

  return source.map((item) => ({
    id: item.id,
    label: item.modelo || item.nombre,
    active: item.id === producto.id,
    available: item.stock > 0,
  }))
}

function RelatedProductCard({ producto }) {
  return (
    <Link
      to={`/producto/${producto.id}`}
      className="group overflow-hidden rounded-[26px] border border-stone-100 bg-white p-3 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_30px_55px_-35px_rgba(15,23,42,0.28)]"
    >
      <div className="overflow-hidden rounded-[22px] bg-[#f7f4f1]">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-52 items-center justify-center text-sm text-stone-400">Sin imagen</div>
        )}
      </div>
      <div className="px-1 pb-1 pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{producto.categoria}</p>
        <h3 className="mt-2 text-base font-semibold text-stone-900">{producto.nombre}</h3>
        <p className="mt-1 text-sm text-stone-400">{producto.modelo || 'Edición premium'}</p>
        <p className="mt-3 text-lg font-semibold text-red-500">
          ${Number(producto.precio).toLocaleString('es-CL')}
        </p>
      </div>
    </Link>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const { addToCart, toggleFavorite, isFavorite } = useShop()
  const [producto, setProducto] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [availableModels, setAvailableModels] = useState([])

  useEffect(() => {
    let cancelled = false

    const fetchProducto = async () => {
      setLoading(true)
      setError('')

      try {
        const { data } = await api.get(`/productos/${id}`)
        if (!cancelled) {
          setProducto(data)
          setQuantity(1)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'No se pudo cargar el producto.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducto()

    api.get('/productos')
      .then(({ data }) => {
        if (!cancelled) {
          const items = data.productos || []
          const currentProductId = Number(id)
          const currentProduct =
            items.find((item) => item.id === currentProductId) || null
          const family = getProductFamily(currentProduct, items)

          if (currentProduct) {
            setAvailableModels(buildModelOptions(currentProduct, family))
          } else {
            setAvailableModels([])
          }

          const familyIds = new Set(family.map((item) => item.id))
          setRelatedProducts(
            items
              .filter((item) => item.id !== currentProductId && !familyIds.has(item.id))
              .slice(0, 4),
          )
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableModels([])
          setRelatedProducts([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleAddToCart = async (selectedVariant) => {
    if (!producto) return

    const availableStock = selectedVariant?.stock ?? producto.stock
    const variantName = selectedVariant?.label || selectedVariant?.color
    const variantLabel = variantName ? ` (${variantName})` : ''

    if (quantity > availableStock) {
      await Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: 'La variante seleccionada no tiene suficiente stock.',
        confirmButtonColor: '#dc2626',
      })
      return
    }

    setSubmitting(true)
    try {
      if (!session) {
        const result = await Swal.fire({
          icon: 'question',
          title: 'Compra rápida o crea tu cuenta',
          text: 'Puedes seguir como invitado o registrarte para guardar tu carrito e historial.',
          confirmButtonText: 'Crear cuenta',
          denyButtonText: 'Continuar como invitado',
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#dc2626',
          denyButtonColor: '#1f2937',
          cancelButtonColor: '#d6d3d1',
        })

        if (result.isConfirmed) {
          navigate('/registro')
          return
        }

        if (!result.isDenied) {
          return
        }
      }

      await addToCart(producto.id, quantity, selectedVariant)
      await Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${producto.nombre}${variantLabel} se agregó a tu carrito.`,
        confirmButtonColor: '#dc2626',
      })
    } catch (err) {
      if (err.code === 'AUTH_REQUIRED') {
        navigate('/login')
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBuyNow = async (selectedVariant) => {
    if (!producto) return

    const availableStock = selectedVariant?.stock ?? producto.stock

    if (quantity > availableStock) {
      await Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: 'La variante seleccionada no tiene suficiente stock.',
        confirmButtonColor: '#dc2626',
      })
      return
    }

    setSubmitting(true)
    try {
      if (!session) {
        const result = await Swal.fire({
          icon: 'question',
          title: 'Comprar sin registro',
          text: 'Puedes continuar como invitado o crear tu cuenta para guardar tu historial.',
          confirmButtonText: 'Crear cuenta',
          denyButtonText: 'Seguir como invitado',
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#dc2626',
          denyButtonColor: '#1f2937',
          cancelButtonColor: '#d6d3d1',
        })

        if (result.isConfirmed) {
          navigate('/registro')
          return
        }

        if (!result.isDenied) {
          return
        }
      }

      await addToCart(producto.id, quantity, selectedVariant)
      navigate('/carrito')
    } catch (err) {
      if (err.code === 'AUTH_REQUIRED') {
        navigate('/login')
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'No se pudo continuar',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!producto) return

    try {
      const wasFavorite = isFavorite(producto.id)
      await toggleFavorite(producto.id)
      await Swal.fire({
        icon: 'success',
        title: wasFavorite ? 'Eliminado de favoritos' : 'Guardado en favoritos',
        text: wasFavorite
          ? `${producto.nombre} se quitó de tu lista.`
          : `${producto.nombre} quedó guardado para revisarlo después.`,
        confirmButtonColor: '#dc2626',
      })
    } catch (err) {
      if (err.code === 'AUTH_REQUIRED') {
        const result = await Swal.fire({
          icon: 'info',
          title: 'Crea tu cuenta para guardar favoritos',
          text: 'Regístrate o inicia sesión para guardar productos y revisarlos después.',
          confirmButtonText: 'Registrarme',
          showCancelButton: true,
          cancelButtonText: 'Más tarde',
          confirmButtonColor: '#dc2626',
          cancelButtonColor: '#d6d3d1',
        })

        if (result.isConfirmed) {
          navigate('/registro')
        }

        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar favoritos',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleDecreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const handleIncreaseQuantity = (maxStock = producto?.stock ?? 0) => {
    if (!producto) return
    setQuantity((current) => Math.min(maxStock, current + 1))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 h-4 w-56 animate-pulse rounded-full bg-stone-100" />
        <div className="overflow-hidden rounded-[32px] border border-stone-100 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="h-[420px] animate-pulse bg-stone-100" />
            <div className="space-y-4 p-8">
              <div className="h-4 w-28 animate-pulse rounded-full bg-stone-100" />
              <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-stone-100" />
              <div className="h-14 w-1/2 animate-pulse rounded-2xl bg-stone-100" />
              <div className="h-32 animate-pulse rounded-[24px] bg-stone-100" />
              <div className="h-14 animate-pulse rounded-2xl bg-stone-100" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <AlertCircle size={28} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-stone-900">No pudimos cargar este producto</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
          {error || 'El producto no está disponible en este momento.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate('/catalogo')}
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Volver al catálogo
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#fcfbf9]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-400 sm:text-sm">
          <Link to="/" className="transition-colors hover:text-red-500">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo" className="transition-colors hover:text-red-500">Phone Cases</Link>
          <span>/</span>
          <span className="text-stone-600">{producto.nombre}</span>
        </nav>

        <ProductDetailCard
          producto={producto}
          modelOptions={availableModels}
          loadingAction={submitting}
          favoriteActive={isFavorite(producto.id)}
          quantity={quantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onIncreaseQuantity={handleIncreaseQuantity}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleFavorite={handleToggleFavorite}
        />

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Quizás te guste</h2>
              <p className="mt-2 text-sm text-stone-500">
                Completa tu estilo con accesorios premium seleccionados.
              </p>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
            >
              Ver todo
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <RelatedProductCard key={item.id} producto={item} />
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-16 border-t border-stone-100 bg-[#f5f7fb]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link to="/" className="text-lg font-bold text-red-500">ConectaDeco.</Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-stone-500">
              Accesorios con estética premium para dispositivos Apple. Diseño y protección en un solo lugar.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">Tienda</h3>
            <ul className="mt-4 space-y-2 text-sm text-stone-500">
              <li><Link to="/catalogo" className="hover:text-red-500">Phone Cases</Link></li>
              <li><Link to="/catalogo" className="hover:text-red-500">Cargadores</Link></li>
              <li><Link to="/catalogo" className="hover:text-red-500">Accesorios</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">Ayuda</h3>
            <ul className="mt-4 space-y-2 text-sm text-stone-500">
              <li><Link to="/catalogo" className="hover:text-red-500">Seguimiento</Link></li>
              <li><Link to="/catalogo" className="hover:text-red-500">Devoluciones</Link></li>
              <li><Link to="/catalogo" className="hover:text-red-500">Preguntas frecuentes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">Newsletter</h3>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Recibe lanzamientos y descuentos en tu primera compra.
            </p>
            <div className="mt-4 flex overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 text-sm text-stone-700 outline-none placeholder:text-stone-400"
              />
              <button type="button" className="bg-red-500 px-4 text-sm font-semibold text-white">
                →
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
