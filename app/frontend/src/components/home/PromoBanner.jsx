import { useNavigate } from 'react-router-dom'
import communityBg from '../../assets/images/img-1.png'
import Reveal from '../motion/Reveal'

export default function PromoBanner() {
  const navigate = useNavigate()

  return (
    <Reveal as="section" className="section-shell px-4 py-14 sm:px-6 lg:px-8">
      <Reveal
        className="mx-auto max-w-5xl rounded-2xl bg-[length:82%_auto] bg-center bg-no-repeat shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)] sm:bg-[length:72%_auto]"
        duration={760}
        style={{ backgroundImage: `url(${communityBg})` }}
      >
        <Reveal as="div" stagger className="rounded-2xl bg-[#26292f]/85 px-5 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Únete a nuestra comunidad
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white sm:text-base">
            Recibe novedades, ofertas exclusivas y lanzamientos florales antes que nadie.
          </p>

          <form className="mx-auto mt-7 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="h-12 w-full rounded-full border border-[rgba(255,255,255,0.20)] bg-[rgba(255,255,255,0.12)] px-5 text-sm text-white placeholder:text-white/70 transition-colors duration-300 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                navigate('/registro')
              }}
              className="ui-button h-12 rounded-full bg-gradient-to-r from-[#E1062C] to-[#FF4D6D] px-7 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#2D3436]"
            >
              Suscribirme
            </button>
          </form>
        </Reveal>
      </Reveal>
    </Reveal>
  )
}
