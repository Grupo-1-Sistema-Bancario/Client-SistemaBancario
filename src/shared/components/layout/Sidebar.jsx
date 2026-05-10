import { useState, useRef, useEffect } from "react"

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from "../../../features/auth/store/useAuthStore"

const NAV = [
  {
    section: "Principal",
    items: [
      {
        id: "dashboard", label: "Dashboard", badge: null, icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        )
      },
    ]
  },
  {
    section: "Gestión",
    items: [
      {
        id: "usuarios", label: "Usuarios", badge: "24", icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      },
      {
        id: "nuevoCliente", label: "Nuevo Cliente", badge: null, icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        )
      },
      {
        id: "depositos", label: "Depósitos", badge: null, icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      },
      {
        id: "productos", label: "Productos", badge: null, icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )
      },
    ]
  },
  {
    section: "Reportes",
    items: [
      {
        id: "topCuentas", label: "Top Cuentas", badge: null, icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )
      },
      {
        id: "verUsuario", label: "Ver Usuario", badge: null, icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )
      },
    ]
  },
]

/**
 * Props:
 *  - externalOpen  : boolean — el padre puede abrirlo (botón hamburger)
 *  - onExternalClose: () => void — le avisa al padre cuando se cierra
 *  - onPin          : (pinned: boolean) => void — le avisa al padre del estado pin
 */
export default function Sidebar({ externalOpen = false, onExternalClose, onPin }) {
  const [active, setActive] = useState("dashboard")
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const leaveTimer = useRef(null)

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true })
  }

  // Sincroniza apertura externa (hamburger) → sidebar
  useEffect(() => {
    if (externalOpen) setHovered(true)
    else if (!pinned) setHovered(false)
  }, [externalOpen, pinned])

  const open = pinned || hovered

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current)
    setHovered(true)
  }

  const handleMouseLeave = () => {
    if (pinned) return
    leaveTimer.current = setTimeout(() => {
      setHovered(false)
      onExternalClose?.()
    }, 150)
  }

  const togglePin = () => {
    const next = !pinned
    setPinned(next)
    onPin?.(next)
    if (!next) {
      setHovered(false)
      onExternalClose?.()
    }
  }

  return (
    <>
      {/* Franja de hover invisible en el borde izquierdo */}
      {!open && (
        <div
          className="fixed left-0 top-[49px] bottom-0 w-2 z-40"
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed left-0 top-[49px] bottom-0 z-40
          flex flex-col w-56
          bg-[#0D0618]/95 backdrop-blur-xl
          border-r border-purple-900/30
          shadow-[4px_0_30px_rgba(0,0,0,0.5)]
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-900/30">
          <span
            className="text-[9px] font-semibold tracking-[0.2em] uppercase text-purple-500/70"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            MENÚ
          </span>

          {/* Pin button */}
          <button
            onClick={togglePin}
            title={pinned ? "Desfijar panel" : "Fijar panel"}
            className={`
              flex items-center justify-center w-7 h-7 rounded-lg border
              transition-all duration-200
              ${pinned
                ? "bg-pink-600/20 border-pink-500/50 text-pink-400 shadow-[0_0_10px_rgba(216,27,96,0.3)]"
                : "bg-white/5 border-purple-900/40 text-purple-400 hover:border-purple-500 hover:text-white"
              }
            `}
          >
            {/* Thumbtack SVG */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22" />
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
            </svg>
          </button>
        </div>

        {/* Indicador de fijado */}
        {pinned && (
          <div className="mx-3 mt-2 px-3 py-1.5 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shrink-0" />
            <span className="text-[10px] text-pink-400/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Panel fijado
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV.map(group => (
            <div key={group.section}>
              <p
                className="px-3 mb-1.5 text-[9px] font-semibold tracking-[0.2em] uppercase text-purple-500/70"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {group.section}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = active === item.id
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActive(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-sm font-medium transition-all duration-200 text-left
                          ${isActive
                            ? "bg-gradient-to-r from-pink-600/20 to-purple-700/15 text-white border-l-[3px] border-pink-500 pl-[9px]"
                            : "text-purple-300/70 hover:text-white hover:bg-white/5"
                          }
                        `}
                      >
                        <span className={isActive ? "text-pink-400" : "text-purple-500"}>
                          {item.icon}
                        </span>
                        <span className="flex-1 whitespace-nowrap">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-600 text-white"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-purple-900/30">
          <button eLogout
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay cuando está abierto pero NO fijado */}
      {open && !pinned && (
        <div
          className="fixed inset-0 top-[49px] z-30 bg-black/20 backdrop-blur-[1px]"
          onMouseEnter={handleMouseLeave}
        />
      )}
    </>
  )
}