import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParallaxEngine } from '../hooks/useParallaxEngine';

export const UnauthorizedPage = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useParallaxEngine(canvasRef, null);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black flex items-center justify-center px-4">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      <div className="z-10 relative flex flex-col items-center justify-center text-center max-w-2xl bg-[#05030B]/60 p-8 sm:p-16 rounded-3xl backdrop-blur-md border border-fuchsia-vivid/20 shadow-[0_0_60px_rgba(216,27,96,0.15)]">

        <div className="text-fuchsia-vivid font-mono text-8xl sm:text-9xl font-black mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(216,27,96,0.6)]">
          403
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <div className="h-px w-8 sm:w-16 bg-linear-to-r from-transparent to-fuchsia-vivid"></div>
          <p className="text-white text-sm sm:text-base uppercase font-bold tracking-[0.4em]">Acceso Denegado</p>
          <div className="h-px w-8 sm:w-16 bg-linear-to-l from-transparent to-fuchsia-vivid"></div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-wide">
          Zona <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-vivid to-fuchsia-deep">Restringida</span>
        </h1>

        <p className="text-text-dark-secondary text-sm sm:text-lg mb-10 max-w-lg leading-relaxed font-light">
          Usted no tiene autorización para explorar este sector del universo. Si crees que esto es un error, por favor contacta al soporte técnico.
        </p>

        <button
          onClick={() => navigate('/')}
          className="py-3 px-8 sm:py-4 sm:px-10 text-[11px] sm:text-xs font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-fuchsia-vivid to-fuchsia-deep rounded-xl hover:from-fuchsia-glow hover:to-fuchsia-vivid shadow-[0_0_20px_rgba(216,27,96,0.3)] hover:shadow-[0_0_30px_rgba(216,27,96,0.5)] transition-all flex items-center space-x-3"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span>Regresar a la página de inicio</span>
        </button>

      </div>
    </div>
  );
};
