import { useRef, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useParallaxEngine } from '../hooks/useParallaxEngine';

export const VerifyEmailPage = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyEmail = useAuthStore(state => state.verifyEmail);
  const error = useAuthStore(state => state.error);

  const [status, setStatus] = useState('verifying');
  const setError = useAuthStore(state => state.setError);

  useParallaxEngine(canvasRef, error);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      useAuthStore.getState().setError('Se requiere un código válido para verificar.');
      setStatus('error');
      return;
    }

    const verify = async () => {
      const res = await verifyEmail(token);
      if (res.success) {
        useAuthStore.getState().clearError();
        setStatus('success');
      } else {
        setStatus('error');
      }
    };
    verify();
  }, [searchParams, verifyEmail]);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      <div className="z-10 relative flex justify-center w-full max-w-85 sm:max-w-md mx-auto px-4">
        <div className="bg-radial-[at_70%_50%] relative from-cyan-vivid/10 to-[#130E26]/80 w-full flex flex-col justify-center items-center rounded-2xl overflow-hidden backdrop-blur-md border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] px-6 py-10 sm:px-10 sm:py-16 text-center">

          {/* ESQUINAS */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-vivid/50 rounded-tl-xl pointer-events-none z-20"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-vivid/50 rounded-tr-xl pointer-events-none z-20"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-vivid/50 rounded-bl-xl pointer-events-none z-20"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-vivid/50 rounded-br-xl pointer-events-none z-20"></div>

          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-t-2 border-r-2 border-cyan-vivid animate-spin mb-6 shadow-[0_0_30px_rgba(0,191,165,0.2)]"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Sincronizando...</h2>
              <p className="text-text-dark-secondary text-xs sm:text-sm">Estamos verificando tu identidad en nuestros servidores.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-cyan-vivid/30 bg-cyan-vivid/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,191,165,0.3)]">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-vivid" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Identidad Confirmada</h2>
              <p className="text-text-dark-secondary text-xs sm:text-sm mb-8">Tu correo ha sido enlazado exitosamente a la base de datos de Astra Bank.</p>
              <button onClick={() => navigate('/')} className="w-full py-3 px-6 sm:py-3.5 sm:px-8 text-[11px] font-bold text-white uppercase tracking-[0.2em] bg-linear-to-r from-cyan-vivid to-cyan-deep rounded-xl hover:from-[#00FFCC] hover:to-cyan-vivid shadow-[0_0_15px_rgba(0,191,165,0.3)] transition-all">
                Iniciar Sesión
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Enlace Dañado</h2>
              <p className="text-red-400 text-xs sm:text-sm mb-8">{error || 'El código de verificación ha expirado o es inválido.'}</p>
              <button onClick={() => {
                setError(null);
                navigate('/');
              }} className="w-full py-3 px-6 sm:py-3.5 sm:px-8 text-[11px] font-bold text-white uppercase tracking-[0.2em] bg-[#1A162B] border border-[#2D264A] rounded-xl hover:border-red-500 hover:text-red-500 transition-all">
                Volver al inicio
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
