import { useMemo, useState, useEffect } from "react"
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js"
import AvatarUser from "../ui/AvatarUser.jsx"
import logoAuth from "../../../assets/img/LOGO.png"

const HamburgerIcon = ({ open }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" className="origin-center transition-all duration-300" style={{ transform: open ? "rotate(45deg) translate(4px, 6px)" : "none" }} />
    <line x1="3" y1="12" x2="21" y2="12" className="transition-all duration-300" style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }} />
    <line x1="3" y1="18" x2="21" y2="18" className="origin-center transition-all duration-300" style={{ transform: open ? "rotate(-45deg) translate(4px, -6px)" : "none" }} />
  </svg>
)

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <span className="text-[11px] uppercase tracking-[0.32em] text-purple-300/80">{label}</span>
    <span className="max-w-[12rem] break-words text-right text-sm font-semibold text-white">{value}</span>
  </div>
)

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === "ADMIN_ROLE"
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const applyTheme = (mode) => {
    const root = document.documentElement.style
    if (mode === 'light') {
      root.setProperty('--color-space-bg', '#F7F4F0')
      root.setProperty('--color-sky-bg', '#F7F4F0')
      root.setProperty('--color-hero-from', '#EBE0D8')
      root.setProperty('--color-hero-to', '#DFD7CC')
      root.setProperty('--color-card-light', '#EDE4D8')
      root.setProperty('--color-border-light', '#D9CCBB')
      root.setProperty('--color-surface-border', '#D9CCBB')
      root.setProperty('--color-text-dark-primary', '#211B2C')
      root.setProperty('--color-text-light-primary', '#2A2420')
      root.setProperty('--color-text-light-secondary', '#5E534A')
      root.setProperty('--color-text-light-tertiary', '#94897E')
      root.setProperty('--color-fuchsia-vivid', '#D81B60')
      root.setProperty('--color-cyan-vivid', '#00BFA5')
      root.setProperty('--color-gradient-from', '#D81B60')
      root.setProperty('--color-gradient-mid', '#7B2FBE')
      root.setProperty('--color-gradient-to', '#4A1D9E')
      // softer overlay for light mode
      root.setProperty('--color-surface-overlay', 'rgba(247,244,240,0.80)')
    } else {
      root.setProperty('--color-space-bg', '#0D0A14')
      root.setProperty('--color-deep-purple', '#1A0F2E')
      root.setProperty('--color-surface-dark', '#2D1B5E')
      root.setProperty('--color-surface-border', '#4A2D8A')
      root.setProperty('--color-text-dark-primary', '#F8F5FF')
      root.setProperty('--color-fuchsia-vivid', '#D81B60')
      root.setProperty('--color-cyan-vivid', '#00BFA5')
      root.setProperty('--color-gradient-from', '#D81B60')
      root.setProperty('--color-gradient-mid', '#7B2FBE')
      root.setProperty('--color-gradient-to', '#4A1D9E')
      root.setProperty('--color-surface-overlay', 'rgba(13,10,20,0.75)')
    }
  }

  useEffect(() => {
    applyTheme(theme)
    // close settings on escape
    const onKey = (e) => e.key === 'Escape' && setSettingsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [theme])

  const handleSetTheme = (mode) => {
    setTheme(mode)
    localStorage.setItem('theme', mode)
    setSettingsOpen(false)
  }

  const displayName = useMemo(() => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }

    if (user?.name || user?.surname) {
      return `${user?.name || ""} ${user?.surname || ""}`.trim()
    }

    return user?.username || user?.email || (isAdmin ? "ADMIN" : "CLIENTE")
  }, [user, isAdmin])

  const email = user?.email || "Sin correo"
  const phone = user?.phone || "Sin teléfono"
  const address = user?.address || "Sin dirección"
  const accountNumber = user?.accountNumber || user?.account?.number || "Sin número"

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-b border-purple-900/30 bg-[#0D0618]/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-900/40 bg-white/5 text-purple-300 transition-all duration-200 hover:border-purple-500 hover:bg-purple-700/20 hover:text-white"
          type="button"
          aria-label="Alternar menú"
        >
          <HamburgerIcon open={sidebarOpen} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-pink-600 via-purple-700 to-cyan-500 shadow-lg shadow-pink-900/40">
            <img src={logoAuth} alt="Astra Bank Logo" className="h-7 w-7 object-contain" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ASTRA BANK
            </p>
            <p className="text-[11px] uppercase tracking-[0.26em] text-purple-200/70">
              Banca inteligente y futurista
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-900/30 bg-white/5 text-purple-300 transition-all hover:border-purple-500 hover:bg-purple-700/20"
          type="button"
          aria-label="Ver notificaciones"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0D0618] bg-pink-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setSettingsOpen((s) => !s)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300 transition-all hover:border-cyan-400/60 hover:bg-white/10"
            type="button"
            aria-label="Ajustes de tema"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 3.3 17.3l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.68 0 1.26-.41 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.7 3.3l.06.06c.5.5 1.23.66 1.82.33.6-.33 1-1 1-1.51V3a2 2 0 1 1 4 0v.09c0 .56.41 1.18 1 1.51.59.34 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 20.7 6.7l-.06.06c-.33.6-.17 1.32.33 1.82.5.5 1.23.66 1.82.33H21a2 2 0 1 1 0 4h-.09c-.56 0-1.18.41-1.51 1z" />
            </svg>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#13081C]/95 p-3 shadow-lg backdrop-blur animate-fadeIn">
              <div className="space-y-2">
                <button
                  onClick={() => handleSetTheme('dark')}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 ${theme === 'dark' ? 'bg-white/6' : 'hover:bg-white/5'}`}
                >
                  <svg className="h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${theme === 'dark' ? 'text-white font-semibold' : 'text-white/80'}`}>Modo Oscuro</span>
                      <span className="ml-auto text-[11px] text-white/60">Actual</span>
                    </div>
                    <p className="mt-1 text-[12px] text-white/50">Contraste profundo que realza acentos fucsia y cian.</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-6 w-10 rounded-md border border-[var(--color-surface-border)] bg-[var(--color-space-bg)]" />
                  </div>
                </button>

                <button
                  onClick={() => handleSetTheme('light')}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 ${theme === 'light' ? 'bg-white/6' : 'hover:bg-white/5'}`}
                >
                  <svg className="h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${theme === 'light' ? 'text-white font-semibold' : 'text-white/80'}`}>Modo Claro</span>
                      <span className="ml-auto text-[11px] text-white/60">Cielo Estelar</span>
                    </div>
                    <p className="mt-1 text-[12px] text-white/50">Limpio y suave; blanco atenuado para menor fatiga visual.</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-6 w-10 rounded-md border border-[var(--color-border-light)] bg-[var(--color-sky-bg)]" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-all hover:border-pink-500/50 hover:bg-white/10"
            type="button"
            aria-label="Abrir perfil"
          >
            <AvatarUser
              name={displayName}
              profilePicture={isAdmin ? null : user?.profilePicture}
              imageSrc={isAdmin ? logoAuth : undefined}
              fallbackLabel={isAdmin ? "AB" : displayName}
              isAdmin={isAdmin}
              size="md"
            />

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold uppercase leading-tight text-white">
                {displayName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/80">
                {isAdmin ? "Administrador" : "Usuario"}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-[340px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#13081C]/95 p-4 shadow-[0_30px_80px_rgba(92,27,149,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#2A123D] via-[#150A24] to-[#091A1C] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3">
                  <AvatarUser
                    name={displayName}
                    profilePicture={isAdmin ? null : user?.profilePicture}
                    imageSrc={isAdmin ? logoAuth : undefined}
                    fallbackLabel={isAdmin ? "AB" : displayName}
                    isAdmin={isAdmin}
                    size="lg"
                  />

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
                      Perfil
                    </p>
                    <h3 className="text-xl font-black leading-tight text-white">
                      {displayName}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-pink-300/80">
                      {isAdmin ? "Logo del banco como avatar" : "Perfil de usuario"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <DetailRow label="Nombre" value={displayName} />
                <DetailRow label="Número de cuenta" value={accountNumber} />
                <DetailRow label="Correo" value={email} />
                <DetailRow label="Teléfono" value={phone} />
                <DetailRow label="Dirección" value={address} />
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    logout()
                    setProfileOpen(false)
                  }}
                  className="w-full rounded-2xl bg-[#D81B60] px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#B3154C]"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}