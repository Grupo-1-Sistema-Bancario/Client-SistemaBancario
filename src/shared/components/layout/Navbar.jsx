import { useMemo, useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js";
import AvatarUser from "../ui/AvatarUser.jsx";
import logoAuth from "../../../assets/LOGO.png";

const getTheme = (isLightMode) => ({
  nav: isLightMode
    ? "bg-[#F3F1FA]/95 border-b border-[#E0DEE9] text-[#211B2C]"
    : "bg-[#0D0618]/95 border-b border-purple-900/30 text-white",
  iconButton: isLightMode
    ? "relative flex items-center justify-center w-11 h-11 rounded-3xl bg-white border border-[#E0DEE9] text-[#211B2C] shadow-sm shadow-[#E0DEE9] hover:bg-[#FFDCF1] transition-colors duration-200"
    : "relative flex items-center justify-center w-11 h-11 rounded-3xl bg-white/5 border border-purple-900/40 text-purple-300 hover:bg-purple-700/20 hover:border-purple-500 transition-all duration-200",
  profileButton: isLightMode
    ? "flex items-center gap-3 rounded-3xl bg-white border border-[#E0DEE9] px-3 py-2 text-[#211B2C] hover:bg-[#FFDCF1] transition-colors duration-200"
    : "flex items-center gap-3 rounded-3xl bg-white/5 border border-purple-900/40 px-3 py-2 text-white hover:bg-white/10 transition-all duration-200",
  profilePanel: isLightMode
    ? "absolute right-0 mt-3 w-[320px] rounded-[2rem] border border-[#E0DEE9] bg-white/95 backdrop-blur-2xl shadow-[0_40px_80px_rgba(208,27,96,0.12)] p-4 animate-fadeIn"
    : "absolute right-0 mt-3 w-[320px] rounded-[2rem] border border-white/10 bg-[#14071B]/95 backdrop-blur-2xl shadow-[0_40px_80px_rgba(89,26,139,0.4)] p-4 animate-fadeIn",
  profileHeader: isLightMode
    ? "flex items-center gap-3 p-4 rounded-3xl bg-gradient-to-br from-[#FFDCF1] to-[#E8E4FA] border border-[#E0DEE9] shadow-sm shadow-[#E0DEE9]"
    : "flex items-center gap-3 p-4 rounded-3xl bg-gradient-to-br from-[#1D0B30]/90 to-[#220D35]/90 border border-white/10",
  rowBox: isLightMode
    ? "flex items-start justify-between gap-3 rounded-2xl bg-white px-4 py-3 border border-[#E0DEE9]"
    : "flex items-start justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 border border-white/10",
  labelText: isLightMode
    ? "text-[11px] uppercase tracking-[0.32em] text-[#211B2C]/70"
    : "text-[11px] uppercase tracking-[0.32em] text-purple-300",
  valueText: isLightMode
    ? "text-sm font-semibold text-[#211B2C] text-right break-words max-w-[12rem]"
    : "text-sm font-semibold text-white text-right break-words max-w-[12rem]",
  profileName: isLightMode
    ? "text-sm font-semibold uppercase tracking-[0.12em] text-[#211B2C] leading-tight"
    : "text-sm font-semibold uppercase tracking-[0.12em] text-white leading-tight",
  profileSub: isLightMode
    ? "text-[10px] uppercase tracking-[0.24em] text-[#00BFA5]"
    : "text-[10px] uppercase tracking-[0.24em] text-cyan-300/80",
  profileHeaderTitle: isLightMode
    ? "text-[11px] uppercase tracking-[0.35em] text-[#00BFA5]/90"
    : "text-[11px] uppercase tracking-[0.35em] text-cyan-300/80",
  profileHeaderName: isLightMode
    ? "text-lg font-black text-[#211B2C] leading-tight"
    : "text-lg font-black text-white leading-tight",
  profileHeaderSubtitle: isLightMode
    ? "text-[11px] uppercase tracking-[0.35em] text-[#D81B60]/80 mt-1"
    : "text-[11px] uppercase tracking-[0.35em] text-purple-300/70 mt-1",
  logoTitle: isLightMode
    ? "text-sm font-black tracking-[0.28em] uppercase text-[#211B2C]"
    : "text-sm font-black tracking-[0.28em] uppercase text-white",
  logoSubtitle: isLightMode
    ? "text-[11px] uppercase tracking-[0.26em] text-[#211B2C]/70"
    : "text-[11px] uppercase tracking-[0.26em] text-white/60",
});

const DetailRow = ({ label, value, rowBox, labelText, valueText }) => (
  <div className={rowBox}>
    <span className={labelText}>{label}</span>
    <span className={valueText}>{value}</span>
  </div>
);

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
);

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, account, logout } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN_ROLE';

  const [themeMode, setThemeMode] = useState(() => {
    const stored = localStorage.getItem("themeMode");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  const isLightMode = themeMode === "light";

  // FIX 4: Refs para detectar clics fuera de los dropdowns
  const profileRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // FIX 4: Cierre al hacer clic fuera de cualquier dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const theme = getTheme(isLightMode);

  // FIX 5: Se elimina isAdmin de las dependencias porque ya deriva de user
  const displayName = useMemo(() => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    if (user?.name || user?.surname) {
      return `${user?.name || ''} ${user?.surname || ''}`.trim();
    }
    return user?.username || user?.email || (user?.role === 'ADMIN_ROLE' ? 'ADMIN' : 'CLIENTE');
  }, [user]);

  const accountNumber = account?.accountNumber || 'Sin número';
  const email = user?.email || 'Sin correo';
  const phone = account?.phone || 'Sin teléfono';
  const address = account?.address || 'Sin dirección';

  return (
    <nav className={`relative z-50 flex items-center justify-between px-6 py-4 w-full backdrop-blur-xl ${theme.nav}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={theme.iconButton}
          aria-label="Alternar menú"
        >
          <HamburgerIcon open={sidebarOpen} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-600 via-purple-700 to-cyan-500 shadow-lg shadow-pink-900/40 border border-white/10">
            <img src={logoAuth} alt="Astra Bank Logo" className="w-6 h-6 object-contain" />
          </div>

          {/* FIX 2: Texto del logo/título ahora responde al tema */}
          <div className="space-y-1">
            <p className={theme.logoTitle} style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ASTRA BANK
            </p>
            <p className={theme.logoSubtitle}>Banca inteligente y futurista</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className={theme.iconButton} aria-label="Ver notificaciones" type="button">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0h6Z" />
          </svg>
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#00BFA5] border border-white" />
        </button>

        {/* FIX 3 y 4: settingsOpen cierra profileOpen al abrirse, y tiene ref para click outside */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => {
              setSettingsOpen((prev) => !prev);
              setProfileOpen(false); // FIX 3
            }}
            className={`flex items-center justify-center w-11 h-11 rounded-3xl transition-colors duration-200 ${isLightMode ? 'bg-gradient-to-br from-[#FFDCF1] to-[#E8E4FA] border border-[#E0DEE9] text-[#211B2C] shadow-sm shadow-[#E0DEE9] hover:from-[#E8E4FA] hover:to-[#FFDCF1]' : 'bg-white/5 border border-white/10 text-white shadow-sm shadow-[#220841]/20 hover:bg-white/10'}`}
            aria-label="Abrir opciones de tema"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M11.983 2.9a1 1 0 01.997.74l.12.715a7.223 7.223 0 012.118.65l.533-.282a1 1 0 011.182.33l.722 1.18a1 1 0 01-.166 1.261l-.588.59c.124.4.192.815.201 1.234l.74.123a1 1 0 01.723.998l-.004.802a1 1 0 01-.99.998l-.762-.01a7.19 7.19 0 01-.536 1.19l.473.467a1 1 0 01.188 1.22l-.7 1.2a1 1 0 01-1.26.379l-.662-.298c-.47.274-.967.49-1.48.644l-.14.741a1 1 0 01-.998.832h-.804a1 1 0 01-.998-.832l-.14-.741a7.17 7.17 0 01-1.477-.644l-.66.298a1 1 0 01-1.26-.379l-.7-1.2a1 1 0 01.188-1.22l.473-.467a7.14 7.14 0 01-.531-1.19l-.763.01a1 1 0 01-.99-.998l-.004-.802a1 1 0 01.723-.998l.74-.123a7.227 7.227 0 01.2-1.234l-.588-.59a1 1 0 01-.166-1.261l.721-1.18a1 1 0 011.181-.33l.534.282a7.226 7.226 0 012.118-.65l.12-.715a1 1 0 01.997-.74zm-.001 4.6a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${isLightMode ? 'bg-[#00BFA5] border border-white' : 'bg-[#D81B60] border border-white/20'}`} />
          </button>

          {settingsOpen && (
            <div className={`absolute right-0 mt-2 w-44 rounded-3xl p-2 shadow-lg ${isLightMode ? 'bg-white border border-[#E0DEE9] text-[#211B2C]' : 'bg-[#14071B]/95 border border-white/10 text-white'}`}>
              <button
                onClick={() => { setThemeMode('light'); setSettingsOpen(false); }}
                className={`w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${isLightMode ? 'bg-[#FFDCF1] text-[#211B2C] hover:bg-[#E8E4FA]' : 'bg-white/5 text-white hover:bg-white/10'}`}
              >
                Modo claro
              </button>
              <button
                onClick={() => { setThemeMode('dark'); setSettingsOpen(false); }}
                className={`mt-2 w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${isLightMode ? 'bg-white/5 text-[#211B2C] hover:bg-[#FFDCF1]' : 'bg-[#D81B60] text-white hover:bg-[#B3154C]'}`}
              >
                Modo oscuro
              </button>
            </div>
          )}
        </div>

        {/* FIX 3 y 4: profileOpen cierra settingsOpen al abrirse, y tiene ref para click outside */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setSettingsOpen(false); // FIX 3
            }}
            className={theme.profileButton}
            type="button"
          >
            <AvatarUser profilePicture={user?.profilePicture} name={displayName} />
            <div className="hidden sm:flex flex-col text-left">
              <span className={theme.profileName}>{displayName || 'USUARIO'}</span>
              <span className={theme.profileSub}>Mi perfil</span>
            </div>
          </button>

          {profileOpen && (
            <div className={theme.profilePanel}>
              <div className={theme.profileHeader}>
                <AvatarUser profilePicture={user?.profilePicture} name={displayName} />
                <div>
                  <p className={theme.profileHeaderTitle}>Perfil</p>
                  <p className={theme.profileHeaderName}>{displayName || 'Usuario Astra'}</p>
                  <p className={theme.profileHeaderSubtitle}>{isAdmin ? 'Administrador' : 'Cliente Astra'}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <DetailRow label="Nombre"    value={displayName}   rowBox={theme.rowBox} labelText={theme.labelText} valueText={theme.valueText} />
                <DetailRow label="Correo"    value={email}         rowBox={theme.rowBox} labelText={theme.labelText} valueText={theme.valueText} />
                <DetailRow label="Teléfono"  value={phone}         rowBox={theme.rowBox} labelText={theme.labelText} valueText={theme.valueText} />
                <DetailRow label="Dirección" value={address}       rowBox={theme.rowBox} labelText={theme.labelText} valueText={theme.valueText} />
                <DetailRow label="Cuenta"    value={accountNumber} rowBox={theme.rowBox} labelText={theme.labelText} valueText={theme.valueText} />
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full rounded-3xl bg-[#D81B60] px-4 py-3 text-sm font-bold text-white hover:bg-[#B3154C] transition-colors duration-200"
                  type="button"
                >
                  Cerrar sesión
                </button>
                <p className="text-[12px] text-[#211B2C]/70 text-center">
                  Tu sesión se cerrará y volverás a la pantalla de inicio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}