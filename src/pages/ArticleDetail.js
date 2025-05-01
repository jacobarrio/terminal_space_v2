import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AnalysisCard from '../components/AnalysisCard';
import { getArticleById } from '../services/gnewsService';
import { summarizeArticle, analyzeArticle } from '../services/openaiService';
import '../styles/ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState({ article: true, summary: false, analysis: false });
  const [error, setError] = useState({ article: null, summary: null, analysis: null });
  const [showFullContent, setShowFullContent] = useState(false);

  // Decode the ID (which is base64 encoded URL)
  // Make sure id is a string before trying to decode
  const decodedId = id ? atob(id.replace(/-/g, '+').replace(/_/g, '/')) : '';

  // Load article data
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(prev => ({ ...prev, article: true }));
      setError(prev => ({ ...prev, article: null }));
      
      try {
        const data = await getArticleById(decodedId);
        setArticle(data);
        
        // Automatically start summarization when article loads
        if (data && (data.content || data.description)) {
          handleSummarize(data);
        }
      } catch (err) {
        setError(prev => ({ 
          ...prev, 
          article: `Failed to load article: ${err.message}` 
        }));
      } finally {
        setLoading(prev => ({ ...prev, article: false }));
      }
    };
    
    loadArticle();
  }, [decodedId]);

  // Function to generate article summary
  const handleSummarize = async (articleData) => {
    setLoading(prev => ({ ...prev, summary: true }));
    setError(prev => ({ ...prev, summary: null }));
    
    try {
      const content = articleData.content || articleData.description;
      const result = await summarizeArticle(content, articleData.title);
      setSummary(result.summary);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        summary: `Failed to generate summary: ${err.message}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Function to analyze article content
  const handleAnalyze = async () => {
    if (!article) return;
    
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(prev => ({ ...prev, analysis: null }));
    
    try {
      const content = article.content || article.description;
      const result = await analyzeArticle(content, article.title);
      setAnalysis(result);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        analysis: `Failed to analyze article: ${err.message}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  // Format publication date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get source name and format it nicely
  const getSourceName = (source) => {
    if (!source || !source.name) return 'Unknown Source';
    return source.name.replace(/\.(com|org|net)$/i, '');
  };

  if (loading.article) {
    return <LoadingSpinner message="Loading article..." />;
  }

  if (error.article) {
    return <ErrorMessage 
      message="Unable to load article" 
      details={error.article}
      retry={() => navigate(0)} // Refresh the page
    />;
  }

  if (!article) {
    return <ErrorMessage message="Article not found" />;
  }

  return (
    <div className="article-detail-container">
      <div className="article-actions-top">
        <Link to="/" className="back-button">
          <i data-feather="arrow-left"></i> Back to News
        </Link>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="original-link"
        >
          View Original <i data-feather="external-link"></i>
        </a>
      </div>
      
      <article className="article-content">
        <div className="article-meta">
          <span className="article-source">{getSourceName(article.source)}</span>
          <span className="article-date">{formatDate(article.publishedAt)}</span>
        </div>
        
        <h1 className="article-title">{article.title}</h1>
        
        {article.image && (
          <div className="article-image-container">
            <img 
              src={article.image} 
              alt={article.title} 
              className="article-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="article-summary-section">
          <h2 className="section-heading">
            <i data-feather="file-text"></i> AI Summary
          </h2>
          
          {loading.summary ? (
            <div className="summary-loading">
              <LoadingSpinner message="Generating summary..." />
            </div>
          ) : error.summary ? (
            <div className="summary-error">
              <ErrorMessage 
                message="Failed to generate summary" 
                details={error.summary}
                retry={() => handleSummarize(article)}
              />
            </div>
          ) : summary ? (
            <div className="article-summary">
              {summary}
            </div>
          ) : (
            <div className="summary-placeholder">
              <button 
                className="generate-button"
                onClick={() => handleSummarize(article)}
              >
                Generate Summary
              </button>
            </div>
          )}
        </div>
        
        <div className="article-original-section">
          <h2 className="section-heading">
            <i data-feather="book-open"></i> Original Content
          </h2>
          
          <div className={`article-original-content ${showFullContent ? 'expanded' : ''}`}>
            {article.content || article.description || 'No content available'}
          </div>
          
          {(article.content || article.description) && !showFullContent && (
            <button 
              className="show-more-button"
              onClick={() => setShowFullContent(true)}
            >
              Show Full Content <i data-feather="chevron-down"></i>
            </button>
          )}
        </div>
        
        <div className="article-analysis-section">
          <h2 className="section-heading">
            <i data-feather="bar-chart-2"></i> Content Analysis
          </h2>
          
          {loading.analysis ? (
            <div className="analysis-loading">
              <LoadingSpinner message="Analyzing content..." />
            </div>
          ) : error.analysis ? (
            <div className="analysis-error">
              <ErrorMessage 
                message="Failed to analyze content" 
                details={error.analysis}
                retry={handleAnalyze}
              />
            </div>
          ) : analysis ? (
            <AnalysisCard analysis={analysis} />
          ) : (
            <div className="analysis-placeholder">
              <button 
                className="generate-button"
                onClick={handleAnalyze}
              >
                Analyze Content
              </button>
              <p className="analysis-info">
                This will analyze the article for bias, tone, and factual reporting.
              </p>
            </div>
          )}
        </div>
      </article>
      
      <div className="article-actions-bottom">
        <Link to="/" className="back-button">
          <i data-feather="arrow-left"></i> Back to News
        </Link>
        
        <Link to={`/analysis/${id}`} className="full-analysis-button">
          <i data-feather="layers"></i> Full Analysis
        </Link>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="original-link"
        >
          View Original <i data-feather="external-link"></i>
        </a>
      </div>
    </div>
  );
};

export default ArticleDetail;
