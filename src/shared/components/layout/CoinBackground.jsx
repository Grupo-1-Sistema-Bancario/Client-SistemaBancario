import { useEffect, useRef } from "react";

export const CoinBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const gap = 42;
    const radiusVmin = 28;
    const speedIn = 0.5;
    const speedOut = 0.6;
    const restScale = 0.10;
    const minHoverScale = 1;
    const maxHoverScale = 2.6;
    const waveSpeed = 1100;
    const waveWidth = 170;

    const PALETTE = [
      { type: "solid", value: "#f59e0b" },
      { type: "solid", value: "#fbbf24" },
      { type: "solid", value: "#d97706" },
      { type: "solid", value: "#b45309" },
      { type: "solid", value: "#fcd34d" },
      { type: "gradient", stops: ["#fbbf24", "#92400e"] },
      { type: "gradient", stops: ["#fde68a", "#d97706"] },
      { type: "gradient", stops: ["#fef3c7", "#b45309"] },
      { type: "gradient", stops: ["#fcd34d", "#f59e0b"] },
    ];

    let grid = null;
    let rafId = null;
    let pointer = null;
    let activity = 0;
    let waves = [];

    function rnd(min, max) { return Math.random() * (max - min) + min; }
    function smoothstep(t) {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    }
    function durationToFactor(seconds) {
      if (seconds <= 0) return 1;
      return 1 - Math.pow(0.05, 1 / (60 * seconds));
    }

    function drawCoin(ctx, shape) {
      const r = shape.size / 1.5;
      const rx = r * Math.abs(Math.cos(shape.tilt));
      const ry = r;

      if (rx < 0.5) return;

      let fill;
      if (shape.color.type === "gradient") {
        const grad = ctx.createRadialGradient(-rx * 0.4, -ry * 0.4, r * 0.05, rx * 0.2, ry * 0.2, r * 1.6);
        grad.addColorStop(0, shape.color.stops[0]);
        grad.addColorStop(1, shape.color.stops[1]);
        fill = grad;
      } else {
        fill = shape.color.value;
      }

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.2 / shape.scale;
      ctx.stroke();

      if (rx > 3) {
        const inner = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(1, rx));
        inner.addColorStop(0, "rgba(255,255,255,0.22)");
        inner.addColorStop(1, "rgba(0,0,0,0.0)");
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(1, rx * 0.7), ry * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = inner;
        ctx.fill();

        const dollarSize = Math.max(4, rx * 0.55);
        ctx.font = `500 ${dollarSize}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(120,53,15,0.7)";
        ctx.fillText("$", 0, 0);
      }
    }

    function buildGrid() {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const cols = Math.floor(W / gap);
      const rows = Math.floor(H / gap);
      const offsetX = (W - (cols - 1) * gap) / 2;
      const offsetY = (H - (rows - 1) * gap) / 2;
      const shapes = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          shapes.push({
            x: offsetX + col * gap,
            y: offsetY + row * gap,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
            size: gap * 0.4,
            scale: restScale,
            maxScale: rnd(minHoverScale, maxHoverScale),
            hovered: false,
            tilt: rnd(0, Math.PI * 2),
            tiltSpeed: rnd(0.5, 2.0) * (Math.random() < 0.5 ? 1 : -1),
          });
        }
      }
      return { shapes, width: W, height: H };
    }

    function init() {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      grid = buildGrid();
    }

    function tick() {
      if (!grid) { rafId = requestAnimationFrame(tick); return; }

      const { shapes, width, height } = grid;
      const radius = Math.min(width, height) * (radiusVmin / 100);
      const now = performance.now();

      ctx.clearRect(0, 0, width, height);
      activity *= 0.93;

      const maxDist = Math.sqrt(width * width + height * height);
      waves = waves.filter(w => (now - w.startTime) / 1000 * waveSpeed < maxDist + waveWidth);

      for (const shape of shapes) {
        let pointerInfluence = 0;
        if (pointer && activity > 0.001) {
          const dx = shape.x - pointer.x;
          const dy = shape.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          pointerInfluence = smoothstep(1 - dist / radius) * activity;
          shape.hovered = pointerInfluence > 0.05;
          if (shape.hovered && !shape._wasHovered) {
            shape.maxScale = rnd(minHoverScale, maxHoverScale);
            shape._wasHovered = true;
          }
          if (!shape.hovered) shape._wasHovered = false;
        } else {
          shape.hovered = false;
          shape._wasHovered = false;
        }

        let waveInfluence = 0;
        for (const wave of waves) {
          const waveRadius = (now - wave.startTime) / 1000 * waveSpeed;
          const wdx = shape.x - wave.x;
          const wdy = shape.y - wave.y;
          const wdist = Math.sqrt(wdx * wdx + wdy * wdy);
          const t = 1 - Math.abs(wdist - waveRadius) / waveWidth;
          if (t > 0) waveInfluence = Math.max(waveInfluence, Math.sin(Math.PI * t));
        }

        const target = Math.max(
          restScale + pointerInfluence * (shape.maxScale - restScale),
          restScale + waveInfluence * (shape.maxScale - restScale)
        );
        const factor = target > shape.scale ? durationToFactor(speedIn) : durationToFactor(speedOut);
        shape.scale += (target - shape.scale) * factor;

        const influence = Math.max(pointerInfluence, waveInfluence);
        shape.tilt += shape.tiltSpeed * (0.008 + influence * 0.055);

        if (shape.scale < restScale * 0.15) continue;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.scale(shape.scale, shape.scale);
        drawCoin(ctx, shape);
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    }

    function getRelativePos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    const onMove = (e) => { pointer = getRelativePos(e); activity = 1; };
    const onClick = (e) => {
      const pos = getRelativePos(e);
      waves.push({ x: pos.x, y: pos.y, startTime: performance.now() });
    };
    const onResize = () => init();

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    init();
    rafId = requestAnimationFrame(tick);

    // onda inicial al cargar
    setTimeout(() => {
      if (grid) waves.push({ x: grid.width / 2, y: grid.height / 2, startTime: performance.now() });
    }, 300);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};