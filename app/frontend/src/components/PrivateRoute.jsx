import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" replace />
}
