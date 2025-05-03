import React from 'react';
import '../styles/ImmersiveBackground.css';

// Import the cosmic particle image
import cosmicParticlesImage from '../../attached_assets/IMG_1858.jpeg';

const ImmersiveBackground = () => {
  return (
    <div className="immersive-background">
      <div className="particle-overlay"></div>
      <div className="shimmer-overlay"></div>
      <div className="cosmic-particles">
        <img src={cosmicParticlesImage} alt="" className="cosmic-particles-image" />
      </div>
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default ImmersiveBackground;