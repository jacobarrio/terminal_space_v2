import React, { useEffect, useState } from 'react';
import '../styles/AnimatedOverlay.css';

const AnimatedOverlay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after mount to trigger animations
    setIsLoaded(true);
    
    // Cleanup if needed
    return () => {
      setIsLoaded(false);
    };
  }, []);

  return (
    <div className="animated-overlay-container">
      <div className={`animated-overlay-gradient ${isLoaded ? 'active' : ''}`}></div>
      <div className={`particle-effect ${isLoaded ? 'active' : ''}`}></div>
      <div className={`shimmer-effect ${isLoaded ? 'active' : ''}`}></div>
    </div>
  );
};

export default AnimatedOverlay;