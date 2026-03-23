import { useEffect, useState } from 'react'
import api from '../services/api'

export function useProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/productos')
      .then(({ data }) => setProductos(data.productos || data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  return { productos, loading, error }
}
