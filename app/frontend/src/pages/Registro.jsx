import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Heart, Lock, Mail, Sparkles, User } from 'lucide-react'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import conectaDecoLogo from '../assets/images/conecta-deco.png'

const REGISTER_BENEFITS = [
  {
    icon: Heart,
    title: 'Guarda tus favoritos',
    description: 'Ten tus fundas preferidas listas para volver a verlas cuando quieras.',
  },
  {
    icon: CheckCircle2,
    title: 'Sigue tus pedidos',
    description: 'Consulta compras, estados y entregas desde un solo lugar.',
  },
  {
    icon: Sparkles,
    title: 'Compra con más fluidez',
    description: 'Recupera tu contexto entre catálogo, carrito y cuenta personal.',
  },
]

export default function Registro() {
  const { registro } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmar) {
      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        confirmButtonColor: '#dc2626',
      })
      return
    }
    setLoading(true)
    try {
      await registro(form.nombre, form.email, form.password)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: err.response?.data?.message || 'No se pudo crear la cuenta.',
        confirmButtonColor: '#dc2626',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbf7fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-2%] h-72 w-72 rounded-full bg-red-200/35 blur-3xl" />
        <div className="absolute right-[-6%] top-[18%] h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[24%] h-72 w-72 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="w-full">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_16px_35px_-22px_rgba(15,23,42,0.28)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 hover:shadow-[0_18px_35px_-20px_rgba(239,68,68,0.25)]"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>

          <div className="grid overflow-hidden rounded-[34px] border border-white/70 bg-white/90 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.32)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
            <section className="relative hidden flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.14),_transparent_28%),linear-gradient(180deg,#fff7f7_0%,#fffdfb_100%)] px-6 py-8 sm:px-8 lg:flex lg:px-10 lg:py-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                  Nueva cuenta
                </div>

                <div className="mt-6 max-w-xl">
                  <img
                    src={conectaDecoLogo}
                    alt="ConectaDeco"
                    className="h-12 w-auto object-contain sm:h-14"
                  />
                  <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                    Crea tu cuenta y organiza tu experiencia.
                  </h1>
                  <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                    Guarda favoritos, sigue tus compras y compra con más continuidad dentro de ConectaDeco.
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  {REGISTER_BENEFITS.map((benefit) => {
                    const Icon = benefit.icon

                    return (
                      <div
                        key={benefit.title}
                        className="flex items-start gap-4 rounded-[24px] border border-white/80 bg-white/80 px-4 py-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.22)] backdrop-blur transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-slate-900">{benefit.title}</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-500">{benefit.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/80 bg-slate-900 px-5 py-5 text-white shadow-[0_28px_50px_-38px_rgba(15,23,42,0.85)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Ventaja de registro
                </p>
                <p className="mt-3 text-lg font-semibold">Tu cuenta centraliza favoritos, compras y seguimiento.</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  El registro te da continuidad entre descubrimiento, intención de compra y postventa.
                </p>
              </div>
            </section>

            <section className="flex items-center bg-white px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-6 flex justify-center lg:hidden">
                  <img
                    src={conectaDecoLogo}
                    alt="ConectaDeco"
                    className="h-11 w-auto object-contain"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-[0_24px_45px_-24px_rgba(239,68,68,0.72)] lg:mx-0">
                    <User size={22} />
                  </div>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                    Crea tu cuenta
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 lg:mx-0">
                    Completa tus datos para empezar.
                  </p>
                </div>

                <div className="mt-8 rounded-[28px] border border-stone-100 bg-[#fcfbf9] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)] sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="block space-y-2">
                      <span className="block text-sm font-semibold text-slate-700">Nombre completo</span>
                      <div className="flex h-12 items-center rounded-[18px] border border-stone-200 bg-white transition-all duration-200 focus-within:border-red-300 focus-within:shadow-[0_0_0_4px_rgba(254,226,226,0.85)]">
                        <span className="flex h-full w-12 shrink-0 items-center justify-center text-slate-400">
                          <User size={15} />
                        </span>
                        <input
                          type="text"
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          placeholder="Gustavo Pérez"
                          required
                          className="h-full w-full rounded-r-[18px] bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                          autoComplete="name"
                        />
                      </div>
                    </label>

                    <label className="block space-y-2">
                      <span className="block text-sm font-semibold text-slate-700">Correo electrónico</span>
                      <div className="flex h-12 items-center rounded-[18px] border border-stone-200 bg-white transition-all duration-200 focus-within:border-red-300 focus-within:shadow-[0_0_0_4px_rgba(254,226,226,0.85)]">
                        <span className="flex h-full w-12 shrink-0 items-center justify-center text-slate-400">
                          <Mail size={15} />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="gustavo@ejemplo.com"
                          required
                          className="h-full w-full rounded-r-[18px] bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                          autoComplete="email"
                        />
                      </div>
                    </label>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="block text-sm font-semibold text-slate-700">Contraseña</span>
                        <div className="flex h-12 items-center rounded-[18px] border border-stone-200 bg-white transition-all duration-200 focus-within:border-red-300 focus-within:shadow-[0_0_0_4px_rgba(254,226,226,0.85)]">
                          <span className="flex h-full w-12 shrink-0 items-center justify-center text-slate-400">
                            <Lock size={15} />
                          </span>
                          <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="h-full w-full rounded-r-[18px] bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            autoComplete="new-password"
                          />
                        </div>
                      </label>

                      <label className="block space-y-2">
                        <span className="block text-sm font-semibold text-slate-700">Confirmar</span>
                        <div className="flex h-12 items-center rounded-[18px] border border-stone-200 bg-white transition-all duration-200 focus-within:border-red-300 focus-within:shadow-[0_0_0_4px_rgba(254,226,226,0.85)]">
                          <span className="flex h-full w-12 shrink-0 items-center justify-center text-slate-400">
                            <Lock size={15} />
                          </span>
                          <input
                            type="password"
                            name="confirmar"
                            value={form.confirmar}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="h-full w-full rounded-r-[18px] bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            autoComplete="new-password"
                          />
                        </div>
                      </label>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-red-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_22px_40px_-24px_rgba(239,68,68,0.72)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 rounded-[22px] border border-stone-100 bg-[#fcfbf9] px-4 py-4 text-sm text-slate-500">
                  <p className="text-center leading-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-semibold text-red-600 transition-colors hover:text-red-700">
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
