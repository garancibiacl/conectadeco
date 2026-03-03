import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import api from '../services/api'

const CATEGORIAS = ['Todas', 'iPhone 15', 'iPhone 14', 'iPhone 13']

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  useEffect(() => {
    api.get('/productos')
      .then(({ data }) => setProductos(data.productos || data))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = productos.filter((p) => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const matchCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva
    return matchBusqueda && matchCategoria
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Colección 2026</h1>
      <p className="text-gray-500 mb-8">Encuentra la funda perfecta para tu iPhone.</p>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar fundas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoriaActiva === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filtrados.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtrados.map((p) => <ProductCard key={p.id} producto={p} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No se encontraron productos.</p>
          <button onClick={() => { setBusqueda(''); setCategoriaActiva('Todas') }} className="mt-3 text-red-600 text-sm">
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
