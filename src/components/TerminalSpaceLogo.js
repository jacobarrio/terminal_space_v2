import React from 'react';

const TerminalSpaceLogo = ({ width = 120, height = 40, className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 240 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Terminal bracket left */}
      <path
        d="M40 10H20C14.4772 10 10 14.4772 10 20V60C10 65.5228 14.4772 70 20 70H40"
        stroke="#3D5AFE"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Terminal bracket right */}
      <path
        d="M80 10H100C105.523 10 110 14.4772 110 20V60C110 65.5228 105.523 70 100 70H80"
        stroke="#3D5AFE"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Code line 1 */}
      <line
        x1="45"
        y1="30"
        x2="75"
        y2="30"
        stroke="#3D5AFE"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Code line 2 */}
      <line
        x1="40"
        y1="50"
        x2="60"
        y2="50"
        stroke="#3D5AFE"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Space text */}
      <path
        d="M130 30C130 25.5817 133.582 22 138 22H157C161.418 22 165 25.5817 165 30V50C165 54.4183 161.418 58 157 58H138C133.582 58 130 54.4183 130 50V30Z"
        fill="#F5F5F5"
        stroke="#3D5AFE"
        strokeWidth="4"
      />
      
      {/* Planet */}
      <circle
        cx="180"
        cy="40"
        r="15"
        fill="#3D5AFE"
        opacity="0.7"
      />
      
      {/* Stars */}
      <circle cx="210" cy="20" r="3" fill="#3D5AFE" />
      <circle cx="220" cy="40" r="2" fill="#3D5AFE" />
      <circle cx="205" cy="55" r="2" fill="#3D5AFE" />
    </svg>
  );
};

export default TerminalSpaceLogo;