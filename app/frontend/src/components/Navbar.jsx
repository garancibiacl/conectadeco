import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-red-600 text-white font-bold text-sm px-2 py-1 rounded">CD</div>
          <span className="font-bold text-gray-900 text-lg">ConectaDeco</span>
        </Link>

        {/* Nav links desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-red-600 transition-colors">Inicio</Link>
          <Link to="/catalogo" className="hover:text-red-600 transition-colors">Catálogo</Link>
          <Link to="/carrito" className="hover:text-red-600 transition-colors flex items-center gap-1">
            <ShoppingCart size={16} /> Carrito
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <User size={16} /> {session.user?.nombre || 'Mi cuenta'}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-red-600">Inicio</Link>
          <Link to="/catalogo" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-red-600">Catálogo</Link>
          <Link to="/carrito" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-red-600">Carrito</Link>
          {session ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-red-600">Mi cuenta</Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="text-left text-red-600">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-red-600">Ingresar</Link>
              <Link to="/registro" onClick={() => setMenuOpen(false)} className="text-red-600 font-medium">Crear cuenta</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
