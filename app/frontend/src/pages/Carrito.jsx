import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import Swal from 'sweetalert2'
import GuestCheckoutForm from '../components/GuestCheckoutForm'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

const ORDER_SELECTIONS_STORAGE_KEY = 'order_item_selections'

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

function writeOrderSelections(orderSelections) {
  localStorage.setItem(ORDER_SELECTIONS_STORAGE_KEY, JSON.stringify(orderSelections))
}

function persistOrderSelectionSnapshot(orderId, items) {
  if (!orderId || !Array.isArray(items) || items.length === 0) return

  const selections = readOrderSelections()
  selections[String(orderId)] = items.map((item) => ({
    product_id: item.productoId,
    nombre: item.producto?.nombre || null,
    variant: item.variant
      ? {
          label: item.variant.label || null,
          color: item.variant.color || null,
          modelLabel: item.variant.modelLabel || null,
        }
      : null,
    producto: item.producto
      ? {
          modelo: item.producto.modelo || null,
        }
      : null,
  }))
  writeOrderSelections(selections)
}

export default function Carrito() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { cart, loadingCart, updateCartItem, removeCartItem, refreshCart } = useShop()
  const [procesando, setProcesando] = useState(false)
  const [guestCheckoutState, setGuestCheckoutState] = useState({
    isValid: false,
    data: null,
  })
  const items = cart.items
  const subtotal = cart.subtotal
  const itemCountLabel = `${items.length} item${items.length > 1 ? 's' : ''}`

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
    if (!session && !guestCheckoutState.isValid) {
      await Swal.fire({
        icon: 'warning',
        title: 'Completa tus datos',
        text: 'Revisa el formulario de compra como invitado para continuar.',
        confirmButtonColor: '#dc2626',
      })
      return
    }

    setProcesando(true)

    try {
      if (!session) {
        const guestOrderId = `guest-${Date.now()}`

        persistOrderSelectionSnapshot(guestOrderId, items)

        await Swal.fire({
          icon: 'success',
          title: '¡Compra procesada!',
          text: `Tu pedido #${guestOrderId} fue confirmado correctamente.`,
          confirmButtonColor: '#dc2626',
        })

        await Promise.all(items.map((item) => removeCartItem(item.productoId)))
        await refreshCart()
        return
      }

      const payload = {
        items: items.map((item) => ({
          product_id: item.productoId,
          qty: item.cantidad,
        })),
      }

      const { data } = await api.post('/orders', payload)
      persistOrderSelectionSnapshot(data?.pedido?.id, items)

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 border-b border-red-100 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-700">Checkout</p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          {session ? 'Revisa tu carrito' : 'Finaliza tu compra'}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-stone-600">
          {session
            ? 'Confirma tus productos y procesa tu pedido desde un flujo limpio y directo.'
            : 'Estas comprando como invitado. Completa tus datos y termina el pedido sin crear una cuenta.'}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_24rem] lg:items-start">
        <div className="space-y-8">
          {!session ? (
            <GuestCheckoutForm onValidityChange={setGuestCheckoutState} />
          ) : (
            <section className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-[#fffdfb] to-[#f8f1ee] p-6 shadow-[0_20px_60px_rgba(127,29,29,0.06)] sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-stone-950">Tu pedido</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Revisa tus productos antes de confirmar la compra.
              </p>
            </section>
          )}

          <section className="rounded-[2rem] border border-stone-200 bg-white shadow-[0_16px_40px_rgba(28,25,23,0.05)]">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-stone-950">Items en tu carrito</h2>
                <p className="mt-1 text-sm text-stone-500">{itemCountLabel} seleccionado{items.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="divide-y divide-stone-200">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-5 sm:px-8">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                    {item.producto.imagen ? (
                      <img src={item.producto.imagen} alt={item.producto.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-stone-400">
                        Img
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">{item.producto.nombre}</p>
                        <p className="text-sm text-stone-500">
                          {item.variant?.modelLabel || item.producto.modelo || item.producto.categoria}
                        </p>
                        {item.variant?.label && (
                          <p className="text-sm text-stone-500">{item.variant.label}</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-stone-900">${item.subtotal.toLocaleString('es-CL')}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-1 shadow-inner">
                        <button
                          onClick={() => cambiarCantidad(item.productoId, item.cantidad, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm text-stone-900">{item.cantidad}</span>
                        <button
                          onClick={() => cambiarCantidad(item.productoId, item.cantidad, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => eliminar(item.productoId)}
                        className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-red-600"
                      >
                        <Trash2 size={14} />
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <section className="rounded-[2rem] border border-red-100 bg-gradient-to-b from-[#fffaf8] to-[#f6eee8] p-6 shadow-[0_22px_60px_rgba(127,29,29,0.12)] sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-red-100 pb-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-stone-950">Resumen del pedido</h2>
                <p className="mt-1 text-sm text-stone-500">{itemCountLabel}</p>
              </div>
              {!session && (
                <span className="rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-red-700">
                  Invitado
                </span>
              )}
            </div>

            <div className="space-y-4 py-6">
              {!session && (
                <div className="rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm leading-6 text-stone-600 shadow-[0_10px_24px_rgba(127,29,29,0.05)]">
                  <p className="font-medium text-red-700">Estas comprando como invitado</p>
                  <p className="mt-1">No necesitas crear cuenta para finalizar la compra.</p>
                </div>
              )}

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`summary-${item.id}`} className="flex items-start justify-between gap-4 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-stone-900">{item.producto.nombre}</p>
                      <p className="mt-1 text-stone-500">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="whitespace-nowrap font-medium text-stone-900">${item.subtotal.toLocaleString('es-CL')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-red-100 pt-5 text-sm">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="flex items-center justify-between pt-3 text-base font-semibold text-stone-950">
                <span>Total</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <button
                onClick={handleCompra}
                disabled={procesando || (!session && !guestCheckoutState.isValid)}
                className="w-full rounded-full bg-red-600 px-5 py-3.5 text-base font-medium text-white shadow-[0_16px_32px_rgba(220,38,38,0.28)] transition hover:bg-red-700 hover:shadow-[0_18px_36px_rgba(185,28,28,0.32)] disabled:cursor-not-allowed disabled:bg-red-300 disabled:shadow-none"
              >
                {procesando ? 'Procesando...' : 'Finalizar compra'}
              </button>

              {!session && (
                <button
                  onClick={() => navigate('/registro')}
                  className="w-full rounded-full border border-red-200 bg-white/80 px-5 py-3 text-sm font-medium text-red-700 transition hover:border-red-500 hover:text-red-800"
                >
                  Crear cuenta mas tarde
                </button>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
