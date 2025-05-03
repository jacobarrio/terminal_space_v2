import React, { useEffect, useRef } from 'react';
import '../styles/ImmersiveBackground.css';

// Import the cosmic particle corridor image
import cosmicParticlesImage from '../../attached_assets/IMG_1858.jpeg';

const ImmersiveBackground = () => {
  const backgroundRef = useRef(null);
  const backgroundLayerRef = useRef(null);
  
  // Enhanced parallax effect on mouse movement with depth layers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!backgroundRef.current || !backgroundLayerRef.current) return;
      
      // Calculate mouse position relative to the center of the screen
      const mouseX = (e.clientX / window.innerWidth - 0.5);
      const mouseY = (e.clientY / window.innerHeight - 0.5);
      
      // Parallax effect with different intensity for each layer
      // Main background layer moves slower
      backgroundRef.current.style.transform = 
        `translate(${-mouseX * 25}px, ${-mouseY * 25}px) scale(1.15)`;
      
      // Overlay layer moves faster for depth effect
      backgroundLayerRef.current.style.transform = 
        `translate(${-mouseX * 40}px, ${-mouseY * 40}px) scale(1.2)`;
    };
    
    // Add subtle automatic drift animation even without mouse movement
    let driftX = 0;
    let driftY = 0;
    let driftDirection = 1;
    
    const autoDrift = () => {
      if (!backgroundRef.current) return;
      
      // Very subtle automatic drift when not moving mouse
      driftX += 0.01 * driftDirection;
      driftY += 0.008 * driftDirection;
      
      // Change direction occasionally
      if (Math.abs(driftX) > 5) {
        driftDirection *= -1;
      }
      
      // Apply subtle drift to background
      const currentTransform = backgroundRef.current.style.transform;
      if (!currentTransform.includes('translate')) { // Only apply if not being modified by mouse
        backgroundRef.current.style.transform = 
          `translate(${driftX}px, ${driftY}px) scale(1.15)`;
      }
    };
    
    // Set up both event listeners and animation
    window.addEventListener('mousemove', handleMouseMove);
    const driftInterval = setInterval(autoDrift, 50);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(driftInterval);
    };
  }, []);

  return (
    <div className="immersive-background">
      {/* Main cosmic particles layer */}
      <div className="cosmic-particles" ref={backgroundRef}>
        <img 
          src={cosmicParticlesImage} 
          alt="" 
          className="cosmic-particles-image" 
        />
      </div>
      
      {/* Secondary layer for parallax depth effect */}
      <div className="cosmic-particles-layer" ref={backgroundLayerRef}>
        <img 
          src={cosmicParticlesImage} 
          alt="" 
          className="cosmic-particles-image secondary-layer" 
        />
      </div>
      
      {/* Enhanced shimmer overlay */}
      <div className="shimmer-overlay"></div>
      
      {/* Light rays effect */}
      <div className="light-rays"></div>
      
      {/* Subtle gradient vignette around edges */}
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default ImmersiveBackground;