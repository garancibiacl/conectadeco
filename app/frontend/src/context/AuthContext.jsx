import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(
    () => JSON.parse(localStorage.getItem('session') || 'null')
  )
  const navigate = useNavigate()

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const s = { token: data.token, user: data.user }
    localStorage.setItem('session', JSON.stringify(s))
    setSession(s)
    navigate('/dashboard')
  }

  const registro = async (nombre, email, password) => {
    const { data } = await api.post('/auth/register', { nombre, email, password })
    const s = { token: data.token, user: data.user }
    localStorage.setItem('session', JSON.stringify(s))
    setSession(s)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('session')
    setSession(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ session, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
