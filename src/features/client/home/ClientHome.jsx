import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useMyTransactions } from "../my-transactions/hooks/useMyTransactions";
import { getMyAccountRequest } from "../../../shared/api/admin.js"; 

export const ClientHome = () => {
  const { user } = useAuthStore();
  const { transactions, loadTransactions } = useMyTransactions();
  
  const [bankProfile, setBankProfile] = useState(null);

  useEffect(() => {
    loadTransactions();

    let active = true;
    const loadBankProfile = async () => {
      try {
        const response = await getMyAccountRequest();
        if (active) {
          setBankProfile(response?.data?.data || null);
        }
      } catch (error) {
        console.error("Error cargando la cuenta bancaria en el Home", error);
      }
    };

    loadBankProfile();

    return () => {
      active = false;
    };
  }, []);

  const balance = bankProfile?.balance || 0; 
  const isPositive = balance > 0;
  const myAccountId = bankProfile?._id;

  const { lastIncome, lastExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    if (!myAccountId || !transactions.length) return { lastIncome: income, lastExpense: expense };

    const incomeTx = transactions.find(tx => 
        tx.type === 'DEPOSIT' || 
        (tx.type === 'TRANSFER' && (tx.accountTo?._id === myAccountId || tx.accountTo === myAccountId))
    );

    // Buscamos el primer egreso (Pago o transferencia enviada)
    const expenseTx = transactions.find(tx => 
        tx.type === 'PAYMENT' || 
        (tx.type === 'TRANSFER' && (tx.accountFrom?._id === myAccountId || tx.accountFrom === myAccountId))
    );

    if (incomeTx) income = incomeTx.amount;
    if (expenseTx) expense = expenseTx.amount;

    return { lastIncome: income, lastExpense: expense };
  }, [transactions, myAccountId]);

  const shortcuts = [
    {
      title: "Transferencias",
      desc: "Movimiento seguro a la velocidad de la luz.",
      to: "/dashboard/transfers",
      color: "from-pink-500 to-rose-600",
      icon: "💸"
    },
    {
      title: "Realizar Pagos",
      desc: "Liquida tus compromisos sin sudar.",
      to: "/dashboard/payments",
      color: "from-purple-500 to-indigo-600",
      icon: "💳"
    },
    {
      title: "Catálogo Astra",
      desc: "Descubre productos exclusivos.",
      to: "/dashboard/catalog",
      color: "from-cyan-500 to-teal-600",
      icon: "🛍️"
    },
    {
      title: "Mis Favoritos",
      desc: "Tus contactos de confianza a un clic.",
      to: "/dashboard/favorites",
      color: "from-amber-500 to-orange-600",
      icon: "⭐"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-8 animate-fadeIn">
      {/* Header & Main Balance */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#1A0F2E]/60 backdrop-blur-xl border border-purple-900/40 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-pink-500 font-bold tracking-widest text-sm uppercase mb-2">Estado de Cuenta</h2>
          <p className="text-gray-300 text-lg mb-6">Hola de nuevo, <span className="text-white font-semibold">{user?.name || user?.username || 'Usuario'}</span></p>
          
          <div className="mb-8">
            <span className="text-gray-400 text-sm">Saldo Disponible</span>
            {bankProfile === null ? (
              <div className="text-4xl md:text-5xl font-black tracking-tighter mt-2 text-gray-500 animate-pulse">
                Cargando...
              </div>
            ) : (
              <div className={`text-6xl md:text-7xl font-black tracking-tighter mt-2 ${isPositive ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]'}`}>
                Q {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>

          <Link 
            to="/dashboard/currencies" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D81B60] to-[#7B2FBE] hover:from-[#E91E63] hover:to-[#8E24AA] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)] hover:shadow-[0_0_30px_rgba(216,27,96,0.6)] hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Ver Divisas
          </Link>
        </div>

        {/* Resumen Rápido */}
        <div className="lg:w-1/3 bg-[#1A0F2E]/40 backdrop-blur-md border border-cyan-900/30 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="text-gray-300 text-sm">Último ingreso</span>
                      <span className="text-green-400 font-medium">+ Q{lastIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="text-gray-300 text-sm">Último gasto</span>
                      <span className="text-red-400 font-medium">- Q{lastExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
              </div>
            </div>
            <Link to="/dashboard/history" className="text-center text-sm text-cyan-500 hover:text-cyan-400 mt-4 underline decoration-cyan-500/30 underline-offset-4">Ver historial completo →</Link>
        </div>
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {shortcuts.map((shortcut) => (
          <Link 
            key={shortcut.title} 
            to={shortcut.to}
            className="group relative bg-[#1A0F2E]/50 backdrop-blur-sm border border-purple-900/30 p-6 rounded-2xl hover:bg-[#2D1B5E]/50 transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${shortcut.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">{shortcut.icon}</div>
            <h3 className="text-white font-bold text-lg mb-1">{shortcut.title}</h3>
            <p className="text-gray-400 text-sm">{shortcut.desc}</p>
            
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}