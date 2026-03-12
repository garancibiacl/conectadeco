import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ShopProvider } from './context/ShopContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <AppRouter />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
