import React from 'react';
import '../styles/ImmersiveBackground.css';

// Import the MidJourney images
import midJourneyCorridorImage from '../../attached_assets/IMG_1850.jpeg';
import midJourneyCircleImage from '../../attached_assets/IMG_1843.jpeg';

/**
 * ImmersiveBackground - Creates a fullscreen fixed background with layered design
 * Implements the exact specifications with shimmering particles and central glow
 */
const ImmersiveBackground = () => {
  return (
    <div className="immersive-background">
      {/* Main MidJourney background image with shimmering animation */}
      <div 
        className="midjourney-background"
        style={{
          backgroundImage: `url(${midJourneyCorridorImage})`,
          transform: `translateY(calc(var(--scroll-y) * 0.05))`, // Subtle parallax effect
        }}
      ></div>
      
      {/* Central glowing circle element */}
      <div className="midjourney-circle-container" style={{
        transform: `translateY(calc(var(--scroll-y) * -0.03))`, // Subtle counter-parallax effect
      }}>
        <div className="circle-outer-glow"></div>
        <div 
          className="midjourney-circle"
          style={{
            backgroundImage: `url(${midJourneyCircleImage})`,
          }}
        ></div>
        <div className="circle-inner-glow"></div>
      </div>
      
      {/* Gold particle shimmer layer with parallax effect */}
      <div className="particles" style={{
        transform: `translateY(calc(var(--scroll-y) * -0.02))`, // Subtle floating effect on scroll
      }}></div>
      
      {/* Animated vertical particles */}
      <div className="vertical-particles">
        {Array.from({ length: 40 }).map((_, i) => (
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