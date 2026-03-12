import { ShoppingCart, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useShop } from '../context/ShopContext'

export default function ProductCard({ producto }) {
  const navigate = useNavigate()
  const { id, nombre, precio, imagen, categoria, stock } = producto
  const { addToCart, toggleFavorite, isFavorite } = useShop()
  const favoritoActivo = isFavorite(id)

  const handleAddToCart = async () => {
    try {
      await addToCart(id, 1)
      await Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${nombre} se agregó a tu carrito.`,
        confirmButtonColor: '#dc2626',
      })
    } catch (err) {
      if (err.code === 'AUTH_REQUIRED') {
        navigate('/login')
        return
      }

      Swal.fire({
        icon: 'error',
        title: 'No se pudo agregar',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(id)
    } catch (err) {
      if (err.code === 'AUTH_REQUIRED') {
        navigate('/login')
        return
      }

      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar favoritos',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Imagen */}
      <div
        className="relative h-48 bg-gray-50 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/producto/${id}`)}
      >
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin imagen</div>
        )}
        {stock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
            Sin stock
          </span>
        )}
        <button
          onClick={(event) => {
            event.stopPropagation()
            handleToggleFavorite()
          }}
          className={`absolute top-2 right-2 rounded-full p-1.5 shadow transition-all ${
            favoritoActivo
              ? 'bg-rose-500 text-white opacity-100'
              : 'bg-white text-stone-500 hover:text-red-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        {categoria && (
          <span className="text-xs font-medium text-red-600 uppercase tracking-wide">{categoria}</span>
        )}
        <h3
          className="text-sm font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
          onClick={() => navigate(`/producto/${id}`)}
        >
          {nombre}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            ${Number(precio).toLocaleString('es-CL')}
          </span>
          <button
            disabled={stock === 0}
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={13} /> Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
