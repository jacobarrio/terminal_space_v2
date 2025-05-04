import React from 'react';
import '../styles/AIInfoModal.css';

/**
 * Modal component to explain how Terminal Space uses AI
 */
const AIInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">How Terminal Space Uses AI</h2>
        <p className="modal-description">
          Terminal Space uses advanced AI models to automatically pull in the latest news, 
          summarize complex stories into digestible highlights, and intelligently organize 
          articles into relevant categories. Our system continually analyzes global trends 
          to bring you the most relevant stories in real time.
        </p>
        <button className="modal-close-button gold-interactive" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AIInfoModal;