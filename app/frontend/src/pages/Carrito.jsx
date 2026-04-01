import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

export default function Carrito() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { cart, loadingCart, updateCartItem, removeCartItem, refreshCart } = useShop()
  const [procesando, setProcesando] = useState(false)
  const items = cart.items
  const subtotal = cart.subtotal

  const eliminar = async (productId) => {
    try {
      await removeCartItem(productId)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const cambiarCantidad = async (productId, cantidadActual, delta) => {
    const nuevaCantidad = Math.max(1, cantidadActual + delta)

    try {
      await updateCartItem(productId, nuevaCantidad)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar la cantidad',
        text: err.response?.data?.message || 'Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleCompra = async () => {
    setProcesando(true)

    try {
      const payload = {
        items: items.map((item) => ({
          product_id: item.productoId,
          qty: item.cantidad,
        })),
      }

      const { data } = await api.post('/orders', payload)

      await Swal.fire({
        icon: 'success',
        title: '¡Compra procesada!',
        text: `Tu pedido #${data.pedido.id} fue confirmado correctamente.`,
        confirmButtonColor: '#dc2626',
      })

      await Promise.all(items.map((item) => removeCartItem(item.productoId)))
      await refreshCart()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo procesar la compra',
        text: err.response?.data?.message || 'Intenta nuevamente en unos minutos.',
        confirmButtonColor: '#dc2626',
      })
    } finally {
      setProcesando(false)
    }
  }

  if (loadingCart) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-stone-100 animate-pulse" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Agrega productos desde el catálogo.</p>
        <button
          onClick={() => navigate('/catalogo')}
          className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors"
        >
          Ver catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu Carrito</h1>
      <p className="text-gray-500 text-sm mb-8">{items.length} item{items.length > 1 ? 's' : ''} seleccionado{items.length > 1 ? 's' : ''}</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-gray-300 text-xs">
                {item.producto.imagen ? <img src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-cover rounded-lg" /> : 'IMG'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.producto.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.variant?.label || item.producto.modelo || item.producto.categoria}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => cambiarCantidad(item.productoId, item.cantidad, -1)} className="w-6 h-6 rounded border border-gray-200 text-sm flex items-center justify-center hover:bg-gray-50">-</button>
                  <span className="text-sm w-4 text-center">{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.productoId, item.cantidad, 1)} className="w-6 h-6 rounded border border-gray-200 text-sm flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-gray-900">${item.subtotal.toLocaleString('es-CL')}</p>
                <button onClick={() => eliminar(item.productoId)} className="mt-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen total</h2>
            <div className="space-y-2 text-sm mb-4">
              {!session && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-left text-xs leading-5 text-emerald-800">
                  Estás comprando como invitado. Puedes finalizar ahora o crear una cuenta más tarde para futuras compras.
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
            </div>
            <button
              onClick={handleCompra}
              disabled={procesando}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              {procesando ? 'Procesando...' : session ? 'Procesar compra' : 'Comprar como invitado'}
            </button>
            {!session && (
              <button
                onClick={() => navigate('/registro')}
                className="mt-3 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:text-red-600"
              >
                Crear cuenta y guardar historial
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
