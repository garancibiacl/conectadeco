import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const ShopContext = createContext(null)
const GUEST_CART_STORAGE_KEY = 'guest_cart'
const CART_VARIANTS_STORAGE_KEY = 'cart_variants'

function createAuthRequiredError() {
  const error = new Error('AUTH_REQUIRED')
  error.code = 'AUTH_REQUIRED'
  return error
}

function createResponseError(message) {
  const error = new Error(message)
  error.response = { data: { message } }
  return error
}

function readGuestCartEntries() {
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY)
    const parsed = JSON.parse(raw || '[]')

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((entry) => ({
        productId: Number(entry.productId),
        qty: Number(entry.qty),
      }))
      .filter((entry) => Number.isInteger(entry.productId) && entry.productId > 0 && Number.isInteger(entry.qty) && entry.qty > 0)
  } catch {
    return []
  }
}

function writeGuestCartEntries(entries) {
  localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(entries))
}

function resetGuestCartEntries() {
  localStorage.removeItem(GUEST_CART_STORAGE_KEY)
}

function readCartVariants() {
  try {
    const raw = localStorage.getItem(CART_VARIANTS_STORAGE_KEY)
    const parsed = JSON.parse(raw || '{}')

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return parsed
  } catch {
    return {}
  }
}

function writeCartVariants(variants) {
  localStorage.setItem(CART_VARIANTS_STORAGE_KEY, JSON.stringify(variants))
}

function setCartVariant(productId, variant) {
  if (!variant) return

  const variants = readCartVariants()
  variants[String(productId)] = {
    label: variant.label || null,
    color: variant.color || null,
    img: variant.img || variant.image || null,
  }
  writeCartVariants(variants)
}

function removeCartVariant(productId) {
  const variants = readCartVariants()
  delete variants[String(productId)]
  writeCartVariants(variants)
}

function applyStoredVariant(item, variantsByProductId) {
  const variant = variantsByProductId[String(item.productoId)]

  if (!variant) {
    return item
  }

  return {
    ...item,
    variant,
    producto: {
      ...item.producto,
      imagen: variant.img || item.producto.imagen,
    },
  }
}

function mapGuestCartItem(producto, cantidad) {
  return {
    id: `guest-${producto.id}`,
    productoId: producto.id,
    cantidad,
    agregadoEn: new Date().toISOString(),
    subtotal: Number(producto.precio) * cantidad,
    producto: {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      stock: producto.stock,
      categoria: producto.categoria,
      modelo: producto.modelo,
      imagen: producto.imagen,
    },
  }
}

function mapGuestCartItemWithVariant(producto, cantidad, variant) {
  const item = mapGuestCartItem(producto, cantidad)

  if (!variant) {
    return item
  }

  return applyStoredVariant(item, {
    [producto.id]: {
      label: variant.label || null,
      color: variant.color || null,
      img: variant.img || variant.image || null,
    },
  })
}

function buildCartState(items) {
  return {
    items,
    total: items.length,
    subtotal: items.reduce((sum, item) => sum + item.subtotal, 0),
  }
}

