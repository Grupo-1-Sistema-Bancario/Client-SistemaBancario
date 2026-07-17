import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiSend,
  FiCreditCard,
  FiShoppingBag,
  FiClock,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useMyTransactions } from "../my-transactions/hooks/useMyTransactions";
import { getMyAccountRequest } from "../../../shared/api/admin.js";
import { renderDashboardIcon } from "../../../shared/components/icons";
import { useIsMobile } from "../../../shared/hooks/useIsMobile.js";

const formatCurrency = (value) =>
  `Q ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const typeLabel = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferencia",
  PAYMENT: "Pago",
};

const maskAccount = (value) => {
  if (value == null) return "••••";
  const str = String(value).replace(/\s/g, "");
  if (str.length <= 4) return str;
  return `•••• ${str.slice(-4)}`;
};

const HIDE_BALANCES_KEY = "astra_hide_balances";

/* -------------------------------------------------------------------------- */
/*  VISTA MÓVIL — réplica de HomeScreen (ClientUserMobileSistemaBancario)     */
/* -------------------------------------------------------------------------- */
const ClientHomeMobile = ({
  user,
  bankProfile,
  balance,
  isPositive,
  recentMovements,
  hideBalances,
  onToggleHide,
  myAccountId,
}) => {
  const displayName =
    user?.name || user?.username || user?.email || "Usuario";

  return (
    <div className="w-full animate-fadeIn pb-2">
      <div className="mb-4 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D81B60]">
            Estado de cuenta
          </p>
          <p className="text-lg text-[#C9B8FF]">
            Hola de nuevo,{" "}
            <span className="font-bold text-[#F8F5FF]">{displayName}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleHide}
          className="rounded-lg p-2 text-[#C9B8FF] transition-colors hover:bg-white/5"
          aria-label={hideBalances ? "Mostrar saldos" : "Ocultar saldos"}
        >
          {hideBalances ? (
            <FiEyeOff className="h-6 w-6" />
          ) : (
            <FiEye className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Balance card */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-[#4A2D8A] bg-[rgba(26,15,46,0.72)] px-4 py-8">
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[rgba(216,27,96,0.18)]"
          aria-hidden
        />
        <p className="mb-1 text-sm text-[#8B7BB8]">Saldo disponible</p>
        {bankProfile === null ? (
          <p className="animate-pulse text-4xl font-black tracking-tight text-gray-500">
            Cargando...
          </p>
        ) : (
          <p
            className={`text-[2.75rem] font-black leading-none tracking-tight ${
              isPositive
                ? "text-[#22C55E] drop-shadow-[0_0_18px_rgba(0,191,165,0.35)]"
                : "text-[#F1D302]"
            }`}
          >
            {hideBalances ? "••••••" : formatCurrency(balance)}
          </p>
        )}
        {bankProfile?.accountNumber ? (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B7BB8]">
              Cuenta
            </span>
            <span className="font-mono text-sm tracking-wider text-[#C9B8FF]">
              {maskAccount(bankProfile.accountNumber)}
            </span>
          </div>
        ) : null}
      </div>

      {/* Accesos rápidos */}
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D81B60]">
        Accesos rápidos
      </p>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          {
            to: "/dashboard/transfers",
            label: "Transferir",
            icon: FiSend,
            color: "#D81B60",
          },
          {
            to: "/dashboard/payments",
            label: "Pagar",
            icon: FiCreditCard,
            color: "#7B2FBE",
          },
          {
            to: "/dashboard/catalog",
            label: "Catálogo",
            icon: FiShoppingBag,
            color: "#00BFA5",
          },
          {
            to: "/dashboard/history",
            label: "Historial",
            icon: FiClock,
            color: "#F472B6",
          },
        ].map(({ to, label, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center rounded-2xl border border-[#4A2D8A] bg-[#1A0F2E] px-1 py-3 shadow-sm transition-transform active:scale-95"
          >
            <span
              className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border bg-[#130E26]"
              style={{ borderColor: color }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </span>
            <span className="text-center text-[11px] font-semibold text-[#F8F5FF]">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Movimientos recientes */}
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D81B60]">
        Movimientos recientes
      </p>
      {recentMovements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#4A2D8A] bg-[rgba(26,15,46,0.4)] px-4 py-10 text-center">
          <p className="text-sm text-[#8B7BB8]">Sin movimientos recientes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentMovements.map((m) => {
            const isIncoming =
              m.type === "DEPOSIT" ||
              (m.type === "TRANSFER" &&
                myAccountId &&
                String(m.accountTo?._id || m.accountTo) === String(myAccountId));

            return (
              <div
                key={m._id || m.id}
                className="flex items-center gap-3 rounded-2xl border border-[#4A2D8A] bg-[rgba(26,15,46,0.72)] px-3 py-3"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isIncoming
                      ? "bg-[rgba(34,197,94,0.12)] text-[#22C55E]"
                      : "bg-[rgba(193,41,46,0.15)] text-[#C1292E]"
                  }`}
                >
                  {isIncoming ? (
                    <FiArrowDown className="h-4 w-4" />
                  ) : (
                    <FiArrowUp className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#F8F5FF]">
                    {m.description || typeLabel[m.type] || m.type}
                  </p>
                  <p className="text-[11px] text-[#8B7BB8]">
                    {typeLabel[m.type] || m.type}
                    {m.createdAt || m.date
                      ? ` · ${new Date(m.createdAt || m.date).toLocaleDateString("es-GT")}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-bold ${
                    isIncoming ? "text-[#22C55E]" : "text-[#C1292E]"
                  }`}
                >
                  {hideBalances
                    ? "••••"
                    : `${isIncoming ? "+" : "-"} ${formatCurrency(m.amount)}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  VISTA DESKTOP — layout original sin cambios de estructura                 */
/* -------------------------------------------------------------------------- */
const ClientHomeDesktop = ({
  user,
  bankProfile,
  balance,
  isPositive,
  lastIncome,
  lastExpense,
}) => {
  const shortcuts = [
    {
      title: "Transferencias",
      desc: "Movimiento seguro a la velocidad de la luz.",
      to: "/dashboard/transfers",
      color: "from-pink-500 to-rose-600",
      icon: "transfers",
    },
    {
      title: "Realizar Pagos",
      desc: "Liquida tus compromisos sin sudar.",
      to: "/dashboard/payments",
      color: "from-purple-500 to-indigo-600",
      icon: "payments",
    },
    {
      title: "Catálogo Astra",
      desc: "Descubre productos exclusivos.",
      to: "/dashboard/catalog",
      color: "from-cyan-500 to-teal-600",
      icon: "catalog",
    },
    {
      title: "Mis Favoritos",
      desc: "Tus contactos de confianza a un clic.",
      to: "/dashboard/favorites",
      color: "from-amber-500 to-orange-600",
      icon: "favorites",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#1A0F2E]/60 backdrop-blur-xl border border-purple-900/40 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <h2 className="text-pink-500 font-bold tracking-widest text-sm uppercase mb-2">
            Estado de Cuenta
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Hola de nuevo,{" "}
            <span className="text-white font-semibold">
              {user?.name || user?.username || "Usuario"}
            </span>
          </p>

          <div className="mb-8">
            <span className="text-gray-400 text-sm">Saldo Disponible</span>
            {bankProfile === null ? (
              <div className="text-4xl md:text-5xl font-black tracking-tighter mt-2 text-gray-500 animate-pulse">
                Cargando...
              </div>
            ) : (
              <div
                className={`text-6xl md:text-7xl font-black tracking-tighter mt-2 ${
                  isPositive
                    ? "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                    : "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                }`}
              >
                Q {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>

          <Link
            to="/dashboard/currencies"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D81B60] to-[#7B2FBE] hover:from-[#E91E63] hover:to-[#8E24AA] text-white px-8 py-3 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)] hover:shadow-[0_0_30px_rgba(216,27,96,0.6)] hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Ver Divisas
          </Link>
        </div>

        <div className="lg:w-1/3 bg-[#1A0F2E]/60 backdrop-blur-xl border border-purple-900/40 rounded-3xl p-6 relative overflow-hidden flex flex-col group">
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

          <h3 className="text-pink-500 font-bold tracking-widest text-sm uppercase mb-4 relative z-10">
            Actividad Reciente
          </h3>

          <div className="flex-1 flex flex-col gap-4 relative z-10">
            <div className="flex-1 w-full flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-purple-900/30">
              <span className="text-gray-300 text-sm">Último ingreso</span>
              <span className="text-green-400 font-semibold">
                + Q
                {lastIncome.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex-1 w-full flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-purple-900/30">
              <span className="text-gray-300 text-sm">Último gasto</span>
              <span className="text-red-400 font-semibold">
                - Q
                {lastExpense.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <Link
            to="/dashboard/history"
            className="text-center text-sm text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em] underline decoration-cyan-500/30 underline-offset-4 relative z-10"
          >
            Ver historial completo
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.title}
            to={shortcut.to}
            className="group relative bg-[#1A0F2E]/50 backdrop-blur-sm border border-purple-900/30 p-6 rounded-2xl hover:bg-[#2D1B5E]/50 transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${shortcut.color} opacity-50 group-hover:opacity-100 transition-opacity`}
            ></div>
            <div className="text-white/90 mb-4 transition-all duration-300 group-hover:scale-110">
              {renderDashboardIcon(shortcut.icon, "w-10 h-10")}
            </div>
            <h3 className="text-white font-bold text-lg mb-1">
              {shortcut.title}
            </h3>
            <p className="text-gray-400 text-sm">{shortcut.desc}</p>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <svg
                className="w-6 h-6 text-white/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const ClientHome = () => {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const { transactions, loadTransactions } = useMyTransactions();

  const [bankProfile, setBankProfile] = useState(null);
  const [hideBalances, setHideBalances] = useState(() => {
    try {
      return localStorage.getItem(HIDE_BALANCES_KEY) === "1";
    } catch {
      return false;
    }
  });

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

    if (!myAccountId || !transactions.length)
      return { lastIncome: income, lastExpense: expense };

    const incomeTx = transactions.find(
      (tx) =>
        tx.type === "DEPOSIT" ||
        (tx.type === "TRANSFER" &&
          (tx.accountTo?._id === myAccountId || tx.accountTo === myAccountId))
    );

    const expenseTx = transactions.find(
      (tx) =>
        tx.type === "PAYMENT" ||
        (tx.type === "TRANSFER" &&
          (tx.accountFrom?._id === myAccountId ||
            tx.accountFrom === myAccountId))
    );

    if (incomeTx) income = incomeTx.amount;
    if (expenseTx) expense = expenseTx.amount;

    return { lastIncome: income, lastExpense: expense };
  }, [transactions, myAccountId]);

  const recentMovements = useMemo(
    () => (transactions || []).slice(0, 5),
    [transactions]
  );

  const toggleHide = () => {
    setHideBalances((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HIDE_BALANCES_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (isMobile) {
    return (
      <ClientHomeMobile
        user={user}
        bankProfile={bankProfile}
        balance={balance}
        isPositive={isPositive}
        recentMovements={recentMovements}
        hideBalances={hideBalances}
        onToggleHide={toggleHide}
        myAccountId={myAccountId}
      />
    );
  }

  return (
    <ClientHomeDesktop
      user={user}
      bankProfile={bankProfile}
      balance={balance}
      isPositive={isPositive}
      lastIncome={lastIncome}
      lastExpense={lastExpense}
    />
  );
};
