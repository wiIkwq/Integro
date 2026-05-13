import React, { useEffect, useRef } from "react";

function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function AnimatedPanel({
  as: Tag = "section",
  className = "",
  delay = 0,
  style,
  children,
  ...props
}) {
  return (
    <Tag
      className={joinClasses("animated-panel", className)}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function SpotlightCard({
  as: Tag = "article",
  className = "",
  delay = 0,
  style,
  children,
  onPointerMove,
  ...props
}) {
  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  }

  return (
    <Tag
      className={joinClasses("spotlight-card", className)}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function ShinyButton({ as: Tag = "button", className = "", children, ...props }) {
  return (
    <Tag className={joinClasses("shiny-button", className)} {...props}>
      {children}
    </Tag>
  );
}

export function StatusDot({ online = false, label }) {
  return (
    <span className={joinClasses("status-dot", online ? "online" : "offline")}>
      <span aria-hidden="true" />
      {label || (online ? "online" : "offline")}
    </span>
  );
}

function hexToRgb(value) {
  const normalized = String(value || "#ffffff").replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized.padEnd(6, "f").slice(0, 6);
  const number = Number.parseInt(full, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255
  };
}

function wrapParticle(particle, width, height) {
  if (particle.x > width + 24) particle.x = -24;
  if (particle.x < -24) particle.x = width + 24;
  if (particle.y > height + 24) particle.y = -24;
  if (particle.y < -24) particle.y = height + 24;
}

export function PixelSnow({
  color = "#ffffff",
  flakeSize = 0.007,
  minFlakeSize = 1,
  pixelResolution = 275,
  speed = 0.1,
  depthFade = 15,
  farPlane = 15,
  brightness = 1.6,
  gamma = 0.7,
  density = 0.2,
  variant = "square",
  direction = 115
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rgb = hexToRgb(color);
    const particles = [];
    const angle = (direction * Math.PI) / 180;
    const driftX = Math.cos(angle);
    const driftY = Math.sin(angle);
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = performance.now();

    function createParticle() {
      return {
        x: Math.random() * Math.max(width, 1),
        y: Math.random() * Math.max(height, 1),
        z: Math.random() * Math.max(farPlane, 1),
        wobble: Math.random() * Math.PI * 2,
        speedOffset: 0.45 + Math.random() * 1.2
      };
    }

    function resize() {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(60, Math.round(pixelResolution * density * 2.2));
      while (particles.length < count) particles.push(createParticle());
      particles.length = count;
    }

    function draw(now) {
      const delta = Math.min(48, now - lastTime);
      lastTime = now;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const depth = 1 - particle.z / Math.max(farPlane, 1);
        const fade = Math.min(1, Math.max(0.08, (depth * farPlane) / Math.max(depthFade, 1)));
        const alpha = Math.min(0.9, Math.pow(fade, gamma) * brightness * 0.38);
        const baseSize = Math.max(minFlakeSize, Math.max(width, height) * flakeSize * (0.35 + depth));
        const size = Math.max(minFlakeSize, Math.round(baseSize));

        if (!prefersReducedMotion.matches) {
          const velocity = speed * delta * (0.05 + depth * 0.14) * particle.speedOffset;
          particle.x += driftX * velocity + Math.sin(now * 0.0008 + particle.wobble) * 0.02;
          particle.y += driftY * velocity;
          wrapParticle(particle, width, height);
        }

        context.globalAlpha = alpha;
        context.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (variant === "circle") {
          context.beginPath();
          context.arc(Math.round(particle.x), Math.round(particle.y), size / 2, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(Math.round(particle.x), Math.round(particle.y), size, size);
        }
      }

      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    }

    resize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(parent);
    window.addEventListener("resize", resize);
    frame = window.requestAnimationFrame(draw);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, [brightness, color, density, depthFade, direction, farPlane, flakeSize, gamma, minFlakeSize, pixelResolution, speed, variant]);

  return <canvas ref={canvasRef} className="pixel-snow-canvas" aria-hidden="true" />;
}
