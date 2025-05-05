import React, { useEffect, useRef, useState } from 'react';
import '../styles/AIInfoModal.css';

/**
 * Modal component to explain how Terminal Space uses AI
 * Updated with cleaner layout, modern font, readable line spacing,
 * scrollable content, and scroll indicator for improved user experience
 */
const AIInfoModal = ({ isOpen, onClose }) => {
  // Exit early if modal is not open
  if (!isOpen) return null;
  
  const contentRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  // Check if content is scrollable
  const checkScrollable = () => {
    if (contentRef.current) {
      const element = contentRef.current;
      const isScrollable = element.scrollHeight > element.clientHeight;
      setShowScrollIndicator(isScrollable);
    }
  };
  
  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Check if modal content is scrollable after it's rendered
      setTimeout(checkScrollable, 100);
      
      // Also check on window resize
      window.addEventListener('resize', checkScrollable);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('resize', checkScrollable);
    };
  }, [isOpen, onClose]);
  
  // Handle scroll events to hide indicator when scrolled
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Hide indicator when scrolled down significantly
      setShowScrollIndicator(scrollHeight > clientHeight && scrollTop < 50);
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        ref={contentRef}
        onScroll={handleScroll}
      >
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
            
            <li>
              <span className="feature-title">Semantic Search</span>
              <p>Our search functionality goes beyond simple keyword matching to understand the intent behind your queries, helping you find the most relevant articles even when they don't contain the exact words you searched for.</p>
            </li>
            
            <li>
              <span className="feature-title">Personalized Recommendations</span>
              <p>The more you use Terminal Space, the better it becomes at suggesting articles that match your interests, keeping you informed about topics that matter to you specifically.</p>
            </li>
          </ul>
        </div>
        
        <div className="modal-footer">
          <button className="modal-close-button gold-interactive" onClick={onClose}>
            Got it
          </button>
        </div>
        
        {/* Scroll indicator */}
        {showScrollIndicator && (
          <div className={`scroll-indicator ${showScrollIndicator ? 'show-scroll-indicator' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInfoModal;