import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form'
import { showSuccess, showError } from '../../../shared/utils/toast'

export const ForgotPassword = ({ onSwitchView }) => {
  const error = useAuthStore(state => state.error);

  const { register, handleSubmit, formState: { errors } } = useForm()
  const { requestPasswordReset, loading } = useAuthStore();

  const onSubmit = async (data) => {
    const response = await requestPasswordReset(data.email);

    if (response.success) {
      showSuccess('Correo de recuperación enviado exitosamente');
      onSwitchView('login');
    } else {
      useAuthStore.getState().setError(response.error || 'Error al enviar correo de recuperación');
    }
  }

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Por favor, revisa tu correo electrónico.');
  };

  return (
    <>
      <div className="flex items-center space-x-3 mb-2">
        <p className="text-cyan-vivid text-xs uppercase font-bold tracking-[0.3em]">Recuperación de Fortuna</p>
        <div className="h-px flex-1 bg-linear-to-r from-cyan-vivid/40 to-transparent"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#E03A82] shadow-[0_0_8px_#E03A82]"></div>
      </div>

      <div className="mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-wide ">Recupera tu <span className="text-cyan-vivid">acceso</span></h2>
        <p className="text-text-dark-secondary text-sm">Ingresa tu identificador u correo para recibir las coordenadas de recuperación de tu universo.</p>
      </div>

      <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit, onError)}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[11px] sm:text-xs md:text-sm p-3 rounded-xl mb-4 text-center break-words w-full max-w-full">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="block text-text-dark-secondary text-xs uppercase tracking-[0.15em]">Correo Electrónico</label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-light-tertiary group-focus-within:text-cyan-vivid transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </span>
            <input
              type="email"
              className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white placeholder-text-light-tertiary text-sm focus:outline-none focus:border-[#7B3FEC] focus:ring-1 focus:ring-[#7B3FEC] focus:bg-[#1A162B]/80 hover:border-[#4B3B82] transition-all"
              placeholder="explorador@cosmos.com"
              {...register('email', { 
                required: "El campo 'Correo Electrónico' es obligatorio.",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "El campo 'Correo Electrónico' tiene un formato inválido." }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-6 text-sm font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-[#7B3FEC] to-[#5A2EAC] rounded-xl hover:from-[#8C4BFF] hover:to-[#6533C2] shadow-[0_0_20px_rgba(123,63,236,0.3)] hover:shadow-[0_0_30px_rgba(123,63,236,0.5)] transition-all flex items-center justify-center space-x-3 border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          <span>Enviar Instrucciones</span>
        </button>
      </form>

      <p className="text-center text-sm text-text-dark-secondary mt-10 mb-2 relative z-10">
        ¿Se te quitó la amnesia? <button type="button" onClick={() => onSwitchView('login')} className="text-cyan-deep hover:text-cyan-vivid font-medium transition-colors cursor-pointer">Volver a iniciar sesión &rarr;</button>
      </p>
    </>
  );
};