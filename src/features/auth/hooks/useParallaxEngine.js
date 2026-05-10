import { useEffect, useRef } from 'react';

// Clases puras aisladas del ciclo de renderizado de React
class Terrain {
  constructor(options, width, height) {
    this.width = width;
    this.height = height;
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();
    this.fillStyle = options.fillStyle || '#191D4C';
    this.mHeight = options.mHeight || height;
    this.points = [];

    let displacement = options.displacement || 140;
    const power = Math.pow(2, Math.ceil(Math.log(width) / Math.log(2)));

    this.points[0] = this.mHeight;
    this.points[power] = this.points[0];

    for (let i = 1; i < power; i *= 2) {
      for (let j = power / i / 2; j < power; j += power / i) {
        this.points[j] =
          (this.points[j - power / i / 2] + this.points[j + power / i / 2]) / 2 +
          Math.floor(Math.random() * -displacement + displacement);
      }
      displacement *= 0.6;
    }
  }

  update(ctx) {
    ctx.fillStyle = this.fillStyle;

    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
      this.lastScroll = new Date().getTime();
      this.points.push(this.points.shift());
    }

    ctx.beginPath();
    for (let i = 0; i <= this.width; i++) {
      if (i === 0) {
        ctx.moveTo(0, this.points[0]);
      } else if (this.points[i] !== undefined) {
        ctx.lineTo(i, this.points[i]);
      }
    }

    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.lineTo(0, this.points[0]);
    ctx.fill();
  }
}

class Star {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
    this.x = Math.random() * width; // Posición inicial aleatoria
  }

  reset() {
    this.size = Math.random() * 2;
    this.speed = Math.random() * 0.05;
    this.x = this.width;
    this.y = Math.random() * this.height;
  }

  update(ctx) {
    this.x -= this.speed;
    if (this.x < 0) {
      this.reset();
    } else {
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }
}

class ShootingStar {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.width;
    this.y = 0;
    this.len = Math.random() * 80 + 10;
    this.speed = Math.random() * 10 + 6;
    this.size = Math.random() * 1 + 0.1;
    this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
    this.active = false;
  }

  update(ctx) {
    if (this.active) {
      this.x -= this.speed;
      this.y += this.speed;
      if (this.x < 0 || this.y >= this.height) {
        this.reset();
      } else {
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.stroke();
      }
    } else {
      if (this.waitTime < new Date().getTime()) {
        this.active = true;
      }
    }
  }
}

export const useParallaxEngine = (canvasRef, triggerError, isFlashing) => {
  const flashOpacityRef = useRef(0);

  useEffect(() => {
    if (triggerError) {
      flashOpacityRef.current = 1.0;
    }
  }, [triggerError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    height = height < 400 ? 400 : height;
    canvas.width = width;
    canvas.height = height;

    const entities = [];

    // Estrellas base
    for (let i = 0; i < height / 2; i++) {
      entities.push(new Star(width, height));
    }

    // Estrellas fugaces
    entities.push(new ShootingStar(width, height));
    entities.push(new ShootingStar(width, height));

    // 👇 NUEVOS COLORES DE TERRENO (Estilo Synthwave oscuro)
    entities.push(new Terrain({ mHeight: height / 2 - 120 }, width, height)); // Fondo
    entities.push(new Terrain({ displacement: 120, scrollDelay: 50, fillStyle: '#1E1240', mHeight: height / 2 - 60 }, width, height)); // Medio
    entities.push(new Terrain({ displacement: 100, scrollDelay: 20, fillStyle: '#0D0720', mHeight: height / 2 }, width, height)); // Frente

    const animate = () => {
      // 👇 1. CIELO DEGRADADO AURORA (Celeste y Rosado sutil)
      // Fondo oscuro base espacial
      ctx.fillStyle = '#05030B';
      ctx.fillRect(0, 0, width, height);

      // Degradado diagonal simulando luces del norte sutiles
      const auroraGradient = ctx.createLinearGradient(0, 0, width, height);
      auroraGradient.addColorStop(0.1, 'rgba(224, 58, 130, 0.05)'); // Rosado/Fucsia (fin de aurora)
      auroraGradient.addColorStop(0.5, 'rgba(90, 46, 172, 0.05)');  // Transición profunda
      auroraGradient.addColorStop(0.9, 'rgba(0, 255, 204, 0.08)'); // Celeste (inicio de aurora)

      ctx.fillStyle = auroraGradient;
      ctx.fillRect(0, 0, width, height);

      // 👇 2. EL PLANETA / SOL NEÓN TÉNUE
      ctx.beginPath();
      // Dibujamos el sol en el centro horizontal, un poco por debajo del medio
      const sunY = height / 2 + 50;
      const sunRadius = 230;
      const sunGradient = ctx.createRadialGradient(width / 2, sunY, 0, width / 2, sunY, sunRadius);
      sunGradient.addColorStop(0, 'rgba(236, 72, 153, 0.50)'); // Pink-500 muy transparente
      sunGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');    // Se desvanece

      ctx.fillStyle = sunGradient;
      ctx.arc(width / 2, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Configuración para estrellas
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';

      // Actualizar y dibujar todas las entidades
      entities.forEach((entity) => entity.update(ctx));

      // 🔴 EFECTO FLASH ROJO GLOBAL (Afecta montañas, cielo y estrellas)
      if (flashOpacityRef.current > 0) {
        ctx.fillStyle = `rgba(220, 20, 60, ${flashOpacityRef.current * 0.4})`; // Max 40% opacidad
        ctx.fillRect(0, 0, width, height);

        flashOpacityRef.current -= 0.008; // Fade out en ~2 segundos
        if (flashOpacityRef.current < 0) flashOpacityRef.current = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, isFlashing]);
};