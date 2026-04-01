import { useEffect, useState } from 'react'
import api from '../services/api'

export function usePedidos() {
  const [pedidos, setPedidos] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/orders/me')
      .then(({ data }) => {
        setPedidos(data.pedidos || [])
        setTotal(data.total || 0)
      })
      .catch(() => setError('No se pudieron cargar los pedidos.'))
      .finally(() => setLoading(false))
  }, [])

  return { pedidos, total, loading, error }
}
