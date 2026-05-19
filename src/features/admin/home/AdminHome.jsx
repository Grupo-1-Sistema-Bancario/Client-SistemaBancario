import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useAccountsStore } from "../accounts/store/useAccountsStore";
import { useAccountRequestStore } from "../new-clients/store/useNewClientStore";

export const AdminHome = () => {
  const { user } = useAuthStore();
  const { accounts, getAccounts } = useAccountsStore();
  const { newClients, getRequests } = useAccountRequestStore();

  useEffect(() => {
    getAccounts();
    getRequests();
  }, []);

  // Procesamiento de datos reales
  const validAccounts = accounts.filter(acc => acc.accountNumber !== "0000000000");
  const activeAccounts = validAccounts.filter(acc => acc.isActive).length;
  const pendingRequestsCount = newClients.length;
  const totalBalance = validAccounts.reduce((acc, item) => acc + item.balance, 0);

  const adminModules = [
    { title: "Auditoría de Cuentas", desc: "Revisa las ballenas financieras del sistema.", to: "/dashboard/accounts-stats", icon: "📊", border: "border-cyan-500/50" },
    { title: "Nuevas Solicitudes", desc: "Gestión de clientes esperando aprobación.", to: "/dashboard/new-clients", icon: "👥", border: "border-pink-500/50" },
    { title: "Ingreso de Dinero", desc: "Procesamiento de depósitos físicos/digitales.", to: "/dashboard/deposits", icon: "💰", border: "border-green-500/50" },
    { title: "Control de Daños", desc: "Reversión de depósitos por anomalías.", to: "/dashboard/deposits/reverse", icon: "🛑", border: "border-red-500/50" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#1A0F2E] to-transparent p-6 rounded-2xl border-l-4 border-pink-600">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 uppercase tracking-widest">Astra Command Center</h1>
          <p className="text-gray-400 text-sm mt-1">Sesión activa de administrador: {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Sistema En Línea</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A0F2E]/60 backdrop-blur-md border border-purple-900/40 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Cuentas Activas</span>
          <span className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(0,191,165,0.4)]">
            {activeAccounts}
          </span>
        </div>
        <div className="bg-[#1A0F2E]/60 backdrop-blur-md border border-purple-900/40 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
          <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Solicitudes Pendientes</span>
          <span className="text-4xl font-black text-pink-400 drop-shadow-[0_0_10px_rgba(216,27,96,0.4)]">
            {pendingRequestsCount}
          </span>
        </div>
        <div className="bg-[#1A0F2E]/60 backdrop-blur-md border border-purple-900/40 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden lg:col-span-2">
          <div className="absolute -right-4 -top-4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Capital Almacenada</span>
          <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Q{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-purple-500/70 mt-4">Módulos de Operación</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {adminModules.map((mod) => (
          <Link
            key={mod.title}
            to={mod.to}
            className={`group bg-[#1A0F2E]/40 backdrop-blur-sm border-l-4 border-y border-r border-y-purple-900/30 border-r-purple-900/30 p-6 rounded-xl hover:bg-[#2D1B5E]/40 transition-all flex items-center gap-6 ${mod.border}`}
          >
            <div className="text-5xl opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-transform">
              {mod.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1 group-hover:text-pink-400 transition-colors">{mod.title}</h3>
              <p className="text-gray-400 text-sm">{mod.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}