import { useEffect, useState } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { getMyAccountRequest } from "../../../shared/api/admin.js";
import { getProfile as getAuthProfileRequest } from "../../../shared/api/auth.js";
import { showError } from "../../../shared/utils/toast.js";
import { FiUser } from "react-icons/fi";

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `Q ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const displayOrDash = (value) => {
  if (value == null || value === "") return "—";
  return String(value);
};

const InfoRow = ({ label, value, last }) => (
  <div className={`py-4 ${!last ? "border-b border-[#4A2D8A]" : ""}`}>
    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B7BB8]">
      {label}
    </p>
    <p className="break-words text-base font-semibold text-[#F8F5FF]">{value}</p>
  </div>
);

/**
 * Pantalla de perfil al estilo ProfileScreen de ClientUserMobileSistemaBancario.
 * En desktop también es usable; en móvil es la pestaña "Perfil" del bottom nav.
 */
export const ClientProfile = () => {
  const { user, logout } = useAuthStore();
  const [bankProfile, setBankProfile] = useState(null);
  const [authProfile, setAuthProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        const [bankRes, authRes] = await Promise.allSettled([
          getMyAccountRequest(),
          getAuthProfileRequest(),
        ]);

        if (!active) return;

        if (bankRes.status === "fulfilled") {
          setBankProfile(bankRes.value?.data?.data || null);
        } else {
          setBankProfile(null);
          showError(
            bankRes.reason?.response?.data?.message ||
              "No se pudo cargar tu cuenta bancaria"
          );
        }

        if (authRes.status === "fulfilled") {
          setAuthProfile(authRes.value?.data?.data || null);
        } else {
          setAuthProfile(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const name =
    [user?.name, user?.surname].filter(Boolean).join(" ") ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Cliente";

  const email = authProfile?.email || user?.email || user?.userEmail;
  const phone = bankProfile?.phone || user?.phone;
  const address = bankProfile?.address || user?.address;
  const accountNumber = bankProfile?.accountNumber;
  const jobName = bankProfile?.jobName;
  const monthlyIncome = bankProfile?.monthlyIncome;

  if (loading && !bankProfile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center animate-fadeIn">
        <p className="text-sm text-[#8B7BB8]">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg animate-fadeIn px-1 pb-4 md:max-w-2xl">
      <div className="mb-6 flex flex-col items-center py-4">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-[#4A2D8A] bg-[#1A0F2E]">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <FiUser className="h-12 w-12 text-[#D81B60]" />
          )}
        </div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.35em] text-[#00BFA5]">
          Perfil
        </p>
        <h1 className="text-center text-xl font-extrabold text-[#F8F5FF]">{name}</h1>
        <p className="mt-1 text-center text-sm text-[#C9B8FF]">
          {displayOrDash(email)}
        </p>
      </div>

      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D81B60]">
        Datos personales
      </p>
      <div className="mb-4 rounded-2xl border border-[#4A2D8A] bg-[rgba(26,15,46,0.72)] px-4">
        <InfoRow label="Usuario" value={displayOrDash(user?.username)} />
        <InfoRow label="Correo" value={displayOrDash(email)} />
        <InfoRow label="Teléfono" value={displayOrDash(phone)} last />
      </div>

      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D81B60]">
        Cuenta bancaria
      </p>
      <div className="mb-6 rounded-2xl border border-[#4A2D8A] bg-[rgba(26,15,46,0.72)] px-4">
        <InfoRow
          label="Número de cuenta"
          value={displayOrDash(accountNumber)}
        />
        <InfoRow label="Dirección" value={displayOrDash(address)} />
        <InfoRow label="Trabajo" value={displayOrDash(jobName)} />
        <InfoRow
          label="Ingreso mensual"
          value={
            monthlyIncome != null && !Number.isNaN(Number(monthlyIncome))
              ? formatCurrency(monthlyIncome)
              : "—"
          }
          last
        />
      </div>

      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="w-full rounded-2xl border border-[#D81B60]/40 bg-[#D81B60]/15 px-4 py-3.5 text-sm font-bold text-[#D81B60] transition-colors hover:bg-[#D81B60] hover:text-white"
      >
        Cerrar sesión
      </button>

      {logoutOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          onClick={() => setLogoutOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#4A2D8A] bg-[#1A0F2E] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black uppercase tracking-wide text-white">
              Cerrar sesión
            </h3>
            <p className="mt-2 text-sm text-[#C9B8FF]">
              ¿Deseas salir de Astra Bank?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-[#C9B8FF]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutOpen(false);
                  logout();
                }}
                className="flex-1 rounded-xl bg-[#D81B60] py-2.5 text-sm font-bold text-white"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
