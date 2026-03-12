import { Heart, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useShop } from '../context/ShopContext'

export default function Favoritos() {
  const navigate = useNavigate()
  const { favorites, loadingFavorites, addToCart, toggleFavorite } = useShop()

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
      await Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: 'Se agregó a tu carrito.',
        confirmButtonColor: '#dc2626',
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleRemoveFavorite = async (productId) => {
    try {
      await toggleFavorite(productId)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar favoritos',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  if (loadingFavorites) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-36 rounded-3xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Heart size={48} className="text-rose-300 mb-4" />
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Tus favoritos están vacíos</h2>
        <p className="text-stone-500 mb-6 max-w-md">
          Guarda fundas que te gusten para volver a ellas cuando quieras.
        </p>
        <button
          onClick={() => navigate('/catalogo')}
          className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Explorar catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-500">Edición guardada</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Favoritos seleccionados</h1>
        <p className="mt-2 text-sm text-stone-500">
          {favorites.length} diseño{favorites.length > 1 ? 's' : ''} reservado{favorites.length > 1 ? 's' : ''} para tu próxima compra.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((favorite) => (
          <article
            key={favorite.id}
            className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_60px_-30px_rgba(28,25,23,0.35)]"
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
                  <div className="flex h-full items-center justify-center text-xs text-stone-400">Sin imagen</div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-rose-500">
                  {favorite.producto.categoria}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-stone-900">
                  {favorite.producto.nombre}
                </h2>
                <p className="mt-1 text-sm text-stone-500">{favorite.producto.modelo}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-xl font-semibold text-stone-900">
                    ${favorite.producto.precio.toLocaleString('es-CL')}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Stock {favorite.producto.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-stone-100 px-4 py-4 sm:px-5">
              <button
                onClick={() => handleAddToCart(favorite.producto.id)}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                <ShoppingBag size={15} />
                Agregar al carrito
              </button>
              <button
                onClick={() => handleRemoveFavorite(favorite.producto.id)}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-rose-300 hover:text-rose-600"
              >
                Quitar de favoritos
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
