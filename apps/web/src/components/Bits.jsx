import React from "react";

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

export function BalanceRing({ value = 0, label = "coins" }) {
  const numericValue = Number(value) || 0;
  const ringValue = Math.max(14, Math.min(100, numericValue / 12));

  return (
    <div className="balance-ring" style={{ "--ring-value": `${ringValue}%` }}>
      <div>
        <span>{numericValue.toLocaleString("ru-RU")}</span>
        <small>{label}</small>
      </div>
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
