import React, { useEffect, useRef } from 'react';
import '../styles/ImmersiveBackground.css';

// Import the cosmic particle corridor image
import cosmicParticlesImage from '../../attached_assets/IMG_1858.jpeg';

const ImmersiveBackground = () => {
  const backgroundRef = useRef(null);
  
  // Add subtle parallax effect on mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!backgroundRef.current) return;
      
      const xPos = (e.clientX / window.innerWidth) * 10;
      const yPos = (e.clientY / window.innerHeight) * 10;
      
      backgroundRef.current.style.transform = 
        `translate(${-xPos}px, ${-yPos}px) scale(1.1)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="immersive-background">
      <div className="cosmic-particles" ref={backgroundRef}>
        <img 
          src={cosmicParticlesImage} 
          alt="" 
          className="cosmic-particles-image" 
        />
      </div>
      <div className="shimmer-overlay"></div>
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default ImmersiveBackground;