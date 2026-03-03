import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import HeroSection from '../components/home/HeroSection'
import FeaturedSection from '../components/home/FeaturedSection'
import PromoBanner from '../components/home/PromoBanner'

const mockFeaturedProducts = [
  {
    id: 101,
    nombre: 'Wild Roses Blush',
    precio: 24990,
    imagen:
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80',
    categoria: 'Rosas',
    stock: 12,
  },
  {
    id: 102,
    nombre: 'Spring Blossom Case',
    precio: 22990,
    imagen:
      'https://images.unsplash.com/photo-1560693135-581d2e8c5e4f?auto=format&fit=crop&w=900&q=80',
    categoria: 'Primavera',
    stock: 18,
  },
  {
    id: 103,
    nombre: 'Midnight Orchid',
    precio: 26990,
    imagen:
      'https://images.unsplash.com/photo-1551542159-1e0b48d387f6?auto=format&fit=crop&w=900&q=80',
    categoria: 'Premium',
    stock: 9,
  },
  {
    id: 104,
    nombre: 'Golden Sunflower',
    precio: 24990,
    imagen:
      'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=900&q=80',
    categoria: 'Summer',
    stock: 14,
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockFeaturedProducts)
      setLoadingProducts(false)
    }, 450)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#faf8fb] font-sans text-slate-800">
      <HeroSection />

      <FeaturedSection />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-800">Top Carcasas</h2>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">
              Diseños que están marcando tendencia esta semana.
            </p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-[330px] animate-pulse rounded-3xl bg-gradient-to-br from-rose-100 to-rose-50"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} producto={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/catalogo')}
              className="rounded-full border border-rose-200 bg-white px-6 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              Ver catálogo completo
            </button>
          </div>
        </div>
      </section>

      <PromoBanner />

      <footer className="border-t border-rose-100 bg-[#f7f4f9] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-rose-600">ConectaDeco</h3>
            <p className="mt-3 text-sm font-normal leading-relaxed text-slate-500">
              Carcasas premium para iPhone con estilo floral y protección real para tu día a día.
            </p>
            <div className="mt-4 flex items-center gap-3 text-slate-500">
              <a href="#" className="transition-colors hover:text-rose-500" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="transition-colors hover:text-rose-500" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="transition-colors hover:text-rose-500" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Tienda</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-rose-500">Nuevas colecciones</a></li>
              <li><a href="#" className="hover:text-rose-500">Más vendidos</a></li>
              <li><a href="#" className="hover:text-rose-500">Ofertas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Soporte</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-rose-500">Envíos y entregas</a></li>
              <li><a href="#" className="hover:text-rose-500">Cambios y devoluciones</a></li>
              <li><a href="#" className="hover:text-rose-500">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-rose-500">Términos de servicio</a></li>
              <li><a href="#" className="hover:text-rose-500">Privacidad</a></li>
              <li><a href="#" className="hover:text-rose-500">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-rose-100 pt-5 text-center text-xs text-slate-400">
          © 2026 ConectaDeco. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
