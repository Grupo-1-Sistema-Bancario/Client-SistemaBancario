import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { showSuccess, showError } from '../../../shared/utils/toast';

export const RegisterForm = ({ onSwitchView }) => {
  const error = useAuthStore(state => state.error);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const registerUser = useAuthStore(state => state.register);
  const loading = useAuthStore(state => state.loading);
  const clearError = useAuthStore(state => state.clearError);
  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    shouldUnregister: false
  });

  const nextStep = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const handleStep1Submit = async () => {
    const fieldsToValidate = ['nombres', 'apellidos', 'usuario', 'telefono', 'correo', 'password'];
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {

      for (const field of fieldsToValidate) {
        if (errors[field]) {
          useAuthStore.getState().setError(errors[field].message);
          return;
        }
      }
      useAuthStore.getState().setError('Verifica el formato de los campos.');
      return;
    }
    useAuthStore.getState().clearError();
    nextStep();
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Surname', data.surname);
    formData.append('Username', data.username);
    formData.append('Email', data.email);
    formData.append('Phone', data.phone);
    formData.append('Password', data.password);

    formData.append('JobType', data.job_type);
    formData.append('Address', data.address);
    formData.append('DPI', data.dpi);

    if (profilePic) {
      formData.append('ProfilePicture', profilePic);
    }

    const res = await registerUser(formData);
    if (res.success) {
      showSuccess('Usuario registrado exitosamente');
      nextStep();
    } else {
      useAuthStore.getState().setError(res.error || 'Error al registrar el usuario');
    }
  };

  const onValidationError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Completa tu rango, dirección y un DPI válido.');
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  const stepVariants = {
    enter: (dir) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 20 : -20, opacity: 0 })
  };

  return (
    <>
      {step < 3 && (
        <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
          <p className="text-fuchsia-vivid text-[9px] sm:text-xs uppercase font-bold tracking-[0.3em]">
            {step === 1 ? 'Paso 1: Información básica' : 'Paso 2: Información personal y de contacto'}
          </p>
          <div className="h-px flex-1 bg-linear-to-r from-fuchsia-vivid/40 to-transparent"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-vivid shadow-[0_0_8px_var(--color-cyan-vivid)]"></div>
        </div>
      )}

      {step < 3 && (
        <div className="mb-2 sm:mb-4 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-wide ">
            Únete a la <span className="text-fuchsia-vivid">expansión</span>
          </h2>
          <p className="text-text-dark-secondary text-[10px] sm:text-sm">
            {step === 1 ? 'Inicia tu viaje intergaláctico hoy mismo.' : 'Registra tu información clasificada.'}
          </p>
        </div>
      )}

      <div className="relative z-10 min-h-75 sm:min-h-90 flex flex-col justify-center">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[11px] sm:text-xs md:text-sm p-3 rounded-xl mb-4 relative z-10 text-center break-words w-full max-w-full">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit, onValidationError)}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-2 sm:space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* NOMBRES */}
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Nombres</label>
                    <input type="text" {...register("name", { required: "El campo 'Nombres' es obligatorio.", maxLength: { value: 25, message: "El campo 'Nombres' debe tener máximo 25 caracteres." } })} className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="Nombres" />
                  </div>
                  {/* APELLIDOS */}
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Apellidos</label>
                    <input type="text" {...register("surname", { required: "El campo 'Apellidos' es obligatorio.", maxLength: { value: 25, message: "El campo 'Apellidos' debe tener máximo 25 caracteres." } })} className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="Apellidos" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Usuario</label>
                    <input type="text" {...register("username", { required: "El campo 'Usuario' es obligatorio." })} className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="@usuario" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Teléfono</label>
                    <input type="tel" {...register("phone", { required: "El campo 'Teléfono' es obligatorio.", minLength: { value: 8, message: "El campo 'Teléfono' debe tener exactamente 8 dígitos." }, maxLength: { value: 8, message: "El campo 'Teléfono' debe tener exactamente 8 dígitos." } })} className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="12345678" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Correo Electrónico</label>
                    <input type="email" {...register("email", { required: "El campo 'Correo Electrónico' es obligatorio.", pattern: { value: /^\S+@\S+\.\S+$/, message: "El campo 'Correo Electrónico' tiene un formato inválido." } })} className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="explorador@cosmos.com" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Contraseña</label>
                    <input type="password" {...register("password", { required: "El campo 'Contraseña' es obligatorio.", minLength: { value: 8, message: "El campo 'Contraseña' debe tener al menos 8 caracteres." } })} className="w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Foto de perfil (Opcional)</label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-dashed border-[#2D264A] overflow-hidden flex items-center justify-center bg-[#130E26]/40 shrink-0">
                      {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-[9px] sm:text-xs text-text-dark-secondary file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-3 file:rounded-full file:border-0 file:text-[9px] sm:file:text-xs file:bg-fuchsia-vivid/10 file:text-fuchsia-vivid hover:file:bg-fuchsia-vivid/20 transition-all font-mono" />
                  </div>
                </div>

                <button type="button" onClick={handleStep1Submit} className="w-full py-2.5 sm:py-3 mt-2 sm:mt-4 text-[11px] sm:text-[13px] font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-fuchsia-vivid to-fuchsia-deep rounded-xl hover:from-fuchsia-glow hover:to-fuchsia-vivid shadow-[0_0_15px_rgba(216,27,96,0.3)] transition-all flex items-center justify-center space-x-2">
                  <span>Siguiente Fase</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l5-5m-5 5h12"></path></svg>
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-2 sm:space-y-4"
              >
                <div className="space-y-0.5 sm:space-y-1">
                  <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Tipo de Trabajo</label>
                  <select {...register("job_type", { required: "El campo 'Tipo de Trabajo' es obligatorio." })} className="w-full py-1.5 px-2 sm:py-3 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid outline-none">
                    <option className="bg-[#1A162B]" value="">Selecciona tu rango</option>
                    <option className="bg-[#1A162B]" value="independiente">Explorador Independiente</option>
                    <option className="bg-[#1A162B]" value="asalariado">Tripulante Asalariado</option>
                    <option className="bg-[#1A162B]" value="empresario">Comandante (Empresario)</option>
                  </select>
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">Dirección Intergaláctica</label>
                  <input type="text" {...register("direccion", { required: "El campo 'Dirección Intergaláctica' es obligatorio." })} className="w-full py-1.5 px-2 sm:py-3 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid" placeholder="Sector 4, Vía Láctea..." />
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <label className="block text-text-dark-secondary text-[9px] sm:text-[11px] uppercase tracking-wider">DPI (13 dígitos)</label>
                  <input type="text" {...register("dpi", { required: "El campo 'DPI' es obligatorio.", minLength: { value: 13, message: "El campo 'DPI' debe tener exactamente 13 dígitos." }, maxLength: { value: 13, message: "El campo 'DPI' debe tener exactamente 13 dígitos." } })} maxLength={13} className="w-full py-1.5 px-2 sm:py-3 sm:px-3 rounded-lg sm:rounded-xl bg-[#130E26]/60 border border-[#2D264A] text-white text-[11px] sm:text-sm focus:border-fuchsia-vivid focus:ring-1 focus:ring-fuchsia-vivid tracking-[0.2em] font-mono" placeholder="0000000000000" />
                </div>

                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-8">
                  <button type="button" onClick={prevStep} className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm font-bold text-text-dark-secondary uppercase tracking-widest bg-[#130E26]/60 border border-[#2D264A] rounded-xl hover:bg-[#1A162B] transition-all flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path></svg>
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 py-2 sm:py-3 text-[11px] sm:text-[13px] font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-cyan-vivid to-cyan-deep rounded-xl hover:from-[#00FFCC] hover:to-cyan-vivid shadow-[0_0_15px_rgba(0,191,165,0.3)] transition-all flex items-center justify-center space-x-2">
                    <span>{loading ? 'Procesando...' : 'Completar'}</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center text-center py-2 sm:py-4"
              >
                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border border-cyan-vivid/30 bg-cyan-vivid/10 flex items-center justify-center mb-3 sm:mb-6 shadow-[0_0_30px_rgba(0,191,165,0.2)]">
                  <svg className="w-6 h-6 sm:w-10 sm:h-10 text-cyan-vivid" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Solicitud Enviada</h3>
                <p className="text-text-dark-secondary text-[10px] sm:text-sm leading-relaxed mb-4 sm:mb-8 max-w-xs mx-auto">
                  Tus datos están viajando a nuestro centro de control. Por favor espera nuestro correo de aceptación de Astra Bank. <br /><br /> Estaremos verificando tu identidad cuántica.
                </p>
                <button type="button" onClick={() => onSwitchView('login')} className="py-2.5 px-6 sm:py-3 sm:px-8 text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-[0.2em] bg-[#1A162B] border border-[#2D264A] rounded-xl hover:border-fuchsia-vivid hover:text-fuchsia-vivid transition-all">
                  Volver al inicio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {step < 3 && (
        <p className="text-center text-sm text-text-dark-secondary mt-6 mb-2 relative z-10">
          ¿Ya eres un explorador? <button type="button" onClick={() => onSwitchView('login')} className="text-fuchsia-vivid hover:text-fuchsia-glow font-medium transition-colors cursor-pointer">Iniciar sesión &rarr;</button>
        </p>
      )}
    </>
  );
};