"use client";

import React,{ useState, useEffect, useMemo } from 'react';

const Z_RANGE = 3000;

function _FloatingDot({ cx, cy, r, payload, fill, opacity, style, onMouseEnter, onMouseLeave }) {
    const [isHovered, setIsHovered] = useState(false);

    const zPosition = useMemo(() => {
      const seed = cx + cy; // Use position as seed
      return Math.abs(Math.sin(seed)) * Z_RANGE - Z_RANGE / 2;
    }, [cx, cy]);

    const duration = useMemo(() => {
      const seed = cx * cy;
      return 6 + Math.abs(Math.cos(seed)) * 4;
    }, [cx, cy]);

    const floatPattern = useMemo(() => {
      return Math.floor((cx + cy) % 3);
    }, [cx, cy]);

    const scale = (Z_RANGE + zPosition) / Z_RANGE;
    const baseSize = r * 1.5;
    const hitboxSize = baseSize * 3;
    // Use the passed-in opacity prop
    const blur = Math.max(0, (1 - scale) * 2);

    // Blue with glow effect
    const dotFill = '#0066cc';

    const groupStyle = {
      cursor: 'pointer',
      animation: isHovered ? 'none' : `none`,
      zIndex: 20,
    };

    // Debug: log size and fill for the first few dots
    useEffect(() => {
      if (cx < 10 && cy < 10) { // Only log a few times
        console.log('FloatingDot size:', r, 'fill:', dotFill);
      }
    }, [r, cx, cy, dotFill]);

    return (
      <g
        style={groupStyle}
        onMouseEnter={(e) => {
          setIsHovered(true);
          onMouseEnter(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          onMouseLeave(e);
        }}>
        {/* Outline removed */}
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${cx}-${cy}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Blurry outline */}
        <circle
          cx={cx}
          cy={cy}
          r={isHovered ? baseSize * 4 + 6 : baseSize + 4}
          fill="#0066cc"
          style={{
            opacity: isHovered ? 0.5 : 0.3,
            filter: `url(#glow-${cx}-${cy})`,
            transition: 'all 0.3s ease',
          }}
        />

        {/* Main dot */}
        <circle
          cx={cx}
          cy={cy}
          r={isHovered ? baseSize * 4 : baseSize}
          fill="#0066cc"
          style={{
            opacity: isHovered ? 1.0 : 0.8,
            filter: `url(#glow-${cx}-${cy})`,
            transition: 'all 0.3s ease',
          }}
        />

        {/* Hitbox (invisible but handles hover) */}
        <circle
          cx={cx}
          cy={cy}
          r={hitboxSize}
          fill="transparent"
          style={{ pointerEvents: 'all' }}
        />


      </g>
    );
  }

export const FloatingDot = React.memo(
  _FloatingDot,
  (prevProps, nextProps) => {
    return (
      prevProps.cx === nextProps.cx &&
      prevProps.cy === nextProps.cy &&
      prevProps.r === nextProps.r &&
      prevProps.fill === nextProps.fill // Compare fill as well
    );
  }
);


