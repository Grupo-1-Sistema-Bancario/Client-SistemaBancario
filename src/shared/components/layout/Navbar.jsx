import { useState } from "react"
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js";

const HamburgerIcon = ({ open }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line
      x1="3" y1="6" x2="21" y2="6"
      className="transition-all duration-300 origin-center"
      style={{ transform: open ? "rotate(45deg) translate(4px, 6px)" : "none" }}
    />
    <line
      x1="3" y1="12" x2="21" y2="12"
      className="transition-all duration-300"
      style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }}
    />
    <line
      x1="3" y1="18" x2="21" y2="18"
      className="transition-all duration-300 origin-center"
      style={{ transform: open ? "rotate(-45deg) translate(4px, -6px)" : "none" }}
    />
  </svg>
)

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const [query, setQuery] = useState("")
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const displayName = user?.name || (isAdmin ? "ADMIN" : "CLIENTE");

  return (
    <nav className="
      z-50 flex items-center justify-between
      px-6 py-4 w-full
      bg-[#0D0618]/60 backdrop-blur-xl
      border-b border-purple-900/30
    ">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="
            flex items-center justify-center w-10 h-10 rounded-xl
            bg-white/5 border border-purple-900/40 text-purple-300
            hover:bg-purple-700/20 hover:border-purple-500 hover:text-white
            transition-all duration-200
          "
        >
          <HamburgerIcon open={sidebarOpen} />
        </button>

        <div className="w-px h-6 bg-purple-900/50" />

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-purple-700 shadow-lg shadow-pink-900/40">
            <span className="text-white text-xs font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>N</span>
          </div>
          <span className="text-sm font-black tracking-[0.25em] bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent select-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            ASTRA BANCK
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/5 border border-purple-900/40 rounded-xl px-4 py-2 w-80 focus-within:border-purple-500 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all">
        <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar usuario, cuenta..."
          className="bg-transparent outline-none text-sm text-white placeholder-purple-400/60 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-purple-900/30 text-purple-300 hover:bg-purple-700/20 hover:border-purple-500 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-[#0D0618]" />
        </button>

        <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-purple-900/30 text-purple-300 hover:bg-purple-700/20 hover:border-purple-500 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <div className="w-px h-7 bg-purple-900/50" />

        <div className="flex items-center gap-3 pl-1 cursor-pointer">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-pink-600 to-purple-700 text-white text-xs font-bold shadow-md shadow-pink-900/30" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {displayName.substring(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight uppercase">{displayName}</p>
            <p className="text-[10px] text-pink-400 mt-0.5 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {isAdmin ? "SUPER_ADMIN" : "USUARIO REGULAR"}
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}