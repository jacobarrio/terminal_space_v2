import React from 'react';

const TerminalSpaceLogo = ({ width = 120, height = 40, className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 360 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Logo square with rounded corners */}
      <rect
        x="10"
        y="10"
        width="100"
        height="100"
        rx="22"
        fill="#FFD700"
        stroke="#FFD700"
        strokeWidth="6"
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
      />
      
      {/* Text: Terminal */}
      <text
        x="130"
        y="50"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="500"
        fill="#FFFFFF"
      >
        Terminal
      </text>
      
      {/* Text: Space */}
      <text
        x="130"
        y="90"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="500"
        fill="#FFFFFF"
      >
        Space
      </text>
    </svg>
  );
};

export default TerminalSpaceLogo;