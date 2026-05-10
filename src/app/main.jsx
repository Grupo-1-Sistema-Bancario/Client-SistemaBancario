import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from '../shared/store/useThemeStore'
import { AppRoutes } from './routes/AppRoutes.jsx'
import '../styles/index.css'

useThemeStore.getState().init()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)