import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PrivateRoute from '../components/PrivateRoute'
import WhatsAppButton from '../components/WhatsAppButton'
import Home from '../pages/Home'
import Catalogo from '../pages/Catalogo'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import Dashboard from '../pages/Dashboard'
import Carrito from '../pages/Carrito'
import Favoritos from '../pages/Favoritos'
import ProductDetail from '../pages/ProductDetail'

export default function AppRouter() {
  return (
    <>
      <Routes>
        {/* Rutas con Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/catalogo"
          element={
            <>
              <Navbar />
              <Catalogo />
            </>
          }
        />
        <Route
          path="/producto/:id"
          element={
            <>
              <Navbar />
              <ProductDetail />
            </>
          }
        />
        <Route
          path="/carrito"
          element={
            <>
              <Navbar />
              <Carrito />
            </>
          }
        />
        <Route
          path="/favoritos"
          element={
            <PrivateRoute>
              <Navbar />
              <Favoritos />
            </PrivateRoute>
          }
        />

        {/* Auth (sin Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas privadas (sin Navbar, tienen sidebar propio) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsAppButton />
    </>
  )
}
