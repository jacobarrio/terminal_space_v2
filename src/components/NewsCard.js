import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewsCard.css';

const NewsCard = ({ 
  article, 
  summary = "", 
  isSearchResult = false,
  analysis = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Format publication date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Extract article ID from URL for routing
  const getArticleId = (url) => {
    // Using URL as a simple ID for demo purposes
    // In a production app, we'd use a proper ID system
    // For safety, base64 encode the URL to avoid path-to-regexp issues
    return btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  // Find the first sentence for preview if no summary
  const getPreview = (content) => {
    if (summary) return summary;
    
    const firstSentence = content?.split(/[.!?]/).filter(s => s.trim().length > 0)[0] || '';
    return firstSentence.length > 120 ? firstSentence.substring(0, 120) + '...' : firstSentence + '...';
  };

  // Get source name and format it nicely
  const getSourceName = (source) => {
    if (!source || !source.name) return 'Unknown Source';
    return source.name.replace(/\.(com|org|net)$/i, '');
  };

  // Handle share functionality
  const handleShare = () => {
    // Check if native sharing is available
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: getPreview(article.content || article.description),
        url: article.url,
      })
      .catch(error => {
        console.error('Error sharing:', error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  };

  // Fallback for browsers that don't support the Share API
  const fallbackShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(article.url)
      .then(() => {
        alert('Link copied to clipboard!');
        setShowShareOptions(false);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  // Toggle expanded view
  const toggleView = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // Initialize feather icons after component mounts
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }, [isExpanded, showShareOptions]);

  if (!article) return null;

  return (
    <article className={`news-card stagger-item ${isSearchResult ? 'search-result' : ''}`}>
      <div className="news-card-content">
        <div className="news-meta">
          <span className="news-source">{getSourceName(article.source)}</span>
          <span className="news-date">{formatDate(article.publishedAt)}</span>
        </div>
        
        {/* Analysis Tags/Badges */}
        {analysis && (
          <div className="news-tags">
            {analysis.politicalLeaning && (
              <span className={`badge badge-${analysis.politicalLeaning.toLowerCase()}`}>
                {analysis.politicalLeaning}
              </span>
            )}
            {analysis.tone && (
              <span className={`badge badge-${analysis.tone.toLowerCase()}`}>
                {analysis.tone}
              </span>
            )}
          </div>
        )}
        
        <h2 className="news-title">
          <Link to={`/article/${getArticleId(article.url)}`} className="gold-interactive">{article.title}</Link>
        </h2>
        
        {article.image && (
          <div className="news-image-container">
            <img 
              src={article.image} 
              alt={article.title} 
              className="news-image"
              onError={(e) => {
                e.target.style.display = 'none'; // Hide image on error
              }}
              loading="lazy"
            />
          </div>
        )}
        
        {/* Show preview text when not expanded */}
        {!isExpanded && (
          <p className="news-preview">{getPreview(article.content || article.description)}</p>
        )}
        
        {/* Expanded full content view */}
        <div className={`news-full-content ${isExpanded ? 'expanded' : ''}`}>
          <p>{article.content || article.description}</p>
        </div>
        
        <div className="news-actions">
          <div>
            <Link to={`/article/${getArticleId(article.url)}`} className="read-more-link gold-interactive gold-cta">
              Read Full Article <i data-feather="external-link" className="icon-small"></i>
            </Link>
            
            <button 
              className={`toggle-view-button ${isExpanded ? 'expanded' : ''} gold-interactive`} 
              onClick={toggleView}
              aria-label={isExpanded ? "Show less" : "Show more"}
            >
              {isExpanded ? "Show Less" : "Show More"} 
              <i data-feather="chevron-down" className="icon-small icon-toggle"></i>
            </button>
          </div>
          
          <div className="flex gap-sm">
            <Link to={`/analysis/${getArticleId(article.url)}`} className="analysis-link gold-interactive">
              Analysis <i data-feather="bar-chart-2" className="icon-small"></i>
            </Link>
            
            <button 
              className="share-button gold-interactive" 
              onClick={handleShare}
              aria-label="Share this article"
            >
              <i data-feather="share-2" className="icon-small"></i>
            </button>
            
            {/* Share options dropdown */}
            {showShareOptions && (
              <div className="share-options">
                <button onClick={copyToClipboard} className="button-text">
                  <i data-feather="clipboard" className="icon-small"></i> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
