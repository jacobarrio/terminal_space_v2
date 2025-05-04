import React from 'react';
import '../styles/ImmersiveBackground.css';

// Import the MidJourney image - trying a different image
import midJourneyImage from '../../attached_assets/IMG_1850.jpeg';

/**
 * ImmersiveBackground - Creates a fullscreen fixed background
 * Implements the exact specifications with shimmering particles
 */
const ImmersiveBackground = () => {
  return (
    <div className="immersive-background">
      {/* MidJourney background image with shimmering animation */}
      <div 
        className="midjourney-background"
        style={{
          backgroundImage: `url(${midJourneyImage})`,
        }}
      ></div>
      
      {/* Gold particle shimmer layer */}
      <div className="particles"></div>
      
      {/* Animated vertical particles */}
      <div className="vertical-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImmersiveBackground;