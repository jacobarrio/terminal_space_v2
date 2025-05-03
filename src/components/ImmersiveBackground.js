import React from 'react';
import '../styles/ImmersiveBackground.css';

const ImmersiveBackground = () => {
  return (
    <div className="immersive-background">
      <div className="particle-overlay"></div>
      <div className="shimmer-overlay"></div>
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default ImmersiveBackground;