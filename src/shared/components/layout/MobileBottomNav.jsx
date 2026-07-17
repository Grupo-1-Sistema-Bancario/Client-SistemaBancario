import { NavLink } from "react-router-dom";
import { FiHome, FiStar, FiUser } from "react-icons/fi";

const TABS = [
  { to: "/dashboard", label: "Inicio", icon: FiHome, end: true },
  { to: "/dashboard/favorites", label: "Favoritos", icon: FiStar, end: false },
  { to: "/dashboard/profile", label: "Perfil", icon: FiUser, end: false },
];

/**
 * Bottom tab bar al estilo ClientUserMobileSistemaBancario (MainTabs).
 * Solo se muestra en viewport móvil para rol cliente.
 */
export default function MobileBottomNav() {
  return (
    <nav
      className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 flex h-[60px] items-stretch border-t border-[#4A2D8A] bg-[#1A0F2E] pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegación principal"
    >
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              "flex flex-1 flex-col items-center justify-center gap-0.5 pt-1 text-[11px] font-medium transition-colors",
              isActive ? "text-[#D81B60]" : "text-[#8B7BB8]",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2.4 : 2}
                aria-hidden
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
