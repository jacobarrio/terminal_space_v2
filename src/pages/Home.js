import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AnimatedOverlay from '../components/AnimatedOverlay';
import AISummaryView from '../components/AISummaryView';
import AIInfoModal from '../components/AIInfoModal';
import { fetchTopNews, searchNews } from '../services/gnewsService';
import '../styles/Home.css';
import '../styles/ModernHeader.css';
import '../styles/AISummaryView.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const [summarized, setSummarized] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [cachedArticles, setCachedArticles] = useState({});
  const [viewPreference, setViewPreference] = useState('summary');
  const [showAISummary, setShowAISummary] = useState(false); // Toggle for AI Summary View
  const [showAIInfoModal, setShowAIInfoModal] = useState(false); // State for AI Info modal
  
  const searchInputRef = useRef(null);
  const cachedArticlesRef = useRef({});
  const navigate = useNavigate();
  
  // Get search params from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  
  // Categories for news filtering
  const categories = [
    'general', 'world', 'nation', 'business', 
    'technology', 'entertainment', 'sports', 
    'science', 'health', 'politics'
  ];

  // Load news articles based on search query or category
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      if (searchQuery) {
        // If there's a search query, use the search endpoint
        data = await searchNews(searchQuery);
        if (data.articles && Array.isArray(data.articles)) {
          // Ensure no duplicate articles by URL
          const uniqueUrls = new Set();
          const uniqueArticles = data.articles.filter(article => {
            if (!article.url || uniqueUrls.has(article.url)) {
              return false;
            }
            uniqueUrls.add(article.url);
            return true;
          });
          
          setArticles(uniqueArticles);
        } else {
          setArticles([]);
        }
      } else {
        // Otherwise load top news by category
        data = await fetchTopNews(category);
        if (data.articles && Array.isArray(data.articles)) {
          // Ensure no duplicate articles by URL
          const uniqueUrls = new Set();
          const uniqueArticles = data.articles.filter(article => {
            if (!article.url || uniqueUrls.has(article.url)) {
              return false;
            }
            uniqueUrls.add(article.url);
            return true;
          });
          
          setArticles(uniqueArticles);
        } else {
          setArticles([]);
        }
      }
    } catch (err) {
      setError(`Failed to load news: ${err.message}`);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category]);

  // Initial load and reload when search or category changes
  useEffect(() => {
    loadNews();
  }, [searchQuery, category, loadNews]);

  // When feather icons are in the DOM, replace them with SVG
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [articles, loading, showMobileFilters, viewPreference, showAISummary]);

  // Initialize searchInput from URL query param
  useEffect(() => {
    if (searchQuery) {
      setSearchInput(searchQuery);
    }
  }, [searchQuery]);

  // Handle local storage caching
  useEffect(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Try to load cached articles
        const cachedData = localStorage.getItem('terminal_space_articles');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if cache is valid (less than 24 hours old)
          if (parsed.timestamp && (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000)) {
            const articles = parsed.articles || {};
            setCachedArticles(articles);
            // Update ref to match state
            cachedArticlesRef.current = articles;
          } else {
            // Clear expired cache
            localStorage.removeItem('terminal_space_articles');
          }
        }
      } catch (e) {
        console.error('Error reading from localStorage', e);
      }
    }
  }, []);

  // Update state when the ref changes
  useEffect(() => {
    // Keep state in sync with the ref (which is stable)
    setCachedArticles(cachedArticlesRef.current);
  }, []);

  // Update cache when articles change - Use a stable ref to avoid dependency cycles
  useEffect(() => {
    if (articles.length > 0 && typeof window !== 'undefined' && window.localStorage) {
      try {
        // Use the ref for stable access to current value
        const currentCache = cachedArticlesRef.current;
        const existingUrls = new Set(Object.keys(currentCache));
        const articleUrls = articles.map(article => article.url).filter(Boolean);
        const hasNewArticles = articleUrls.some(url => !existingUrls.has(url));
        
        if (hasNewArticles) {
          const timestamp = Date.now();
          const articleCache = { ...currentCache };
          
          // Add or update articles in cache
          articles.forEach(article => {
            if (article.url) {
              articleCache[article.url] = {
                ...article,
                cached: timestamp
              };
            }
          });
          
          // Store in localStorage with timestamp
          localStorage.setItem('terminal_space_articles', JSON.stringify({
            articles: articleCache,
            timestamp
          }));
          
          // Update the ref directly (stable, won't trigger re-renders)
          cachedArticlesRef.current = articleCache;
          // Then update the state once (for UI updates)
          setCachedArticles(articleCache);
        }
      } catch (e) {
        console.error('Error writing to localStorage', e);
      }
    }
  }, [articles]);

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setShowMobileFilters(false); // Close mobile filters after selection
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Update the URL with the search query
      navigate(`/?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      // If search is empty, go back to regular view
      navigate('/');
    }
  };
  
  // Toggle mobile filters visibility
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };
  
  // Toggle between summary and full view
  const toggleViewPreference = () => {
    setViewPreference(viewPreference === 'summary' ? 'full' : 'summary');
  };
  
  // Toggle AI Summary view
  const toggleAISummary = () => {
    setShowAISummary(!showAISummary);
  };

  // Render category filters with modern pill design
  const renderCategoryFilters = () => {
    return (
      <div className={`category-filters ${showMobileFilters ? 'mobile-expanded' : ''}`}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter ${cat === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    );
  };
  
  // Render search bar with glassmorphism and animation effects
  const renderSearchBar = () => {
    return (
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            ref={searchInputRef}
          />
          <i data-feather="search"></i>
          
          {searchInput && (
            <button 
              type="button" 
              className="search-clear-button"
              onClick={() => {
                setSearchInput('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <i data-feather="x"></i>
            </button>
          )}
          
          <button type="submit" className="search-submit-button">
            <span className="hidden-mobile">Search</span>
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="home-container">
      <div className="page-header">
        <div className="header-content glass-panel">
          <div className="header-main">
            {searchQuery ? (
              <h1 className="page-title">Search Results: "{searchQuery}"</h1>
            ) : (
              <div className="title-with-button">
                <h1 className="page-title">Latest News</h1>
                <button 
                  className="ai-info-button gold-interactive"
                  onClick={() => setShowAIInfoModal(true)}
                  aria-label="Learn how Terminal Space uses AI"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ai-icon">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.28 13.61C15.15 14.74 13.53 15.09 12.1 14.64L9.51001 17.22C9.33001 17.41 8.96001 17.53 8.69001 17.49L7.49001 17.33C7.09001 17.28 6.73001 16.9 6.67001 16.51L6.51001 15.31C6.47001 15.05 6.60001 14.68 6.78001 14.49L9.36001 11.91C8.92001 10.48 9.26001 8.86001 10.39 7.73001C12.01 6.11001 14.65 6.11001 16.28 7.73001C17.9 9.34001 17.9 11.98 16.28 13.61Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.45 16.28L9.60001 15.42" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.3945 10.7H13.4035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  AI Summary
                </button>
              </div>
            )}
          </div>
          
          <div className="header-controls">
            {renderSearchBar()}
            
            {!searchQuery && (
              <div className="filters-container">
                <h3 className="section-subheader">Categories</h3>
                {renderCategoryFilters()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading news articles..." />
      ) : error ? (
        <ErrorMessage 
          message={error} 
          retry={loadNews} 
        />
      ) : articles.length === 0 && Object.keys(cachedArticles).length === 0 ? (
        <div className="no-results">
          <i data-feather="search"></i>
          <h2>No articles found</h2>
          {searchQuery && <p>Try a different search term or browse the latest news.</p>}
          {!searchQuery && <p>No articles available in this category. Try another category.</p>}
        </div>
      ) : (
        <>
          {/* Offline notice when using cached articles */}
          {articles.length === 0 && Object.keys(cachedArticles).length > 0 && (
            <div className="offline-notice">
              <i data-feather="wifi-off" className="icon-small"></i>
              <p>You're viewing cached articles. Some content may be outdated.</p>
            </div>
          )}
          
          {/* Toggle between AI Summary view and regular news cards */}
          {showAISummary ? (
            <div className="ai-summary-container">
              <AISummaryView articles={articles.length > 0 ? articles : Object.values(cachedArticles)} />
            </div>
          ) : (
            <div className="news-cards-grid">
              {/* Show live articles first */}
              {articles.map((article, index) => (
                <NewsCard 
                  key={article._id || `${article.url}-${index}-${Date.now()}`} 
                  article={article}
                  summary={summarized[article.url]}
                  isSearchResult={!!searchQuery}
                  analysis={null} // Will be implemented in the LLM improvements section
                  className="stagger-item"
                />
              ))}
              
              {/* Show cached articles when offline */}
              {articles.length === 0 && 
                Object.values(cachedArticles)
                  .sort((a, b) => b.cached - a.cached) // Most recently cached first
                  .map((article, index) => (
                    <NewsCard 
                      key={article._id || `${article.url}-cached-${index}-${Date.now()}`} 
                      article={article}
                      summary={summarized[article.url]}
                      isSearchResult={false}
                      analysis={null}
                      className="stagger-item cached-item"
                    />
                  ))
              }
            </div>
          )}
        </>
      )}
      
      {/* AI Info Modal */}
      <AIInfoModal 
        isOpen={showAIInfoModal} 
        onClose={() => setShowAIInfoModal(false)} 
      />
    </div>
  );
};

export default Home;
