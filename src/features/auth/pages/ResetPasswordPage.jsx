import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { useParallaxEngine } from '../hooks/useParallaxEngine';
import { showSuccess } from '../../../shared/utils/toast';
import logoAuth from '../../../assets/img/logo-auth.png';

export const ResetPasswordPage = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  useParallaxEngine(canvasRef, error);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      useAuthStore.getState().setError('Falta el token de recuperación en la URL.');
      return;
    }

    const res = await resetPassword({ token, newPassword: data.newPassword });
    if (res.success) {
      useAuthStore.getState().clearError();
      showSuccess('Tu contraseña ha sido actualizada.', { duration: 4000 });
      navigate('/');
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Por favor, revisa todos los campos requeridos.');
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      <div className="z-10 relative flex justify-center w-full max-w-85 sm:max-w-100 lg:max-w-lg mx-auto px-4">
        <div className="bg-radial-[at_70%_50%] relative from-fuchsia-deep/10 to-gradient-to/10 w-full flex flex-col justify-center rounded-2xl overflow-hidden backdrop-blur-md border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* ESQUINAS */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#E03A82]/50 rounded-tl-xl pointer-events-none z-20"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#00FFCC]/50 rounded-tr-xl pointer-events-none z-20"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#E03A82]/50 rounded-bl-xl pointer-events-none z-20"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#00FFCC]/50 rounded-br-xl pointer-events-none z-20"></div>

          <div className="w-full px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-fuchsia-deep flex items-center justify-center relative shadow-fuchsia-deep/40 shadow-lg mb-4 bg-black/30 backdrop-blur-md">
                <img src={logoAuth} alt="Astra Bank Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <h2 className="text-2xl font-extrabold text-white text-center tracking-wide">Renueva tu <span className="text-cyan-vivid">seguridad</span></h2>
              <p className="text-text-dark-secondary text-xs sm:text-sm text-center mt-2">Protege tu universo financiero actualizando tu clave de acceso.</p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit, onError)}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[11px] sm:text-xs p-3 rounded-xl mb-4 text-center break-words w-full">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-text-dark-secondary text-[10px] sm:text-xs uppercase tracking-wider">Nueva Contraseña</label>
                <input type="password" {...register("newPassword", {
                  required: "El campo 'Nueva Contraseña' es obligatorio.",
                  minLength: { value: 8, message: "El campo 'Nueva Contraseña' debe tener al menos 8 caracteres." }
                })} className="w-full py-2 px-3 sm:py-3 sm:px-4 rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-xs sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid outline-none" placeholder="•••••••• (Mín. 8 caracteres)" />
              </div>

              <div className="space-y-1">
                <label className="block text-text-dark-secondary text-[10px] sm:text-xs uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                <input type="password" {...register("confirmPassword", {
                  required: "El campo 'Confirmar Nueva Contraseña' es obligatorio.",
                  validate: (val) => {
                    if (watch('newPassword') != val) {
                      return "Las contraseñas no coinciden.";
                    }
                  }
                })} className="w-full py-2 px-3 sm:py-3 sm:px-4 rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-xs sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid outline-none" placeholder="••••••••" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => navigate('/')} className="py-2 px-4 sm:py-3 sm:px-6 text-xs font-bold text-text-dark-secondary uppercase tracking-widest bg-[#130E26]/60 border border-[#2D264A] rounded-xl hover:bg-[#1A162B] transition-all flex items-center justify-center">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2 sm:py-3 text-[11px] sm:text-[13px] font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-[#7B3FEC] to-[#5A2EAC] rounded-xl hover:from-[#8C4BFF] hover:to-[#6533C2] shadow-[0_0_15px_rgba(123,63,236,0.3)] transition-all flex items-center justify-center">
                  {loading ? 'Procesando...' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
