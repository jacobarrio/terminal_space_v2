import React from 'react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ message, retry = null, details = null }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <i data-feather="alert-circle"></i>
      </div>
      <h3 className="error-title">Error</h3>
      <p className="error-message">{message}</p>
      
      {details && (
        <div className="error-details">
          <details>
            <summary>Technical Details</summary>
            <p>{details}</p>
          </details>
        </div>
      )}
      
      {retry && (
        <button className="error-retry-button" onClick={retry}>
          <i data-feather="refresh-cw"></i> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
