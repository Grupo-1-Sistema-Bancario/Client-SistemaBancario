import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

/**
 * Cabecera con botón atrás para pantallas "stack" del cliente en móvil
 * (Transferencias, Pagos, Catálogo, Historial), equivalente a ScreenHeader de la app.
 */
export default function MobileScreenHeader({ title, subtitle, backTo = "/dashboard" }) {
  const navigate = useNavigate();

  return (
    <header className="mb-4 flex items-center gap-2 md:hidden">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4A2D8A] bg-[#1A0F2E] text-[#F8F5FF] transition-colors hover:border-[#D81B60]/50"
        aria-label="Volver"
      >
        <FiArrowLeft className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-black uppercase italic tracking-wide text-[#D81B60]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8B7BB8]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
