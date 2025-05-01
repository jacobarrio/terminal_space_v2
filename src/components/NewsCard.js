import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewsCard.css';

const NewsCard = ({ article, summary = "", isSearchResult = false }) => {
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

  if (!article) return null;

  return (
    <article className={`news-card ${isSearchResult ? 'search-result' : ''}`}>
      <div className="news-card-content">
        <div className="news-meta">
          <span className="news-source">{getSourceName(article.source)}</span>
          <span className="news-date">{formatDate(article.publishedAt)}</span>
        </div>
        
        <h2 className="news-title">
          <Link to={`/article/${getArticleId(article.url)}`}>{article.title}</Link>
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
            />
          </div>
        )}
        
        <p className="news-preview">{getPreview(article.content || article.description)}</p>
        
        <div className="news-actions">
          <Link to={`/article/${getArticleId(article.url)}`} className="read-more-link">
            Read More <i data-feather="chevron-right" className="icon-small"></i>
          </Link>
          
          <Link to={`/analysis/${getArticleId(article.url)}`} className="analysis-link">
            Analysis <i data-feather="bar-chart-2" className="icon-small"></i>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
