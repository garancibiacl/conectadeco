import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ productos: 0, pedidos: 0 })

  useEffect(() => {
    api.get('/productos?limit=1')
      .then(({ data }) => setStats((s) => ({ ...s, productos: data.total || 0 })))
      .catch(() => {})
  }, [])

  const esAdmin = session?.user?.role === 'admin'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-red-600 text-white font-bold text-xs px-1.5 py-0.5 rounded">CD</div>
          <span className="font-bold text-sm">ConectaDeco</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">Menú</span>
          <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-red-600/20 text-red-400 text-sm font-medium">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/catalogo" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/10 text-gray-300 text-sm transition-colors">
            <Package size={16} /> Productos
          </Link>
          <Link to="/carrito" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/10 text-gray-300 text-sm transition-colors">
            <ShoppingBag size={16} /> Mis Pedidos
          </Link>
          <Link to="/perfil" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/10 text-gray-300 text-sm transition-colors">
            <User size={16} /> Mi Perfil
          </Link>
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2.5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {esAdmin ? 'Admin Overview' : 'Mi Cuenta'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bienvenido/a, {session?.user?.nombre}. 👋
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Productos</p>
            <p className="text-3xl font-bold text-gray-900">{stats.productos}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mis Pedidos</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pedidos}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rol</p>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
              esAdmin ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {session?.user?.role || 'usuario'}
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-red-600 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
            >
              Ver catálogo
            </button>
            <button
              onClick={() => navigate('/carrito')}
              className="bg-gray-100 text-gray-700 text-sm px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Mi carrito
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
