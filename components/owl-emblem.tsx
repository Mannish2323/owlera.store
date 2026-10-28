import React from "react";

interface OwlEmblemProps {
  size?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

/**
 * OWLERA Monoline Diamond Owl Emblem
 * 
 * Symmetrical geometric luxury hallmark combining the wise owl and faceted diamond,
 * rendered in refined gold monoline jewellery strokes.
 */
export function OwlEmblem({
  size = 48,
  className = "",
  color = "#C6A45B",
  secondaryColor = "#123D2E"
}: OwlEmblemProps) {
  // Use the official OWLERA logo asset with spreading wings and custom brand identity
  return (
    <img
      src="/logo-transparent.png"
      alt="OWLERA Hallmark Emblem"
      className={className}
      style={{
        height: `${size}px`,
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle"
      }}
    />
  );
}
