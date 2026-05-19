import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "./Navbar.jsx"
import { useFavoriteStore } from "../../hooks/useFavoriteStore" // <-- OJO: Verifica que esta ruta sea la correcta en tus carpetas
import Sidebar from "./Sidebar.jsx"
import { Background } from "./Background.jsx"

export const DashboardContainer = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const openCreateModal = useFavoriteStore((state) => state.openCreateModal)

  const handleAddFavorite = () => {
    openCreateModal()
    navigate('/dashboard/favorites')
  }

  const isFavoritesPage = location.pathname.includes("/favorites")

  return (
    <div className="relative h-screen flex overflow-hidden bg-[#0D0618]">
      
      <div className="absolute inset-0 pointer-events-none z-0">
        <Background />
      </div>

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar 
          sidebarOpen={sidebarOpen} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="flex-1 overflow-y-auto p-8 bg-transparent relative">
          {isFavoritesPage && (
            <button
              onClick={handleAddFavorite}
              className="absolute top-6 right-6 z-20 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white text-2xl font-bold hover:brightness-110 shadow-[0_0_18px_rgba(216,27,96,0.35)] cursor-pointer"
              title="Agregar favorito"
            >
              +
            </button>
          )}

          {children}
        </main>
      </div>

    </div>
  )
}