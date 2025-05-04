import React, { useState, useEffect } from 'react';
import '../styles/AISummaryView.css';

/**
 * AI Summary View component - Shows an AI-generated summary of top articles
 * Displays a clean panel with summary, sentiment analysis, and key highlights
 * Features futuristic design with glassmorphism and golden accents
 */
const AISummaryView = ({ articles = [] }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Get the top 5 articles for summarization
  const topArticles = articles.slice(0, 5);
  
  // Sample sentiment analysis (would be replaced by actual API call in production)
  const getSentiment = () => {
    const sentiments = ['Positive', 'Neutral', 'Negative'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  };
  
  // Determine overall sentiment based on the top articles
  const overallSentiment = getSentiment();
  
  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get sentiment class for styling
  const getSentimentClass = (sentiment) => {
    switch(sentiment) {
      case 'Positive':
        return 'sentiment-positive';
      case 'Negative':
        return 'sentiment-negative';
      default:
        return 'sentiment-neutral';
    }
  };
  
  // Generate sample highlights (would be replaced by actual AI generation)
  const generateHighlights = (articles) => {
    if (!articles || articles.length === 0) {
      return ['No articles available for summarization'];
    }
    
    // Create highlights based on article titles
    return articles.map(article => 
      article.title ? 
        `${article.title.split(' ').slice(0, 6).join(' ')}...` : 
        'Unable to generate highlight'
    );
  };
  
  const highlights = generateHighlights(topArticles);
  
  return (
    <div className={`ai-summary-view glass-panel ${isVisible ? 'visible' : ''}`}>
      <div className="summary-header">
        <div className="header-title-container">
          <div className="ai-icon-large">
            <span className="ai-core"></span>
            <span className="ai-ring"></span>
          </div>
          <h2>Terminal Space AI Summary</h2>
        </div>
        <div className={`sentiment-badge ${getSentimentClass(overallSentiment)}`}>
          <span className="sentiment-icon"></span>
          <span className="sentiment-text">{overallSentiment}</span>
        </div>
      </div>
      
      <div className="summary-content">
        <div className="summary-section">
          <h3 className="section-title">Today's Overview</h3>
          <p className="summary-text">
            {topArticles.length > 0 ? (
              `Today's top stories focus on ${topArticles[0]?.title?.split(' ').slice(0, 3).join(' ') || 'current events'}, 
              with important developments in ${topArticles[1]?.title?.split(' ').slice(0, 2).join(' ') || 'various sectors'} 
              and potential implications for ${topArticles[2]?.title?.split(' ').slice(0, 2).join(' ') || 'global affairs'}.`
            ) : (
              'No articles available for summarization.'
            )}
          </p>
        </div>
        
        <div className="summary-highlights">
          <h3 className="section-title">Key Stories</h3>
          <ul className="highlights-list">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="highlight-item">
                <span className="highlight-bullet">•</span>
                <span className="highlight-text">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {topArticles.length > 3 && (
          <div className="summary-topics">
            <h3 className="section-title">Also Trending</h3>
            <div className="topics-grid">
              {highlights.slice(3).map((topic, index) => (
                <div key={index + 3} className="topic-pill">
                  {topic.split(' ').slice(0, 3).join(' ')}...
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="summary-footer">
        <div className="data-metrics">
          <div className="metric">
            <span className="metric-value">{articles.length}</span>
            <span className="metric-label">Sources</span>
          </div>
          <div className="metric">
            <span className="metric-value">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span className="metric-label">Last Updated</span>
          </div>
        </div>
        <div className="ai-attribution">
          <div className="ai-icon">
            <span className="ai-pulse"></span>
          </div>
          <span>Powered by Terminal Space AI</span>
        </div>
      </div>
    </div>
  );
};

export default AISummaryView;