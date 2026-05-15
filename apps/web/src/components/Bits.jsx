import React, { useCallback, useEffect, useRef } from "react";

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

export function ElectricBorder({
  children,
  color = "#7cff9b",
  speed = 1,
  chaos = 0.12,
  borderRadius = 0,
  className = "",
  style
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback((x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octavedNoise = useCallback((x, time, seed) => {
    let y = 0;
    let amplitude = chaos;
    let frequency = 10;
    for (let index = 0; index < 8; index += 1) {
      y += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= 1.6;
      amplitude *= 0.7;
    }
    return y;
  }, [chaos, noise2D]);

  const getRoundedRectPoint = useCallback((t, left, top, width, height, radius) => {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const total = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    let distance = t * total;

    if (distance <= straightWidth) {
      return { x: left + radius + distance, y: top };
    }
    distance -= straightWidth;
    if (distance <= cornerArc) {
      const angle = -Math.PI / 2 + (distance / cornerArc) * (Math.PI / 2);
      return { x: left + width - radius + radius * Math.cos(angle), y: top + radius + radius * Math.sin(angle) };
    }
    distance -= cornerArc;
    if (distance <= straightHeight) {
      return { x: left + width, y: top + radius + distance };
    }
    distance -= straightHeight;
    if (distance <= cornerArc) {
      const angle = (distance / cornerArc) * (Math.PI / 2);
      return { x: left + width - radius + radius * Math.cos(angle), y: top + height - radius + radius * Math.sin(angle) };
    }
    distance -= cornerArc;
    if (distance <= straightWidth) {
      return { x: left + width - radius - distance, y: top + height };
    }
    distance -= straightWidth;
    if (distance <= cornerArc) {
      const angle = Math.PI / 2 + (distance / cornerArc) * (Math.PI / 2);
      return { x: left + radius + radius * Math.cos(angle), y: top + height - radius + radius * Math.sin(angle) };
    }
    distance -= cornerArc;
    if (distance <= straightHeight) {
      return { x: left, y: top + height - radius - distance };
    }
    distance -= straightHeight;
    const angle = Math.PI + (distance / cornerArc) * (Math.PI / 2);
    return { x: left + radius + radius * Math.cos(angle), y: top + radius + radius * Math.sin(angle) };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const borderOffset = 42;
    const displacement = 48;
    let width = 0;
    let height = 0;

    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width + borderOffset * 2);
      height = Math.max(1, rect.height + borderOffset * 2);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      const delta = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;
      timeRef.current += delta * speed;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.strokeStyle = color;
      context.lineWidth = 1.2;
      context.lineCap = "round";
      context.lineJoin = "round";

      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - borderOffset * 2;
      const borderHeight = height - borderOffset * 2;
      const radius = Math.min(borderRadius, borderWidth / 2, borderHeight / 2);
      const sampleCount = Math.max(80, Math.floor((borderWidth + borderHeight) * 0.9));

      context.beginPath();
      for (let index = 0; index <= sampleCount; index += 1) {
        const progress = index / sampleCount;
        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        const x = point.x + octavedNoise(progress * 8, timeRef.current, 0) * displacement;
        const y = point.y + octavedNoise(progress * 8, timeRef.current, 1) * displacement;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.stroke();
      animationRef.current = window.requestAnimationFrame(draw);
    }

    resize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(container);
    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      observer?.disconnect();
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    };
  }, [borderRadius, color, getRoundedRectPoint, octavedNoise, speed]);

  return (
    <div
      ref={containerRef}
      className={joinClasses("electric-border", className)}
      style={{ "--electric-border-color": color, borderRadius, ...style }}
    >
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" aria-hidden="true" />
      </div>
      <div className="eb-layers" aria-hidden="true">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
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
