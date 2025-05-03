import React, { useEffect, useRef } from 'react';
import '../styles/ImmersiveBackground.css';

// Import the MidJourney image
import cosmicParticlesImage from '../../attached_assets/IMG_1858.jpeg';

/**
 * ImmersiveBackground - Creates a fullscreen animated background
 * Follows exact specifications for background implementation
 */
const ImmersiveBackground = () => {
  const backgroundRef = useRef(null);
  
  // Add subtle parallax effect based on mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!backgroundRef.current) return;
      
      // Very subtle movement to enhance parallax without being distracting
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
      
      backgroundRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="immersive-background">
      {/* Main background with MidJourney image */}
      <div className="cosmic-particles" ref={backgroundRef}>
        <img 
          src={cosmicParticlesImage} 
          alt="" 
          className="cosmic-particles-image"
          loading="eager"
          aria-hidden="true"
        />
      </div>
      
      {/* Subtle shimmer effect overlay */}
      <div className="shimmer-overlay"></div>
    </div>
  );
};

export default ImmersiveBackground;