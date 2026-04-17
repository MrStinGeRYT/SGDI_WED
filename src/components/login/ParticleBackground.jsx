// ============================================================
// SGDI Web — ParticleBackground
// Panel visual institucional: red de partículas flotantes con
// interacción suave de mouse. Canvas-based, sin dependencias.
//
// PARA AJUSTAR INTENSIDAD: modifica PARTICLE_CONFIG abajo.
// PARA DESACTIVAR: agrega prop disabled={true} al componente.
// ============================================================

import React, { useEffect, useRef, useCallback } from 'react';
import './ParticleBackground.css';

/* ─────────────────────────────────────────
   CONFIGURACIÓN DE PARTÍCULAS
   Ajusta estos valores para modificar el efecto
   ───────────────────────────────────────── */
const PARTICLE_CONFIG = {
  desktop: {
    count: 80,    // número de partículas
    connectDist: 115,   // distancia máxima para conectar líneas (px)
    speed: 0.38,  // velocidad base de drift
    mouseRadius: 130,   // radio de influencia del mouse (px)
    mouseForce: 0.018, // intensidad de repulsión del mouse (0–0.1)
    maxLineAlpha: 0.11,  // opacidad máxima de líneas de conexión
  },
  tablet: {
    count: 32,
    connectDist: 100,
    speed: 0.30,
    mouseRadius: 100,
    mouseForce: 0.014,
    maxLineAlpha: 0.09,
  },
  mobile: {
    count: 16,
    connectDist: 80,
    speed: 0.22,
    mouseRadius: 0,    // sin interacción de mouse en móvil
    mouseForce: 0,
    maxLineAlpha: 0.08,
  },
};

/* ─────────────────────────────────────────
   CLASE PARTÍCULA
   ───────────────────────────────────────── */
class Particle {
  constructor(w, h, cfg) {
    this.init(w, h, cfg);
  }

  init(w, h, cfg) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    // Velocidad aleatoria en ambas direcciones
    const angle = Math.random() * Math.PI * 2;
    const spd = (0.4 + Math.random() * 0.6) * cfg.speed;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    // Tamaño variado pero pequeño
    this.r = 1.1 + Math.random() * 1.9;
    // Opacidad base con variación
    this.baseAlpha = 0.15 + Math.random() * 0.28;
    // Fase y velocidad del pulso de opacidad
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = 0.006 + Math.random() * 0.010;
  }

  update(w, h, mouse, cfg) {
    // Avanza
    this.x += this.vx;
    this.y += this.vy;

    // Pulso de opacidad
    this.phase += this.phaseSpeed;

    // Interacción con mouse — repulsión suave
    if (mouse.x !== null && cfg.mouseRadius > 0) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < cfg.mouseRadius && dist > 0) {
        const t = 1 - dist / cfg.mouseRadius; // 0→1 cuanto más cerca
        const force = t * t * cfg.mouseForce;     // cuadrático = suave en bordes
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Límite de velocidad para evitar que se dispare
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const max = cfg.speed * 2.8;
    if (spd > max) {
      this.vx = (this.vx / spd) * max;
      this.vy = (this.vy / spd) * max;
    }

    // Fricción: regresa gradualmente a velocidad natural
    this.vx *= 0.994;
    this.vy *= 0.994;

    // Wrap suave por los bordes
    const m = 24;
    if (this.x < -m) this.x = w + m;
    else if (this.x > w + m) this.x = -m;
    if (this.y < -m) this.y = h + m;
    else if (this.y > h + m) this.y = -m;
  }

  draw(ctx) {
    const pulse = Math.sin(this.phase) * 0.08;
    const alpha = Math.max(0.04, this.baseAlpha + pulse);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
    ctx.fill();
  }
}

/* ─────────────────────────────────────────
   HELPER: configuración según ancho
   ───────────────────────────────────────── */
function getConfig() {
  const w = window.innerWidth;
  if (w < 640) return PARTICLE_CONFIG.mobile;
  if (w < 1024) return PARTICLE_CONFIG.tablet;
  return PARTICLE_CONFIG.desktop;
}

/* ─────────────────────────────────────────
   COMPONENTE
   ───────────────────────────────────────── */
export default function ParticleBackground({ disabled = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    mouse: { x: null, y: null },
    cfg: getConfig(),
    rafId: null,
    mounted: true,
  });

  /* ── Inicializa / reinicializa partículas ── */
  const initParticles = useCallback((w, h) => {
    const st = stateRef.current;
    st.cfg = getConfig();
    st.particles = Array.from(
      { length: st.cfg.count },
      () => new Particle(w, h, st.cfg)
    );
  }, []);

  /* ── Loop de animación ── */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = stateRef.current;
    const { particles, mouse, cfg } = st;
    const { width: w, height: h } = canvas;

    // Limpia frame anterior
    ctx.clearRect(0, 0, w, h);

    // Actualiza y dibuja partículas
    for (const p of particles) p.update(w, h, mouse, cfg);

    // ── Dibuja líneas de conexión ──
    ctx.lineWidth = 0.7;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.connectDist) {
          // Opacidad inversamente proporcional a la distancia
          const alpha = (1 - dist / cfg.connectDist) * cfg.maxLineAlpha;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200, 220, 255, ${alpha.toFixed(3)})`;
          ctx.stroke();
        }
      }
    }

    // ── Dibuja puntos encima de las líneas ──
    for (const p of particles) p.draw(ctx);

    if (st.mounted) {
      st.rafId = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const st = stateRef.current;
    st.mounted = true;

    /* ── Ajusta tamaño del canvas al contenedor ── */
    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles(canvas.width, canvas.height);
    }

    /* ── Tracking del mouse relativo al canvas ── */
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      st.mouse.x = e.clientX - rect.left;
      st.mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      st.mouse.x = null;
      st.mouse.y = null;
    }

    /* ── Setup inicial ── */
    resize();
    animate();

    /* ── Listeners ── */
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    canvas.parentElement.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.parentElement.addEventListener('mouseleave', onMouseLeave);

    /* ── Cleanup ── */
    return () => {
      st.mounted = false;
      if (st.rafId) cancelAnimationFrame(st.rafId);
      ro.disconnect();
      canvas.parentElement?.removeEventListener('mousemove', onMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [disabled, initParticles, animate]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-bg"
      aria-hidden="true"     /* decorativo: oculto a lectores de pantalla */
    />
  );
}
