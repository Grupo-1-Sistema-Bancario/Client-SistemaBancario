import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../../shared/utils/toast';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const LoginForm = ({ onSwitchView }) => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore(state => state.error);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      navigate('/dashboard');
      showSuccess('¡Bienvenido de nuevo, explorador!', { duration: 4000 });
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Por favor, revisa los campos requeridos.');
  };

  return (
    <>

      <div className="flex items-center space-x-3 mb-2">
        <p className="text-cyan-vivid text-xs uppercase font-bold tracking-[0.3em]">Desde 2024</p>
        <div className="h-px flex-1 bg-linear-to-r from-[#00FFCC]/40 to-transparent"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#E03A82] shadow-[0_0_8px_#E03A82]"></div>
      </div>

      {/* ENCABEZADO */}
      <div className="mb-10 relative z-10">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-wide ">Accede a tu <span className="text-cyan-vivid">universo</span> financiero</h2>
        <p className="text-text-dark-secondary text-sm">Ingresa tus credenciales para retomar el control de tu universo financiero.</p>
      </div>

      <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit, onError)}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[11px] sm:text-xs md:text-sm p-3 rounded-xl mb-4 text-center break-words w-full max-w-full">
            {error}
          </div>
        )}
        {/* CORREO O USUARIO */}
        <div className="space-y-2">
          <label className="block text-text-dark-secondary text-xs  uppercase tracking-[0.15em]">Correo o Usuario</label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-light-tertiary group-focus-within:text-[#7B3FEC] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </span>
            <input
              type="text"
              className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white placeholder-text-light-tertiary  text-sm focus:outline-none focus:border-[#7B3FEC] focus:ring-1 focus:ring-[#7B3FEC] focus:bg-[#1A162B]/80 hover:border-[#4B3B82] transition-all"
              placeholder="explorador@gmail.com"
              {...register('emailOrUsername', { required: "El campo 'Correo o Usuario' es obligatorio." })}
            />
            {errors.emailOrUsername && <span className="text-red-500 text-xs ml-1">{errors.emailOrUsername.message}</span>}
          </div>
        </div>

        {/* Contraseña */}
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs  uppercase tracking-[0.15em]">Contraseña</label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-[#7B3FEC] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white placeholder-text-light-tertiary  text-sm focus:outline-none focus:border-[#7B3FEC] focus:ring-1 focus:ring-[#7B3FEC] focus:bg-[#1A162B]/80 hover:border-[#4B3B82] transition-all"
              placeholder="••••••••••••"
              {...register('password', { required: "El campo 'Contraseña' es obligatorio." })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-light-tertiary hover:text-[#7B3FEC] transition-colors">
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              )}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
        </div>

        {/* OLVIDA CONTRASEÑA */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <p className="text-sm text-text-dark-secondary">¿Te dió un ataque de amnesia? Tranquilo, </p>
          <button type="button" onClick={() => onSwitchView('forgot')} className="text-cyan-deep hover:text-cyan-vivid text-sm font-medium transition-colors cursor-pointer">Recuperar acceso</button>
        </div>

        {/* LOGIN */}
        <button
          type="submit"
          className="w-full py-4 mt-6 text-sm font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-[#7B3FEC] to-[#5A2EAC] rounded-xl hover:from-[#8C4BFF] hover:to-[#6533C2] shadow-[0_0_20px_rgba(123,63,236,0.3)] hover:shadow-[0_0_30px_rgba(123,63,236,0.5)] transition-all flex items-center justify-center space-x-3 border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          <span>Iniciar Sesión</span>
        </button>
      </form>

      <p className="text-center text-sm text-text-dark-secondary mt-8 mb-6 relative z-10">
        ¿Quieres empezar a trascender? <button type="button" onClick={() => onSwitchView('register')} className="text-cyan-deep hover:text-cyan-vivid font-medium transition-colors cursor-pointer">Abrir cuenta &rarr;</button>
      </p>
    </>
  );
};