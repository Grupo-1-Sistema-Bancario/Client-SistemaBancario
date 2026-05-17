import { useEffect, useState } from "react";

export const Background = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--color-space-bg)]">
      
      <div 
        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      >
        <div 
          className="absolute w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-[0.15]"
          style={{
            background: 'var(--color-gradient-from)',
            left: '10%',
            top: '-5%',
          }}
        />
        
        <div 
          className="absolute w-[55vw] h-[55vw] rounded-full blur-[160px] opacity-10"
          style={{
            background: 'var(--color-cyan-vivid)',
            right: '-15%',
            bottom: '-10%',
          }}
        />

        <div 
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-[0.12]"
          style={{
            background: 'var(--color-gradient-mid)',
            left: '20%',
            top: '30%',
          }}
        />
      </div>
    </div>
  );
};