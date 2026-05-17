import { useLocation, Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js"

const ADMIN_NAV = [
  {
    section: "Principal",
    items: [
      { 
        id: "dashboard", 
        to: "/dashboard", 
        label: "Dashboard", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> 
      },
    ]
  },
  {
    section: "Gestión de Cuentas",
    items: [
      { 
        id: "usuarios", 
        to: "/dashboard/usuarios", 
        label: "Usuarios", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> 
      },
      { 
        id: "nuevoCliente", 
        to: "/dashboard/new-clients", 
        label: "Solicitudes Pendientes", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg> 
      },
    ]
  },
  {
    section: "Operaciones de Bóveda",
    items: [
      { 
        id: "depositos", 
        to: "/dashboard/depositos", 
        label: "Depósitos", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> 
      },
      { 
        id: "reversiones", 
        to: "/dashboard/reversiones", 
        label: "Revertir Depósitos", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg> 
      }
    ]
  },
  {
    section: "Catálogo",
    items: [
      { 
        id: "productos", 
        to: "/dashboard/products", 
        label: "Productos y Servicios", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> 
      },
    ]
  },
  {
    section: "Auditoría y Reportes",
    items: [
      { 
        id: "topCuentas", 
        to: "/dashboard/top-cuentas", 
        label: "Top Cuentas", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> 
      },
      { 
        id: "verUsuario", 
        to: "/dashboard/buscar-historial", 
        label: "Ver Usuario", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> 
      },
    ]
  }
];

const USER_NAV = [
  {
    section: "Mi Cuenta",
    items: [
      { 
        id: "home", 
        to: "/dashboard", 
        label: "Mi Billetera", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> 
      },
    ]
  },
  {
    section: "Operaciones",
    items: [
      { 
        id: "transfer", 
        to: "/dashboard/transferencias", 
        label: "Transferencias", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> 
      },
      { 
        id: "payments", 
        to: "/dashboard/pagos", 
        label: "Realizar pagos", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg> 
      },
      { 
        id: "favorites", 
        to: "/dashboard/favoritos", 
        label: "Mis Favoritos", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> 
      },
      { 
        id: "catalog", 
        to: "/dashboard/catalog", 
        label: "Ver Catálogo", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> 
      },
    ]
  },
  {
    section: "Actividad",
    items: [
      { 
        id: "history", 
        to: "/dashboard/historial", 
        label: "Historial de Cuenta", 
        icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> 
      },
    ]
  }
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const currentNav = user?.role === 'ADMIN_ROLE' ? ADMIN_NAV : USER_NAV;

  return (
    <aside
      className={`
        flex flex-col bg-[#0D0618]/60 backdrop-blur-xl border-r border-purple-900/30
        transition-[width] duration-300 ease-in-out whitespace-nowrap overflow-hidden
        ${isOpen ? "w-72" : "w-0 border-none"}
      `}
    >
      <div className="flex items-center px-6 py-4 border-b border-purple-900/30 min-h-[69px]">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-purple-400">
          {user?.role === 'ADMIN_ROLE' ? 'PANEL DE CONTROL' : 'MI BANCA VIRTUAL'}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {currentNav.map(group => (
          <div key={group.section}>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-purple-500/70">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.items.map(item => {
                const isActive = location.pathname === item.to || (location.pathname === "/dashboard" && item.to === "/dashboard");
                
                return (
                  <li key={item.id}>
                    <Link
                      to={item.to || "#"}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl
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
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-purple-900/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="truncate">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}