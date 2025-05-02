import React from 'react';
import '../styles/AnalysisCard.css';

const AnalysisCard = ({ analysis, biasAnalysis, compact = false }) => {
  // Function to render the bias gauge
  const renderBiasGauge = (biasScore) => {
    const score = parseFloat(biasScore);
    const normalizedPosition = ((score + 5) / 10) * 100; // Convert -5 to 5 range to 0-100%
    
    return (
      <div className="bias-gauge-container">
        <div className="bias-gauge">
          <div className="bias-scale">
            <span className="bias-left">Left</span>
            <span className="bias-center">Center</span>
            <span className="bias-right">Right</span>
          </div>
          <div className="bias-track">
            <div 
              className="bias-indicator" 
              style={{ left: `${normalizedPosition}%` }}
              title={`Bias score: ${score}`}
            ></div>
          </div>
        </div>
        <div className="bias-value">{score.toFixed(1)}</div>
      </div>
    );
  };

  // Function to render credibility badge
  const renderCredibilityBadge = (rating) => {
    const credibilityClasses = {
      'high': 'credibility-high',
      'medium': 'credibility-medium',
      'low': 'credibility-low'
    };
    
    const className = credibilityClasses[rating.toLowerCase()] || 'credibility-medium';
    
    return (
      <div className={`credibility-badge ${className}`}>
        {rating}
      </div>
    );
  };

  if (!analysis) {
    return <div className="analysis-card-empty">No analysis available</div>;
  }

  // If showing compact view, only show summary data
  if (compact) {
    return (
      <div className="analysis-card compact">
        <div className="analysis-metrics">
          <div className="analysis-metric">
            <span className="metric-label">Bias:</span>
            {renderBiasGauge(analysis.bias.score)}
          </div>
          <div className="analysis-metric">
            <span className="metric-label">Tone:</span>
            <span className="metric-value">{analysis.tone.primary}</span>
          </div>
          <div className="analysis-metric">
            <span className="metric-label">Factual:</span>
            {renderCredibilityBadge(analysis.factualReporting.rating)}
          </div>
        </div>
      </div>
    );
  }

  // Full analysis view
  return (
    <div className="analysis-card">
      <h3 className="analysis-title">Content Analysis</h3>
      
      {/* Display quick bias/tone badges if available from biasAnalysis */}
      {biasAnalysis && biasAnalysis.politicalLeaning && biasAnalysis.tone && (
        <div className="quick-analysis-badges">
          <div className={`bias-badge ${biasAnalysis.politicalLeaning.toLowerCase().replace(/\s+/g, '-')}`}>
            {biasAnalysis.politicalLeaning}
          </div>
          
          <div className={`tone-badge ${biasAnalysis.tone.toLowerCase().replace(/\s+/g, '-')}`}>
            {biasAnalysis.tone}
          </div>
          
          {biasAnalysis.confidence && (
            <div className={`confidence-badge ${
              biasAnalysis.confidence >= 0.7 ? 'high' : 
              biasAnalysis.confidence >= 0.4 ? 'medium' : 'low'
            }`}>
              {biasAnalysis.confidence >= 0.7 ? 'High' : 
               biasAnalysis.confidence >= 0.4 ? 'Medium' : 'Low'} Confidence
            </div>
          )}
        </div>
      )}
      
      <div className="analysis-section">
        <h4 className="section-title">Political Bias</h4>
        {renderBiasGauge(analysis.bias.score)}
        <p className="section-explanation">{analysis.bias.explanation}</p>
      </div>
      
      <div className="analysis-section">
        <h4 className="section-title">Emotional Tone</h4>
        <div className="tone-tags">
          <span className="tone-tag primary">{analysis.tone.primary}</span>
          {analysis.tone.secondary && (
            <span className="tone-tag secondary">{analysis.tone.secondary}</span>
          )}
        </div>
        <p className="section-explanation">{analysis.tone.explanation}</p>
      </div>
      
      <div className="analysis-section">
        <h4 className="section-title">Factual Reporting</h4>
        {renderCredibilityBadge(analysis.factualReporting.rating)}
        <p className="section-explanation">{analysis.factualReporting.explanation}</p>
      </div>
      
      <div className="analysis-section">
        <h4 className="section-title">Credibility Assessment</h4>
        <p className="section-explanation">{analysis.credibility.explanation}</p>
      </div>
      
      <div className="analysis-section">
        <h4 className="section-title">Perspectives</h4>
        <div className="perspectives-container">
          <div className="perspectives-included">
            <h5>Included</h5>
            <ul className="perspectives-list">
              {analysis.perspectives.included.map((perspective, index) => (
                <li key={`included-${index}`}>{perspective}</li>
              ))}
            </ul>
          </div>
          
          <div className="perspectives-omitted">
            <h5>Potentially Omitted</h5>
            <ul className="perspectives-list">
              {analysis.perspectives.potentiallyOmitted.map((perspective, index) => (
                <li key={`omitted-${index}`}>{perspective}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="analysis-section">
        <h4 className="section-title">Overall Assessment</h4>
        <p className="overall-assessment">{analysis.overallAssessment}</p>
      </div>
    </div>
  );
};

export default AnalysisCard;
