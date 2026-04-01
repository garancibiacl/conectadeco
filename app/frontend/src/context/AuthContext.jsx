import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(
    () => JSON.parse(localStorage.getItem('session') || 'null')
  )
  const navigate = useNavigate()

  const persistSession = (nextSession) => {
    localStorage.setItem('session', JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const s = { token: data.token, user: data.user }
    persistSession(s)
    navigate('/dashboard')
  }

  const registro = async (nombre, email, password) => {
    const { data } = await api.post('/auth/register', { nombre, email, password })
    const s = { token: data.token, user: data.user }
    persistSession(s)
    navigate('/dashboard')
  }

  const updateProfile = (profile) => {
    if (!session) return

    const nextSession = {
      ...session,
      user: {
        ...session.user,
        ...profile,
      },
    }

    persistSession(nextSession)
  }

  const logout = () => {
    localStorage.removeItem('session')
    setSession(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ session, login, registro, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
