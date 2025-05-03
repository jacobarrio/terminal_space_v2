import React, { useEffect } from 'react';
import '../styles/AnimatedOverlay.css';

const AnimatedOverlay = () => {
  useEffect(() => {
    // This ensures any cleanup or initialization needed for animations
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="animated-overlay-container">
      <div className="animated-overlay-image"></div>
      <div className="particle-effect"></div>
    </div>
  );
};

export default AnimatedOverlay;