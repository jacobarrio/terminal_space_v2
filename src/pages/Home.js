import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchTopNews, searchNews } from '../services/gnewsService';
import '../styles/Home.css';

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
  
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Get search params from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  
  // Categories for news filtering
  const categories = [
    'general', 'world', 'nation', 'business', 
    'technology', 'entertainment', 'sports', 
    'science', 'health'
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
        if (data.articles) {
          setArticles(data.articles);
        } else {
          setArticles([]);
        }
      } else {
        // Otherwise load top news by category
        data = await fetchTopNews(category);
        if (data.articles) {
          setArticles(data.articles);
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
  }, [loadNews]);

  // When feather icons are in the DOM, replace them with SVG
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [articles, loading, showMobileFilters, viewPreference]);

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
            setCachedArticles(parsed.articles || {});
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

  // Update cache when articles change
  useEffect(() => {
    if (articles.length > 0 && typeof window !== 'undefined' && window.localStorage) {
      try {
        const articleCache = { ...cachedArticles };
        
        // Add or update articles in cache
        articles.forEach(article => {
          if (article.url) {
            articleCache[article.url] = {
              ...article,
              cached: Date.now()
            };
          }
        });
        
        // Store in localStorage with timestamp
        localStorage.setItem('terminal_space_articles', JSON.stringify({
          articles: articleCache,
          timestamp: Date.now()
        }));
        
        // Update state
        setCachedArticles(articleCache);
      } catch (e) {
        console.error('Error writing to localStorage', e);
      }
    }
  }, [articles, cachedArticles]);

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

  // Render category filters
  const renderCategoryFilters = () => {
    return (
      <div className={`category-filters ${showMobileFilters ? 'mobile-expanded' : ''}`}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-button ${cat === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    );
  };
  
  // Render search bar
  const renderSearchBar = () => {
    return (
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search news..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
            ref={searchInputRef}
          />
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
              <i data-feather="x" className="icon-small"></i>
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          <i data-feather="search" className="icon-small"></i>
          <span className="hidden-mobile">Search</span>
        </button>
      </form>
    );
  };

  return (
    <div className="home-container">
      <div className="page-header">
        <div className="header-top">
          {searchQuery ? (
            <h1 className="page-title slide-down">Search Results: "{searchQuery}"</h1>
          ) : (
            <h1 className="page-title slide-down">Latest News</h1>
          )}
          
          <div className="header-actions fade-in">
            <button 
              className={`view-toggle-button ${viewPreference === 'full' ? 'active' : ''}`}
              onClick={toggleViewPreference}
              aria-label={`Switch to ${viewPreference === 'summary' ? 'full' : 'summary'} view`}
            >
              <i data-feather={viewPreference === 'summary' ? 'maximize-2' : 'minimize-2'} className="icon-small"></i>
              <span className="hidden-mobile">{viewPreference === 'summary' ? 'Full View' : 'Summary View'}</span>
            </button>
            
            <button 
              className={`filter-toggle-button ${showMobileFilters ? 'active' : ''}`}
              onClick={toggleMobileFilters}
              aria-label="Toggle filters"
            >
              <i data-feather="filter" className="icon-small"></i>
              <span className="hidden-mobile">Filters</span>
            </button>
          </div>
        </div>
        
        <div className="header-controls">
          {renderSearchBar()}
          
          {!searchQuery && (
            <div className="filters-container">
              <div className="mobile-filter-label" onClick={toggleMobileFilters}>
                <span>Categories</span>
                <i data-feather={showMobileFilters ? 'chevron-up' : 'chevron-down'} className="icon-small"></i>
              </div>
              {renderCategoryFilters()}
            </div>
          )}
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
          
          <div className="news-cards-grid">
            {/* Show live articles first */}
            {articles.map((article, index) => (
              <NewsCard 
                key={article.url || index} 
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
                    key={article.url || index} 
                    article={article}
                    summary={summarized[article.url]}
                    isSearchResult={false}
                    analysis={null}
                    className="stagger-item cached-item"
                  />
                ))
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
