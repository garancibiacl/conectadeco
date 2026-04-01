import { useEffect, useMemo, useState } from 'react'

const GUEST_CHECKOUT_STORAGE_KEY = 'guest_checkout_data'

const INITIAL_FORM = {
  email: '',
  nombre: '',
  direccion: '',
  ciudad: '',
  estado: '',
  codigoPostal: '',
  pais: '',
}

const FIELD_ORDER = ['email', 'nombre', 'direccion', 'ciudad', 'estado', 'codigoPostal', 'pais']

function readGuestCheckoutData() {
  try {
    const raw = localStorage.getItem(GUEST_CHECKOUT_STORAGE_KEY)
    const parsed = JSON.parse(raw || '{}')

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return INITIAL_FORM
    }

    return {
      email: String(parsed.email || ''),
      nombre: String(parsed.nombre || ''),
      direccion: String(parsed.direccion || ''),
      ciudad: String(parsed.ciudad || ''),
      estado: String(parsed.estado || parsed.provincia || ''),
      codigoPostal: String(parsed.codigoPostal || parsed.zip || ''),
      pais: String(parsed.pais || ''),
    }
  } catch {
    return INITIAL_FORM
  }
}

function validateField(name, value) {
  const trimmedValue = value.trim()

  switch (name) {
    case 'email':
      if (!trimmedValue) return 'Ingresa tu email.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Ingresa un email valido.'
      return ''
    case 'nombre':
      if (!trimmedValue) return 'Ingresa tu nombre completo.'
      if (trimmedValue.length < 3) return 'Usa al menos 3 caracteres.'
      return ''
    case 'direccion':
      if (!trimmedValue) return 'Ingresa tu direccion.'
      if (trimmedValue.length < 8) return 'Agrega una direccion mas completa.'
      return ''
    case 'ciudad':
      if (!trimmedValue) return 'Ingresa tu ciudad.'
      return ''
    case 'estado':
      if (!trimmedValue) return 'Ingresa tu estado o provincia.'
      return ''
    case 'codigoPostal':
      if (!trimmedValue) return 'Ingresa tu codigo postal.'
      if (trimmedValue.length < 3) return 'Ingresa un codigo postal valido.'
      return ''
    case 'pais':
      if (!trimmedValue) return 'Ingresa tu pais.'
      return ''
    default:
      return ''
  }
}

function buildErrors(form) {
  return FIELD_ORDER.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = validateField(fieldName, form[fieldName])
    return accumulator
  }, {})
}

function getFieldClasses(hasError) {
  return [
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition',
    'placeholder:text-stone-300',
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
      : 'border-stone-200 focus:border-red-600 focus:ring-4 focus:ring-red-500/10',
  ].join(' ')
}

function Field({ label, name, value, onChange, onBlur, error, touched, autoComplete, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(touched && error)}
        className={getFieldClasses(Boolean(touched && error))}
      />
      <p className={`mt-2 min-h-5 text-xs ${touched && error ? 'text-red-600' : 'text-stone-400'}`}>
        {touched && error ? error : ' '}
      </p>
    </label>
  )
}

export default function GuestCheckoutForm({ onValidityChange }) {
  const [form, setForm] = useState(() => readGuestCheckoutData())
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => buildErrors(form), [form])
  const isValid = useMemo(
    () => FIELD_ORDER.every((fieldName) => !errors[fieldName]),
    [errors]
  )

  useEffect(() => {
    localStorage.setItem(GUEST_CHECKOUT_STORAGE_KEY, JSON.stringify(form))
  }, [form])

  useEffect(() => {
    onValidityChange?.({
      isValid,
      data: Object.fromEntries(
        FIELD_ORDER.map((fieldName) => [fieldName, form[fieldName].trim()])
      ),
    })
  }, [form, isValid, onValidityChange])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({
      ...current,
      [name]: true,
    }))
  }

  return (
    <section className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-[#fffdfb] via-[#fcfbf8] to-[#f8f1ee] p-6 shadow-[0_20px_60px_rgba(127,29,29,0.08)] sm:p-8">
      <div className="border-b border-red-100 pb-6">
        <p className="text-sm font-medium text-red-700">Estas comprando como invitado</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
          Completa tus datos para terminar el pedido. No necesitas crear cuenta y tus datos quedan guardados en este dispositivo.
        </p>
      </div>

      <div className="space-y-10 pt-8">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-stone-950">Informacion de contacto</h2>
              <p className="mt-1 text-sm text-stone-500">Usaremos este email para confirmar tu pedido.</p>
            </div>
            <span className="hidden rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-red-700 sm:block">
              * Obligatorio
            </span>
          </div>
          <Field
            label="Correo electronico *"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            autoComplete="email"
            placeholder="tu@email.com"
          />
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-stone-950">Direccion de envio</h2>
            <p className="mt-1 text-sm text-stone-500">Ingresa la direccion de envio para este pedido.</p>
          </div>

          <div className="space-y-1">
            <Field
              label="Nombre completo *"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nombre}
              touched={touched.nombre}
              autoComplete="name"
              placeholder="Nombre y apellido"
            />

            <Field
              label="Direccion *"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.direccion}
              touched={touched.direccion}
              autoComplete="street-address"
              placeholder="Calle, numero, depto"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Ciudad *"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.ciudad}
                touched={touched.ciudad}
                autoComplete="address-level2"
                placeholder="Ciudad"
              />

              <Field
                label="Estado / Provincia *"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.estado}
                touched={touched.estado}
                autoComplete="address-level1"
                placeholder="Estado o provincia"
              />

              <Field
                label="Codigo postal *"
                name="codigoPostal"
                value={form.codigoPostal}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.codigoPostal}
                touched={touched.codigoPostal}
                autoComplete="postal-code"
                placeholder="Codigo postal"
              />
            </div>

            <Field
              label="Pais *"
              name="pais"
              value={form.pais}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.pais}
              touched={touched.pais}
              autoComplete="country-name"
              placeholder="Pais"
            />
          </div>
        </section>
      </div>
    </section>
  )
}
