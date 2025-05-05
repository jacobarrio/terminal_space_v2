import React, { useEffect } from 'react';
import '../styles/AIInfoModal.css';

/**
 * Modal component to explain how Terminal Space uses AI
 * Updated with cleaner layout, modern font, readable line spacing, 
 * and soft fade-in animation for improved user experience
 */
const AIInfoModal = ({ isOpen, onClose }) => {
  // Exit early if modal is not open
  if (!isOpen) return null;
  
  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h2 className="modal-title">How Terminal Space Uses AI</h2>
        
        <div className="modal-body">
          <p className="modal-description">
            Terminal Space leverages advanced artificial intelligence to enhance your news reading experience in several ways:
          </p>
          
          <ul className="ai-features-list">
            <li>
              <span className="feature-title">Content Curation</span>
              <p>Our AI technology analyzes thousands of news sources to identify the most relevant and important stories based on your preferences and global significance.</p>
            </li>
            
            <li>
              <span className="feature-title">Intelligent Summarization</span>
              <p>Complex news articles are automatically condensed into clear, concise summaries that highlight key information while preserving critical context and nuance.</p>
            </li>
            
            <li>
              <span className="feature-title">Bias Detection & Analysis</span>
              <p>Our system evaluates the tone, perspective, and potential bias of each article, helping you understand different viewpoints and form more balanced opinions.</p>
            </li>
          </ul>
        </div>
        
        <div className="modal-footer">
          <button className="modal-close-button gold-interactive" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInfoModal;