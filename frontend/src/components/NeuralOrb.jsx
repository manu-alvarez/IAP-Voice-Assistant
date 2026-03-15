import React from 'react';
import './NeuralOrb.css';

const NeuralOrb = ({ audioLevel = 0, orbState = 'ready' }) => {
  // Map orbState to CSS classes for different animations
  const getStateClass = () => {
    switch (orbState) {
      case 'listening': return 'orb-listening';
      case 'processing': return 'orb-processing';
      case 'speaking': return 'orb-speaking';
      case 'error': return 'orb-error';
      default: return 'orb-ready';
    }
  };

  // Scale influence by audio volume (0 to 1)
  const dynamicScale = 1 + (audioLevel * 0.4);

  return (
    <div className={`neural-orb-container ${getStateClass()}`}>
      <div className="orb-layers" style={{ transform: `scale(${dynamicScale})` }}>
        {/* Core glow */}
        <div className="orb-layer core-glow"></div>
        
        {/* Inner energy rings */}
        <div className="orb-layer energy-ring ring-1"></div>
        <div className="orb-layer energy-ring ring-2"></div>
        
        {/* Magnetic field effect */}
        <div className="orb-layer magnetic-field"></div>
        
        {/* Floating particles/noise patterns via SVG filters */}
        <svg className="orb-svg-filters">
          <filter id="orb-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
        </svg>
      </div>
    </div>
  );
};

export default NeuralOrb;
