import React from 'react';

const TerminalSpaceLogo = ({ width = 144, height = 48, className = '' }) => {
  // Increased default size by 20%
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 360 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      filter="drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))"
    >
      {/* Logo square with rounded corners */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>
      
      {/* Logo square with rounded corners and glow */}
      <rect
        x="10"
        y="10"
        width="100"
        height="100"
        rx="22"
        fill="#FFD700"
        stroke="#FFD700"
        strokeWidth="6"
        filter="url(#glow)"
      />
      
      {/* Terminal prompt character (>) */}
      <path
        d="M35 55L65 40L65 70L35 55Z"
        fill="#121212"
        strokeWidth="0"
      />
      
      {/* Underscore/cursor */}
      <rect
        x="68"
        y="65"
        width="28"
        height="6"
        fill="#121212"
        strokeWidth="0"
      >
        <animate 
          attributeName="opacity" 
          values="1;0.3;1" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </rect>
      
      {/* Text: Terminal */}
      <text
        x="130"
        y="50"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="32"
        fontWeight="600"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        Terminal
      </text>
      
      {/* Text: Space - with gold color */}
      <text
        x="130"
        y="90"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="32"
        fontWeight="600"
        fill="#FFD700"
        letterSpacing="0.5"
        filter="url(#glow)"
      >
        Space
      </text>
    </svg>
  );
};

export default TerminalSpaceLogo;