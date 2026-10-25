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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Diamond Crest Facet */}
      <path
        d="M50 8L88 38L50 92L12 38L50 8Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top Crown Facets */}
      <path
        d="M50 8L32 38H68L50 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(198, 164, 91, 0.08)"
      />
      <line x1="12" y1="38" x2="32" y2="38" stroke={color} strokeWidth="2" />
      <line x1="68" y1="38" x2="88" y2="38" stroke={color} strokeWidth="2" />

      {/* Symmetrical Owl Ears / Top Diamond Points */}
      <path
        d="M32 38L22 18L50 30L78 18L68 38"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Forehead Diamond */}
      <polygon
        points="50,22 58,34 50,46 42,34"
        stroke={color}
        strokeWidth="1.8"
        fill="rgba(18, 61, 46, 0.15)"
      />

      {/* Wise Owl Left Eye (Diamond Monoline) */}
      <circle
        cx="34"
        cy="48"
        r="11"
        stroke={color}
        strokeWidth="2.2"
        fill="#FDFCFA"
      />
      <circle
        cx="34"
        cy="48"
        r="6.5"
        stroke={secondaryColor}
        strokeWidth="2"
        fill="rgba(18, 61, 46, 0.2)"
      />
      <circle cx="34" cy="48" r="2.8" fill={secondaryColor} />

      {/* Wise Owl Right Eye (Diamond Monoline) */}
      <circle
        cx="66"
        cy="48"
        r="11"
        stroke={color}
        strokeWidth="2.2"
        fill="#FDFCFA"
      />
      <circle
        cx="66"
        cy="48"
        r="6.5"
        stroke={secondaryColor}
        strokeWidth="2"
        fill="rgba(18, 61, 46, 0.2)"
      />
      <circle cx="66" cy="48" r="2.8" fill={secondaryColor} />

      {/* Sculpted Center Beak (Faceted Triangle) */}
      <polygon
        points="50,46 54,60 50,68 46,60"
        stroke={color}
        strokeWidth="2"
        fill={color}
      />

      {/* Lower Diamond Wing Facet Lines */}
      <line x1="34" y1="59" x2="50" y2="92" stroke={color} strokeWidth="2" />
      <line x1="66" y1="59" x2="50" y2="92" stroke={color} strokeWidth="2" />
      <line x1="12" y1="38" x2="34" y2="59" stroke={color} strokeWidth="2" />
      <line x1="88" y1="38" x2="66" y2="59" stroke={color} strokeWidth="2" />

      {/* Subtle Radiant Center Accent */}
      <circle cx="50" cy="78" r="2" fill={color} />
    </svg>
  );
}
