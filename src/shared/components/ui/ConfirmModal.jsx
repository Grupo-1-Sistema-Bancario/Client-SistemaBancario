import { useEffect } from 'react'
import { useUIStore } from './store/uiStore'

export const ConfirmModal = () => {
  const { confirmModal, closeConfirm } = useUIStore()

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    if (confirmModal.isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [confirmModal.isOpen])

  if (!confirmModal.isOpen) return null

  return (
    <>
      <style>{`
        @keyframes cm-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cm-modal-in {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cm-shield-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes cm-ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cm-ring-counter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes cm-particles {
          0%   { opacity: 0; transform: translateY(0) scale(0); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-28px) scale(1.2); }
        }

        .cm-backdrop {
          animation: cm-backdrop-in 0.2s ease forwards;
        }
        .cm-modal {
          animation: cm-modal-in 0.3s cubic-bezier(0.33,1,0.67,1) forwards;
        }
        .cm-modal::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, #D81B60, #7B2FBE, transparent);
        }
        .cm-icon-shield {
          animation: cm-shield-float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(216,27,96,0.6));
        }
        .cm-ring-1 { animation: cm-ring-spin 4s linear infinite; }
        .cm-ring-2 { animation: cm-ring-counter 3s linear infinite; }

        .cm-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: cm-particles 2.4s ease-in-out infinite;
        }
        .cm-particle:nth-child(1) { background:#D81B60; top:10%; left:20%;  animation-delay:0s;    }
        .cm-particle:nth-child(2) { background:#00BFA5; top:20%; right:18%; animation-delay:0.4s;  }
        .cm-particle:nth-child(3) { background:#7B2FBE; top:60%; left:10%;  animation-delay:0.8s;  }
        .cm-particle:nth-child(4) { background:#D81B60; top:70%; right:12%; animation-delay:1.2s;  }
        .cm-particle:nth-child(5) { background:#00BFA5; top:40%; left:5%;   animation-delay:1.6s;  }
      `}</style>

      {/* Backdrop — clic fuera cierra */}
      <div
        className="cm-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={closeConfirm}
      >
        {/* Modal */}
        <div
          className="cm-modal relative w-full max-w-sm mx-4 text-center rounded-2xl p-10 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #2D1B5E 0%, #1A0F2E 100%)',
            border: '1px solid rgba(216,27,96,0.35)',
            boxShadow: '0 0 0 1px rgba(123,47,190,0.2), 0 24px 64px rgba(0,0,0,0.5)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Partículas */}
          <div className="cm-particle" />
          <div className="cm-particle" />
          <div className="cm-particle" />
          <div className="cm-particle" />
          <div className="cm-particle" />

          {/* Icono escudo */}
          <div className="relative mx-auto mb-6" style={{ width: 88, height: 88 }}>
            <svg className="cm-ring-1 absolute inset-0 w-full h-full" viewBox="0 0 104 104" fill="none">
              <circle cx="52" cy="52" r="50" stroke="rgba(216,27,96,0.25)" strokeWidth="1.5" strokeDasharray="6 5" />
            </svg>
            <svg className="cm-ring-2 absolute inset-0 w-full h-full" viewBox="0 0 92 92" fill="none">
              <circle cx="46" cy="46" r="44" stroke="rgba(123,47,190,0.35)" strokeWidth="1" strokeDasharray="3 7" />
            </svg>
            <svg className="cm-icon-shield w-full h-full" viewBox="0 0 88 88" fill="none">
              <defs>
                <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D81B60" />
                  <stop offset="100%" stopColor="#7B2FBE" />
                </linearGradient>
              </defs>
              <path
                d="M44 8 L72 20 L72 48 C72 62 58 74 44 80 C30 74 16 62 16 48 L16 20 Z"
                fill="rgba(216,27,96,0.12)"
                stroke="url(#shield-grad)"
                strokeWidth="2"
              />
              <polyline
                points="30,44 40,54 58,36"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Título dinámico del store */}
          <h2 className="text-base font-extrabold uppercase tracking-widest mb-3 text-white">
            {confirmModal.title}
          </h2>

          {/* Mensaje dinámico del store */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#C9B8FF' }}>
            {confirmModal.message}
          </p>

          {/* Divider */}
          <div
            className="mb-6"
            style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
          />

          {/* Botones */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={closeConfirm}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#C9B8FF',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                confirmModal.onConfirm?.()
                closeConfirm()
              }}
              className="py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-85 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #D81B60, #7B2FBE)',
                boxShadow: '0 4px 20px rgba(216,27,96,0.35)',
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}