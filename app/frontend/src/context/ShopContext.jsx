import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const ShopContext = createContext(null)

function createAuthRequiredError() {
  const error = new Error('AUTH_REQUIRED')
  error.code = 'AUTH_REQUIRED'
  return error
}

export function ShopProvider({ children }) {
  const { session } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0, subtotal: 0 })
  const [favorites, setFavorites] = useState([])
  const [loadingCart, setLoadingCart] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  const resetShopState = () => {
    setCart({ items: [], total: 0, subtotal: 0 })
    setFavorites([])
  }

  const refreshCart = async () => {
    if (!session?.token) {
      resetShopState()
      return
    }

    setLoadingCart(true)
    try {
      const { data } = await api.get('/cart')
      setCart({
        items: data.items || [],
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
    if (!session?.token) {
      resetShopState()
      return
    }

    refreshCart().catch(() => {})
    refreshFavorites().catch(() => {})
  }, [session?.token])

  const requireSession = () => {
    if (!session?.token) {
      throw createAuthRequiredError()
    }
  }

  const addToCart = async (productId, qty = 1) => {
    requireSession()
    const { data } = await api.post('/cart', { product_id: productId, qty })
    await refreshCart()
    return data.item
  }

  const updateCartItem = async (productId, qty) => {
    requireSession()
    const { data } = await api.put(`/cart/${productId}`, { qty })
    await refreshCart()
    return data.item
  }

  const removeCartItem = async (productId) => {
    requireSession()
    await api.delete(`/cart/${productId}`)
    await refreshCart()
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
