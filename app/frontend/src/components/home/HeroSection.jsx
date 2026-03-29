import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../motion/Reveal'

const heroImage =
  'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=900&q=80'

export default function HeroSection() {
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)

  useEffect(() => {
    let animationFrameId = null

    const handleScroll = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      targetProgressRef.current = Math.min(window.scrollY / 320, 1)
    }

    const animate = () => {
      const nextProgress =
        currentProgressRef.current + (targetProgressRef.current - currentProgressRef.current) * 0.08

      currentProgressRef.current = nextProgress

      setScrollProgress((prev) => {
        if (Math.abs(prev - nextProgress) < 0.001) {
          return prev
        }

        return nextProgress
      })

      animationFrameId = window.requestAnimationFrame(animate)
    }

    handleScroll()
    animate()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  const heroTranslate = scrollProgress * -40
  const imageTranslate = scrollProgress * 30
  const textTranslate = scrollProgress * -14
  const textOpacity = 1 - scrollProgress * 0.15
  const glowTranslate = scrollProgress * 18

  return (
    <section className="section-shell overflow-hidden px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-12">
      <div
        className="hero-stage hero-gradient mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-5 shadow-[0_24px_60px_-35px_rgba(200,83,140,0.55)] sm:p-8 lg:p-10"
        style={{ transform: `translate3d(0, ${heroTranslate}px, 0)` }}
      >
        <div
          className="hero-float pointer-events-none absolute left-[10%] top-10 h-24 w-24 rounded-full bg-white/16 blur-2xl"
          style={{ transform: `translate3d(0, ${glowTranslate}px, 0)` }}
        />
        <div
          className="hero-float hero-float-delayed pointer-events-none absolute right-[9%] top-16 h-32 w-32 rounded-full bg-fuchsia-100/16 blur-3xl"
          style={{ transform: `translate3d(0, ${glowTranslate * 0.75}px, 0)` }}
        />
        <div
          className="hero-parallax pointer-events-none absolute left-1/2 top-8 h-48 w-48 rounded-full bg-white/18 blur-3xl"
          style={{ transform: `translate3d(-50%, ${glowTranslate}px, 0)` }}
        />
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div
            className="relative z-10 text-center lg:text-left"
            style={{
              transform: `translate3d(0, ${textTranslate}px, 0)`,
              opacity: textOpacity,
            }}
          >
            <Reveal
              as="p"
              trigger="load"
              duration={720}
              className="mb-4 inline-flex rounded-full bg-white/35 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose-50 backdrop-blur-sm hero-copy hero-kicker"
            >
              NUEVA COLECCION 2026
            </Reveal>
            <Reveal
              as="h1"
              trigger="load"
              duration={820}
              className="hero-copy hero-title font-sans text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              Florece tu estilo
            </Reveal>
            <Reveal
              as="p"
              trigger="load"
              delay={150}
              duration={780}
              className="hero-copy mt-5 text-sm font-normal leading-relaxed text-rose-50/90 sm:text-base lg:max-w-lg"
            >
              Eleva tu look con diseños florales premium para iPhone. Carcasas delicadas, resistentes y creadas para
              que tu esencia destaque.
            </Reveal>
            <Reveal
              trigger="load"
              delay={300}
              duration={840}
              className="hero-cta-bounce mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <button
                onClick={() => navigate('/catalogo')}
                className="ui-button hero-button-glow inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-rose-700 shadow-md shadow-rose-900/15 hover:bg-rose-50"
              >
                Ir a tienda <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="ui-button rounded-full border border-white/65 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                Personalizar
              </button>
            </Reveal>
          </div>

          <Reveal
            trigger="load"
            delay={180}
            duration={900}
            className="relative z-10 mx-auto w-full max-w-[460px] hero-image-reveal"
          >
            <div
              className="hero-parallax relative rounded-[1.75rem] bg-white/25 p-3 backdrop-blur-sm sm:p-4"
              style={{ transform: `translate3d(0, ${imageTranslate}px, 0)` }}
            >
              <div className="overflow-hidden rounded-[1.4rem] bg-white p-4 shadow-[0_20px_30px_-20px_rgba(0,0,0,0.45)] sm:p-5">
                <img
                  src={heroImage}
                  alt="Carcasa floral para iPhone"
                  className="h-[280px] w-full rounded-2xl object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.03] sm:h-[340px]"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl bg-white/90 px-4 py-3 shadow-lg shadow-rose-900/10 backdrop-blur">
                <p className="text-xs font-semibold text-rose-600">ConectaDeco Edition</p>
                <p className="text-xs text-slate-500">Ultra resistente, ligera y elegante.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            aria-label="Bajar a la siguiente sección"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight * 0.82,
                behavior: 'smooth',
              })
            }}
            className="hero-scroll-indicator ui-button flex flex-col items-center gap-2 text-white/85"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
              Descubrir
            </span>
            <span className="hero-scroll-line h-12 w-px bg-gradient-to-b from-white/90 to-white/0" />
          </button>
        </div>
      </div>
    </section>
  )
}
