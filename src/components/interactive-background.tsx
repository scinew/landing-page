"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerIsCoarse = window.matchMedia("(pointer: coarse)").matches;

    const particleCount = prefersReducedMotion ? 18 : isMobile ? 42 : 84;
    const maxConnectionDistance = prefersReducedMotion ? 80 : isMobile ? 110 : 150;
    const mouseInfluenceRadius = pointerIsCoarse || prefersReducedMotion ? 0 : 150;
    const velocityDamping = prefersReducedMotion ? 0.995 : 0.99;
    const baseLineOpacity = prefersReducedMotion ? 0.05 : isMobile ? 0.08 : 0.1;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.5 + 0.5,
    }));

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    if (mouseInfluenceRadius > 0) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (mouseInfluenceRadius > 0) {
          const dxMouse = mouseRef.current.x - particle.x;
          const dyMouse = mouseRef.current.y - particle.y;
          const mouseDistance = Math.hypot(dxMouse, dyMouse);

          if (mouseDistance > 0 && mouseDistance < mouseInfluenceRadius) {
            const force = (mouseInfluenceRadius - mouseDistance) / mouseInfluenceRadius;
            particle.vx -= (dxMouse / mouseDistance) * force * 0.08;
            particle.vy -= (dyMouse / mouseDistance) * force * 0.08;
          }
        }

        particle.vx *= velocityDamping;
        particle.vy *= velocityDamping;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const otherParticle = particles[j];
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < maxConnectionDistance) {
            const opacity = baseLineOpacity * (1 - distance / maxConnectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = prefersReducedMotion ? 0.4 : 0.6;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      if (mouseInfluenceRadius > 0) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
      style={{ background: "transparent" }}
    />
  );
}
