import React from 'react';
import styles from './SVGCake.module.css';

export default function SVGCake({ className = '' }) {
  return (
    <svg 
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      className={`${styles.cakeSvg} ${className}`} 
      aria-hidden="true"
    >
      {/* Stand */}
      <path d="M25 80 L75 80 L70 84 L30 84 Z" fill="#D4A574" />
      <rect x="47" y="70" width="6" height="10" fill="#D4A574" />
      <ellipse cx="50" cy="70" rx="35" ry="8" fill="#E5B884" />

      {/* Bottom Tier */}
      <path d="M20 50 L20 66 C20 72, 80 72, 80 66 L80 50 Z" fill="#FFF5E6" />
      <ellipse cx="50" cy="50" rx="30" ry="7" fill="#FFC8D6" />
      
      {/* Icing Drips */}
      <path d="M20 50 Q25 55 30 50 Q35 55 40 50 Q45 55 50 50 Q55 55 60 50 Q65 55 70 50 Q75 55 80 50" fill="none" stroke="#FFC8D6" strokeWidth="4" strokeLinecap="round" />

      {/* Top Tier */}
      <path d="M30 30 L30 46 C30 50, 70 50, 70 46 L70 30 Z" fill="#FFF8E7" />
      <ellipse cx="50" cy="30" rx="20" ry="5" fill="#FFD3E0" />

      {/* Strawberry toppings on the bottom tier */}
      <circle cx="28" cy="48" r="3" fill="#C21807" />
      <circle cx="38" cy="52" r="3" fill="#C21807" />
      <circle cx="62" cy="52" r="3" fill="#C21807" />
      <circle cx="72" cy="48" r="3" fill="#C21807" />

      {/* Candle */}
      <rect x="48" y="15" width="4" height="12" rx="1" fill="#5B86E5" />
      {/* Wick */}
      <line x1="50" y1="15" x2="50" y2="12" stroke="#1A0D02" strokeWidth="1.5" />
      {/* Flame */}
      <path d="M50 3 Q53 8 50 12 Q47 8 50 3 Z" fill="#FF8C00" className={styles.svgFlame} />
    </svg>
  );
}
