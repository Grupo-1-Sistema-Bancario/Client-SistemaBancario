import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useParallaxEngine } from '../hooks/useParallaxEngine';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ForgotPassword } from '../components/ForgotPassword';
import logoAuth from '../../../assets/img/logo-auth.png';

export const AuthPage = () => {
  const canvasRef = useRef(null);

  const authError = useAuthStore((state) => state.error);
  const [currentView, setCurrentView] = useState('login');

  const handleSwitchView = (view) => {
    useAuthStore.getState().clearError();
    setCurrentView(view);
  };

  useParallaxEngine(canvasRef, authError);

  // Para animación
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      scale: 0.95,
    })
  };

  const directionAnimation = currentView === 'register' ? 1 : -1;

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black flex flex-col lg:flex-row">
      {/* Canvas para dibujar escena */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* CONTENIDO */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full h-full relative px-4 sm:px-8 lg:px-24">

        {/* --- LOGO MOBILE --- */}
        <div className="lg:hidden flex flex-col items-center mb-3 sm:mb-8 z-10 shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-fuchsia-deep flex items-center justify-center relative shadow-fuchsia-deep/40 shadow-lg mb-2 sm:mb-4 bg-black/30 backdrop-blur-md">
            <img src={logoAuth} alt="Astra Bank Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          </div>
          <h1 className="text-fuchsia-vivid text-xl sm:text-2xl font-black tracking-[0.15em] uppercase text-center leading-none">Astra Bank</h1>
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mt-1 text-center text-white/70">Tu futuro en expansión</p>
        </div>

        {/* --- LADO IZQUIERDO  */}
        <div className='hidden lg:flex flex-col justify-center w-full max-w-2xl z-10'>
          {/* Logo  */}
          <div className="flex items-center space-x-5 mb-16">
            <div className="w-14 h-14 rounded-full border border-fuchsia-deep flex items-center justify-center relative shadow-fuchsia-deep/40 shadow-lg">
              <img src={logoAuth} alt="Astra Bank Logo" />
            </div>
            <div>
              <h1 className="text-fuchsia-vivid  text-2xl font-black tracking-[0.15em] uppercase">Astra Bank</h1>
              <p className="text-text-light-tertiary text-[10px] tracking-[0.3em] uppercase mt-1 hidden sm:block ">Tú futuro en expansión</p>
            </div>
          </div>


          {/* TITULO PRINCIPAL */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] mb-8  tracking-tight">
            Tu fortuna <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gradient-from via-gradient-mid to-gradient-to">
              Trasciende galaxias
            </span> <br />
            Con nosotros
          </h2>

          {/* DESCRIPCION */}
          <p className="text-text-dark-secondary text-lg leading-relaxed mb-16 max-w-xl font-light">
            En Astra Bank, tu dinero no solo crece, sino que se expande a través de las estrellas. Únete a nosotros y lleva tu patrimonio a nuevas alturas, más allá de lo imaginable.
          </p>

          {/* ESTADISTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-baseline space-x-1.5 mb-2">
                <span className="text-white font-black text-3xl tracking-tight">120</span>
                <span className="text-cyan-vivid font-bold text-2xl">+</span>
              </div>
              <p className="text-text-light-tertiary text-[10px]  uppercase tracking-[0.15em]">Sucursales</p>
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5 mb-2">
                <span className="text-fuchsia-vivid font-black text-3xl tracking-tight">6.7</span>
                <span className="text-white font-black text-3xl tracking-tight">M</span>
                <span className="text-cyan-vivid font-bold text-2xl">+</span>
              </div>
              <p className="text-text-light-tertiary text-[10px]  uppercase tracking-[0.15em]">Exploradores</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1.5 mb-2">
                <span className="text-fuchsia-vivid font-black text-3xl tracking-tight">3</span>
                <span className="text-cyan-vivid font-bold text-2xl">+</span>
              </div>
              <p className="text-text-light-tertiary text-[10px]  uppercase tracking-[0.15em]">Años de servicio</p>
            </div>
          </div>
        </div>

        {/* --- FORMS --- */}
        <div className="z-10 relative flex justify-center w-full max-w-85 sm:max-w-100 lg:max-w-lg mx-auto lg:mx-0 shrink-0">
          <div className="bg-radial-[at_70%_50%] relative from-fuchsia-deep/10 to-gradient-to/10 w-full flex flex-col justify-center rounded-2xl overflow-hidden backdrop-blur-md border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] max-h-[75vh] sm:max-h-[85vh]">
            {/* ESQUINAS*/}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#E03A82]/50 rounded-tl-xl pointer-events-none z-20"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#00FFCC]/50 rounded-tr-xl pointer-events-none z-20"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#E03A82]/50 rounded-bl-xl pointer-events-none z-20"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#00FFCC]/50 rounded-br-xl pointer-events-none z-20"></div>

            <div className="w-full flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-14 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* FORMULARIO */}
              <div className="relative w-full flex flex-col min-h-95 sm:min-h-125">
                <AnimatePresence initial={false} custom={directionAnimation} mode="wait">
                  <motion.div
                    key={currentView}
                    custom={directionAnimation}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="w-full flex-1 flex flex-col justify-center"
                  >
                    {currentView === 'login' ? (
                      <LoginForm onSwitchView={handleSwitchView} />
                    ) : currentView === 'register' ? (
                      <RegisterForm onSwitchView={handleSwitchView} />
                    ) : (
                      <ForgotPassword onSwitchView={handleSwitchView} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      / </div>
  );
};