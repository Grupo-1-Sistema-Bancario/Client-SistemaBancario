import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "./Navbar.jsx"
import Sidebar from "./Sidebar.jsx"
import { Background } from "./Background.jsx"
import MobileBottomNav from "./MobileBottomNav.jsx"
import { useParallaxEngine } from "../../../features/auth/hooks/useParallaxEngine.js"
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js"
import { useIsMobile } from "../../hooks/useIsMobile.js"

/** Rutas con bottom tabs (equivalente a MainTabs de la app móvil) */
const CLIENT_TAB_PATHS = [
  "/dashboard",
  "/dashboard/favorites",
  "/dashboard/profile",
]

/** Pantallas stack: sin bottom nav, con header de atrás en cada página */
const isClientTabRoute = (pathname) =>
  CLIENT_TAB_PATHS.some(
    (path) => pathname === path || (path !== "/dashboard" && pathname.startsWith(`${path}/`))
  )

export const DashboardContainer = ({ children }) => {
  const isMobile = useIsMobile()
  const location = useLocation()
  const { user } = useAuthStore()
  const isAdmin = user?.role === "ADMIN_ROLE"
  const canvasRef = useRef(null)

  // Desktop: sidebar abierta. Móvil: cerrada (drawer bajo demanda).
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  useParallaxEngine(canvasRef, null)

  // Al cambiar breakpoint, alinear estado del sidebar
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  // En móvil, al navegar, cerrar drawer admin
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  const isClientMobileShell = isMobile && !isAdmin
  const showClientBottomNav =
    isClientMobileShell && isClientTabRoute(location.pathname)

  // Admin en móvil: sidebar como drawer overlay
  const useMobileDrawer = isMobile && isAdmin

  const mainPaddingClass = useMemo(() => {
    if (isClientMobileShell) {
      return showClientBottomNav
        ? "flex-1 overflow-y-auto px-4 pt-4 pb-[calc(60px+env(safe-area-inset-bottom)+1rem)] bg-transparent relative"
        : "flex-1 overflow-y-auto px-4 pt-3 pb-6 bg-transparent relative"
    }
    if (isMobile && isAdmin) {
      return "flex-1 overflow-y-auto p-4 bg-transparent relative"
    }
    // Desktop: idéntico al original
    return "flex-1 overflow-y-auto p-8 bg-transparent relative"
  }, [isClientMobileShell, showClientBottomNav, isMobile, isAdmin])

  return (
    <div className="relative h-screen flex overflow-hidden bg-[#0D0618]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full pointer-events-none"
        />
        <Background />
      </div>

      {/* Sidebar desktop / drawer admin móvil — oculto para cliente móvil */}
      {!isClientMobileShell && (
        <>
          {useMobileDrawer && sidebarOpen && (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
              aria-label="Cerrar menú"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={
              useMobileDrawer
                ? `fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:static md:z-auto ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                  }`
                : "relative z-10"
            }
          >
            <Sidebar
              isOpen={useMobileDrawer ? true : sidebarOpen}
              onNavigate={() => {
                if (isMobile) setSidebarOpen(false)
              }}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Navbar: oculto en shell cliente móvil (la app no tiene top navbar) */}
        {!isClientMobileShell && (
          <Navbar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
        )}

        <main className={mainPaddingClass}>{children}</main>
      </div>

      {showClientBottomNav && <MobileBottomNav />}
    </div>
  )
}
