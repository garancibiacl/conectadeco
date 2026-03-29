import coleccion1 from '../../assets/images/coleccion-1.png'
import coleccion2 from '../../assets/images/coleccion-2.png'
import coleccion3 from '../../assets/images/coleccion-3.png'
import Reveal from '../motion/Reveal'

const categories = [
  {
    id: 'peonias',
    title: 'Colección Peonías',
    subtitle: 'Suavidad y elegancia sutil',
    image: coleccion1,
  },
  {
    id: 'tropical',
    title: 'Vibras Tropicales',
    subtitle: 'Energía para tus días',
    image: coleccion2,
  },
  {
    id: 'minimal',
    title: 'Minimal Flora',
    subtitle: 'Sutileza en cada trazo',
    image: coleccion3,
  },
]

export default function FeaturedSection() {
  return (
    <Reveal as="section" className="section-shell px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-7" duration={680} stagger>
          <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Colecciones Destacadas</h2>
          <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">
            Inspiración botánica para cada personalidad.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((item, index) => (
            <Reveal
              as="article"
              key={item.id}
              variant="card"
              delay={index * 110}
              className="interactive-card group relative overflow-hidden rounded-[1.4rem] bg-white shadow-[0_12px_28px_-22px_rgba(30,41,59,0.7)]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/25 to-transparent" />
              <div className="absolute bottom-0 w-full p-5 text-white">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm font-normal leading-relaxed text-white/85">{item.subtitle}</p>
                <button className="ui-button mt-4 text-xs font-semibold transition-colors hover:text-white/80">
                  Ver colección →
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
