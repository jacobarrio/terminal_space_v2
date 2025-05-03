import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getArticleById } from '../services/gnewsService';
import { analyzeArticle, compareArticles, getBiasToneAnalysis } from '../services/openaiService';
import '../styles/AnalysisView.css';

const AnalysisView = ({ isCompareMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [biasAnalysis, setBiasAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For compare mode
  const [articlesToCompare, setArticlesToCompare] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparingArticles, setComparingArticles] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);

  // Load article and analysis for single article mode
  useEffect(() => {
    if (isCompareMode) {
      setLoading(false);
      return;
    }
    
    const loadArticleAndAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Pass the ID directly to our API, which will handle decoding
        const articleData = await getArticleById(id);
        setArticle(articleData);
        
        if (articleData) {
          const content = articleData.content || articleData.description;
          
          // Request full analysis and bias/tone in parallel to speed up loading
          const [analysisData, biasData] = await Promise.all([
            analyzeArticle(content, articleData.title),
            getBiasToneAnalysis(content, articleData.title)
          ]);
          
          setAnalysis(analysisData);
          setBiasAnalysis(biasData);
        }
      } catch (err) {
        setError(`Failed to load article analysis: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticleAndAnalysis();
  }, [id, isCompareMode]);

  // Function to search for articles to compare
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSearchResults(data.articles || []);
    } catch (err) {
      setSearchError(`Search failed: ${err.message}`);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to add article to comparison list
  const addToComparison = (article) => {
    if (articlesToCompare.some(a => a.url === article.url)) {
      return; // Article already in list
    }
    
    setArticlesToCompare(prev => [...prev, article]);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Function to remove article from comparison list
  const removeFromComparison = (url) => {
    setArticlesToCompare(prev => prev.filter(a => a.url !== url));
  };

  // Function to run the comparison analysis
  const runComparison = async () => {
    if (articlesToCompare.length < 2) {
      setComparisonError('Please select at least two articles to compare');
      return;
    }
    
    setComparingArticles(true);
    setComparisonError(null);
    
    try {
      const result = await compareArticles(articlesToCompare);
      setComparison(result);
    } catch (err) {
      setComparisonError(`Comparison failed: ${err.message}`);
    } finally {
      setComparingArticles(false);
    }
  };

  // Format article source
  const formatSource = (source) => {
    if (!source || !source.name) return 'Unknown';
    return source.name.replace(/\.(com|org|net)$/i, '');
  };

  // Render single article analysis view
  const renderSingleAnalysis = () => {
    if (!article || !analysis) return null;
    
    // For bias/tone badges
    const hasBiasAnalysis = biasAnalysis && biasAnalysis.politicalLeaning && biasAnalysis.tone;
    
    return (
      <div className="single-analysis-container">
        <div className="analysis-header">
          <h1>Analysis of Article</h1>
          <h2 className="analyzed-title">{article.title}</h2>
          <div className="article-meta">
            <span className="article-source">{formatSource(article.source)}</span>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="view-original"
            >
              View Original <i data-feather="external-link"></i>
            </a>
          </div>
          
          {/* Quick bias/tone badges from new API */}
          {hasBiasAnalysis && (
            <div className="bias-tone-badges">
              <div className={`bias-badge ${biasAnalysis.politicalLeaning.toLowerCase().replace(/\s+/g, '-')}`}>
                {biasAnalysis.politicalLeaning}
              </div>
              <div className={`tone-badge ${biasAnalysis.tone.toLowerCase().replace(/\s+/g, '-')}`}>
                {biasAnalysis.tone}
              </div>
              {biasAnalysis.confidence >= 0.7 && (
                <div className="confidence-indicator high">
                  <i data-feather="check-circle"></i>
                  <span>High Confidence</span>
                </div>
              )}
              {biasAnalysis.confidence < 0.7 && biasAnalysis.confidence >= 0.4 && (
                <div className="confidence-indicator medium">
                  <i data-feather="help-circle"></i>
                  <span>Medium Confidence</span>
                </div>
              )}
              {biasAnalysis.confidence < 0.4 && (
                <div className="confidence-indicator low">
                  <i data-feather="alert-circle"></i>
                  <span>Low Confidence</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="analysis-sections">
          {hasBiasAnalysis && (
            <section className="analysis-section bias-tone-analysis">
              <h3>Quick Political Leaning & Tone Analysis</h3>
              <div className="bias-tone-grid">
                <div className="bias-tone-card">
                  <h4>Political Leaning</h4>
                  <div className={`bias-badge large ${biasAnalysis.politicalLeaning.toLowerCase().replace(/\s+/g, '-')}`}>
                    {biasAnalysis.politicalLeaning}
                  </div>
                </div>
                <div className="bias-tone-card">
                  <h4>Content Tone</h4>
                  <div className={`tone-badge large ${biasAnalysis.tone.toLowerCase().replace(/\s+/g, '-')}`}>
                    {biasAnalysis.tone}
                  </div>
                </div>
                {biasAnalysis.explanation && (
                  <div className="bias-tone-explanation">
                    <h4>Explanation</h4>
                    <p>{biasAnalysis.explanation}</p>
                  </div>
                )}
              </div>
            </section>
          )}
          
          <section className="analysis-section">
            <h3>Political Bias Analysis</h3>
            <div className="bias-visual">
              <div className="bias-scale">
                <div className="bias-marker left">Left</div>
                <div className="bias-marker center">Center</div>
                <div className="bias-marker right">Right</div>
              </div>
              <div className="bias-bar">
                <div 
                  className="bias-indicator" 
                  style={{ left: `${((analysis.bias.score + 5) / 10) * 100}%` }}
                ></div>
              </div>
              <div className="bias-value">{analysis.bias.score.toFixed(1)}</div>
            </div>
            <p className="analysis-text">{analysis.bias.explanation}</p>
          </section>
          
          <section className="analysis-section">
            <h3>Tone Analysis</h3>
            <div className="tone-tags">
              <span className="tone-tag primary">{analysis.tone.primary}</span>
              {analysis.tone.secondary && (
                <span className="tone-tag secondary">{analysis.tone.secondary}</span>
              )}
            </div>
            <p className="analysis-text">{analysis.tone.explanation}</p>
          </section>
          
          <section className="analysis-section">
            <h3>Factual Reporting Assessment</h3>
            <div className={`factual-badge ${analysis.factualReporting.rating.toLowerCase()}`}>
              {analysis.factualReporting.rating}
            </div>
            <p className="analysis-text">{analysis.factualReporting.explanation}</p>
          </section>
          
          <section className="analysis-section">
            <h3>Credibility Assessment</h3>
            <p className="analysis-text">{analysis.credibility.explanation}</p>
          </section>
          
          <section className="analysis-section">
            <h3>Perspective Analysis</h3>
            <div className="perspectives-grid">
              <div className="perspective-column included">
                <h4>Perspectives Included</h4>
                <ul className="perspective-list">
                  {analysis.perspectives.included.map((item, index) => (
                    <li key={`included-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="perspective-column omitted">
                <h4>Perspectives Potentially Omitted</h4>
                <ul className="perspective-list">
                  {analysis.perspectives.potentiallyOmitted.map((item, index) => (
                    <li key={`omitted-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          <section className="analysis-section overall">
            <h3>Overall Assessment</h3>
            <p className="analysis-text overall-text">{analysis.overallAssessment}</p>
          </section>
        </div>
        
        <div className="analysis-actions">
          <Link to={`/article/${id}`} className="back-to-article">
            <i data-feather="arrow-left"></i> Back to Article
          </Link>
        </div>
      </div>
    );
  };

  // Render comparison mode view
  const renderComparisonMode = () => {
    return (
      <div className="comparison-container">
        <div className="comparison-header">
          <h1>Compare News Articles</h1>
          <p className="comparison-intro">
            Select multiple articles to analyze differences in coverage, bias, and framing of similar topics.
          </p>
        </div>
        
        <div className="comparison-content">
          <div className="article-selection-panel">
            <h2>Select Articles to Compare</h2>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for news articles..."
                  className="search-input"
                />
                <button type="submit" className="search-button" disabled={isSearching}>
                  {isSearching ? <i data-feather="loader"></i> : <i data-feather="search"></i>}
                </button>
              </div>
            </form>
            
            {searchError && (
              <div className="search-error">
                <i data-feather="alert-circle"></i> {searchError}
              </div>
            )}
            
            {isSearching ? (
              <LoadingSpinner message="Searching articles..." />
            ) : searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.map((article, index) => (
                  <div key={index} className="search-result-item">
                    <div className="article-info">
                      <h3>{article.title}</h3>
                      <div className="article-meta">
                        <span className="source">{formatSource(article.source)}</span>
                        <span className="date">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="add-to-comparison" 
                      onClick={() => addToComparison(article)}
                    >
                      <i data-feather="plus"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery && !isSearching ? (
              <div className="no-results">
                No articles found. Try a different search term.
              </div>
            ) : null}
            
            <div className="selected-articles">
              <h2>Selected Articles {articlesToCompare.length > 0 && `(${articlesToCompare.length})`}</h2>
              
              {articlesToCompare.length === 0 ? (
                <div className="no-articles-selected">
                  <i data-feather="file-text"></i>
                  <p>No articles selected yet. Search and add articles to compare them.</p>
                </div>
              ) : (
                <div className="selected-articles-list">
                  {articlesToCompare.map((article, index) => (
                    <div key={index} className="selected-article-item">
                      <div className="article-info">
                        <h3>{article.title}</h3>
                        <div className="article-meta">
                          <span className="source">{formatSource(article.source)}</span>
                          <span className="date">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="remove-from-comparison" 
                        onClick={() => removeFromComparison(article.url)}
                      >
                        <i data-feather="x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {articlesToCompare.length >= 2 && (
                <button 
                  className="run-comparison-button"
                  onClick={runComparison}
                  disabled={comparingArticles}
                >
                  {comparingArticles ? (
                    <>Analyzing <i data-feather="loader"></i></>
                  ) : (
                    <>Compare Articles <i data-feather="bar-chart-2"></i></>
                  )}
                </button>
              )}
              
              {comparisonError && (
                <div className="comparison-error">
                  <i data-feather="alert-circle"></i> {comparisonError}
                </div>
              )}
            </div>
          </div>
          
          <div className="comparison-results">
            <h2>Comparison Analysis</h2>
            
            {comparingArticles ? (
              <LoadingSpinner message="Analyzing and comparing articles..." />
            ) : comparison ? (
              <div className="comparison-analysis">
                <section className="comparison-section">
                  <h3>Factual Differences</h3>
                  <p>{comparison.factualDifferences}</p>
                </section>
                
                <section className="comparison-section">
                  <h3>Tone Comparison</h3>
                  <p>{comparison.toneComparison}</p>
                </section>
                
                <section className="comparison-section">
                  <h3>Bias Assessment</h3>
                  <p>{comparison.biasAssessment}</p>
                </section>
                
                <section className="comparison-section">
                  <h3>Perspective Differences</h3>
                  <p>{comparison.perspectiveDifferences}</p>
                </section>
                
                <section className="comparison-section">
                  <h3>Information Gaps</h3>
                  <p>{comparison.informationGaps}</p>
                </section>
                
                <section className="comparison-section conclusion">
                  <h3>Overall Conclusion</h3>
                  <p>{comparison.overallConclusion}</p>
                </section>
              </div>
            ) : (
              <div className="no-comparison">
                <i data-feather="bar-chart-2"></i>
                <p>
                  {articlesToCompare.length < 2 
                    ? "Select at least two articles to generate a comparison analysis." 
                    : "Click 'Compare Articles' to analyze the selected articles."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Update feather icons when component renders
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  });

  if (loading) {
    return <LoadingSpinner message="Loading analysis..." />;
  }

  if (error && !isCompareMode) {
    return <ErrorMessage 
      message="Failed to load analysis" 
      details={error}
      retry={() => navigate(0)} 
    />;
  }

  return (
    <div className="analysis-view-container">
      {isCompareMode ? renderComparisonMode() : renderSingleAnalysis()}
    </div>
  );
};

export default AnalysisView;
