const categories = [
  {
    id: 'peonias',
    title: 'Colección Peonías',
    subtitle: 'Suavidad romántica',
    image:
      'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'tropical',
    title: 'Vibras Tropicales',
    subtitle: 'Energía natural',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'minimal',
    title: 'Minimal Flora',
    subtitle: 'Estilo delicado',
    image:
      'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=900&q=80',
  },
]

export default function FeaturedSection() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Colecciones Destacadas</h2>
          <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">
            Inspiración botánica para cada personalidad.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-[1.4rem] bg-white shadow-[0_12px_28px_-22px_rgba(30,41,59,0.7)]"
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
                <button className="mt-4 rounded-full border border-white/70 px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-white hover:text-slate-800">
                  Ver colección
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
