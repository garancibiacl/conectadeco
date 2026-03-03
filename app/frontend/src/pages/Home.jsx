import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import api from '../services/api'

export default function Home() {
  const navigate = useNavigate()
  const [destacados, setDestacados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/productos?limit=4')
      .then(({ data }) => setDestacados(data.productos || data))
      .catch(() => setDestacados([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Carcasas únicas: diseño floral<br />
            <span className="text-red-400">y protección real</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Fundas premium para iPhone con diseños exclusivos. Expresa tu estilo y protege lo que importa.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              Ver catálogo <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="border border-white/30 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              Crear cuenta gratis
            </button>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Colecciones Destacadas</h2>
          <button
            onClick={() => navigate('/catalogo')}
            className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-1"
          >
            Ver todo <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : destacados.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destacados.map((p) => <ProductCard key={p.id} producto={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>Conecta el backend para ver productos.</p>
            <button onClick={() => navigate('/catalogo')} className="mt-3 text-red-600 text-sm font-medium">
              Ir al catálogo
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-red-50 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Únete a nuestra comunidad</h2>
        <p className="text-gray-500 mb-6">Miles de clientes ya protegen su iPhone con estilo.</p>
        <button
          onClick={() => navigate('/registro')}
          className="bg-red-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Registrarme ahora
        </button>
      </section>
    </div>
  )
}