export function ShopProvider({ children }) {
  const { session } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0, subtotal: 0 })
  const [favorites, setFavorites] = useState([])
  const [loadingCart, setLoadingCart] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  const loadGuestCart = async () => {
    const entries = readGuestCartEntries()
    const variantsByProductId = readCartVariants()

    if (entries.length === 0) {
      setCart({ items: [], total: 0, subtotal: 0 })
      return
    }

    const settledProducts = await Promise.all(
      entries.map(async (entry) => {
        try {
          const { data } = await api.get(`/productos/${entry.productId}`)
          return { producto: data, qty: entry.qty }
        } catch {
          return null
        }
      })
    )

    const validEntries = []
    const items = []

    settledProducts.forEach((result) => {
      if (!result?.producto) {
        return
      }

      const availableQty = Math.min(result.qty, Math.max(result.producto.stock, 0))

      if (availableQty < 1) {
        return
      }

      validEntries.push({
        productId: result.producto.id,
        qty: availableQty,
      })
      items.push(applyStoredVariant(mapGuestCartItem(result.producto, availableQty), variantsByProductId))
    })

    if (validEntries.length > 0) {
      writeGuestCartEntries(validEntries)
    } else {
      resetGuestCartEntries()
    }

    setCart(buildCartState(items))
  }

  const syncGuestCartToServer = async () => {
    const entries = readGuestCartEntries()

    if (entries.length === 0 || !session?.token) {
      return
    }

    await Promise.allSettled(
      entries.map((entry) =>
        api.post('/cart', { product_id: entry.productId, qty: entry.qty })
      )
    )

    resetGuestCartEntries()
  }

  const refreshCart = async () => {
    if (!session?.token) {
      await loadGuestCart()
      return
    }

    setLoadingCart(true)
    try {
      const { data } = await api.get('/cart')
      const variantsByProductId = readCartVariants()
      setCart({
        items: (data.items || []).map((item) => applyStoredVariant(item, variantsByProductId)),
        total: data.total || 0,
        subtotal: data.subtotal || 0,
      })
    } finally {
      setLoadingCart(false)
    }
  }

  const refreshFavorites = async () => {
    if (!session?.token) {
      setFavorites([])
      return
    }

    setLoadingFavorites(true)
    try {
      const { data } = await api.get('/favorites')
      setFavorites(data.favoritos || [])
    } finally {
      setLoadingFavorites(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    if (!session?.token) {
      loadGuestCart().catch(() => {
        if (!cancelled) {
          setCart({ items: [], total: 0, subtotal: 0 })
        }
      })
      setFavorites([])
      return
    }

    ;(async () => {
      await syncGuestCartToServer()
      if (!cancelled) {
        await refreshCart().catch(() => {})
        await refreshFavorites().catch(() => {})
      }
    })()

    return () => {
      cancelled = true
    }
  }, [session?.token])

  const requireSession = () => {
    if (!session?.token) {
      throw createAuthRequiredError()
    }
  }

  const addToCart = async (productId, qty = 1, selectedVariant = null) => {
    if (selectedVariant) {
      setCartVariant(productId, selectedVariant)
    }

    if (session?.token) {
      const { data } = await api.post('/cart', { product_id: productId, qty })
      await refreshCart()
      return selectedVariant
        ? applyStoredVariant(data.item, {
            [productId]: {
              label: selectedVariant.label || null,
              color: selectedVariant.color || null,
              img: selectedVariant.img || selectedVariant.image || null,
            },
          })
        : data.item
    }

    const normalizedQty = Number(qty)
    const entries = readGuestCartEntries()
    const existing = entries.find((entry) => entry.productId === productId)
    const { data: producto } = await api.get(`/productos/${productId}`)
    const finalQty = (existing?.qty || 0) + normalizedQty

    if (producto.stock < finalQty) {
      throw createResponseError(`Stock insuficiente para ${producto.nombre}.`)
    }

    const nextEntries = existing
      ? entries.map((entry) =>
          entry.productId === productId ? { ...entry, qty: finalQty } : entry
        )
      : [...entries, { productId, qty: normalizedQty }]

    writeGuestCartEntries(nextEntries)
    await loadGuestCart()
    return mapGuestCartItemWithVariant(producto, finalQty, selectedVariant)
  }

  const updateCartItem = async (productId, qty) => {
    if (session?.token) {
      const { data } = await api.put(`/cart/${productId}`, { qty })
      await refreshCart()
      return data.item
    }

    const normalizedQty = Number(qty)
    const entries = readGuestCartEntries()
    const currentEntry = entries.find((entry) => entry.productId === productId)

    if (!currentEntry) {
      throw createResponseError('Producto no encontrado en el carrito.')
    }

    const { data: producto } = await api.get(`/productos/${productId}`)

    if (producto.stock < normalizedQty) {
      throw createResponseError(`Stock insuficiente para ${producto.nombre}.`)
    }

    writeGuestCartEntries(
      entries.map((entry) =>
        entry.productId === productId ? { ...entry, qty: normalizedQty } : entry
      )
    )

    await loadGuestCart()
    return mapGuestCartItem(producto, normalizedQty)
  }

  const removeCartItem = async (productId) => {
    if (session?.token) {
      await api.delete(`/cart/${productId}`)
      removeCartVariant(productId)
      await refreshCart()
      return
    }

    const entries = readGuestCartEntries()
    const nextEntries = entries.filter((entry) => entry.productId !== productId)

    if (nextEntries.length === entries.length) {
      throw createResponseError('Producto no encontrado en el carrito.')
    }

    if (nextEntries.length > 0) {
      writeGuestCartEntries(nextEntries)
    } else {
      resetGuestCartEntries()
    }

    removeCartVariant(productId)
    await loadGuestCart()
  }

  const isFavorite = (productId) =>
    favorites.some((favorite) => favorite.productoId === productId)

  const toggleFavorite = async (productId) => {
    requireSession()
    if (isFavorite(productId)) {
      await api.delete(`/favorites/${productId}`)
    } else {
      await api.post(`/favorites/${productId}`)
    }
    await refreshFavorites()
  }

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        loadingCart,
        loadingFavorites,
        refreshCart,
        refreshFavorites,
        addToCart,
        updateCartItem,
        removeCartItem,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => useContext(ShopContext)
