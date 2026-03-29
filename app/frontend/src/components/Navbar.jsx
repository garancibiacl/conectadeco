import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'
import conectaDecoLogo from '../assets/images/conecta-deco.png'

export default function Navbar() {
  const { session, logout } = useAuth()
  const { cart, favorites } = useShop()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/88 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="ui-button flex items-center">
          <img
            src={conectaDecoLogo}
            alt="ConectaDeco"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        {/* Nav links desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="ui-button hover:text-red-600 transition-colors">Inicio</Link>
          <Link to="/catalogo" className="ui-button hover:text-red-600 transition-colors">Catálogo</Link>
          {session && (
            <Link to="/favoritos" className="ui-button flex items-center gap-1 hover:text-red-600 transition-colors">
              <Heart size={16} /> Favoritos
              {favorites.length > 0 && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                  {favorites.length}
                </span>
              )}
            </Link>
          )}
          <Link to="/carrito" className="ui-button flex items-center gap-1 hover:text-red-600 transition-colors">
            <ShoppingCart size={16} /> Carrito
            {cart.total > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                {cart.total}
              </span>
            )}
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="ui-button flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <User size={16} /> {session.user?.nombre || 'Mi cuenta'}
              </button>
              <button
                onClick={logout}
                className="ui-button flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ui-button text-sm text-gray-600 hover:text-red-600 transition-colors">
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="ui-button rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="ui-button md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="ui-button text-gray-700 hover:text-red-600">Inicio</Link>
          <Link to="/catalogo" onClick={() => setMenuOpen(false)} className="ui-button text-gray-700 hover:text-red-600">Catálogo</Link>
          {session && <Link to="/favoritos" onClick={() => setMenuOpen(false)} className="ui-button text-gray-700 hover:text-red-600">Favoritos</Link>}
          <Link to="/carrito" onClick={() => setMenuOpen(false)} className="ui-button text-gray-700 hover:text-red-600">Carrito</Link>
          {session ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="ui-button text-gray-700 hover:text-red-600">Mi cuenta</Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="ui-button text-left text-red-600">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="ui-button text-gray-700 hover:text-red-600">Ingresar</Link>
              <Link to="/registro" onClick={() => setMenuOpen(false)} className="ui-button font-medium text-red-600">Crear cuenta</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
