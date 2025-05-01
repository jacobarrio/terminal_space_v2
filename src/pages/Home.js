import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
  }, [articles, loading]);

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  // Render category filters
  const renderCategoryFilters = () => {
    return (
      <div className="category-filters">
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

  return (
    <div className="home-container">
      <div className="page-header">
        {searchQuery ? (
          <h1 className="page-title">Search Results: "{searchQuery}"</h1>
        ) : (
          <h1 className="page-title">Latest News</h1>
        )}
        
        {!searchQuery && renderCategoryFilters()}
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading news articles..." />
      ) : error ? (
        <ErrorMessage 
          message={error} 
          retry={loadNews} 
        />
      ) : articles.length === 0 ? (
        <div className="no-results">
          <i data-feather="search"></i>
          <h2>No articles found</h2>
          {searchQuery && <p>Try a different search term or browse the latest news.</p>}
          {!searchQuery && <p>No articles available in this category. Try another category.</p>}
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article, index) => (
            <NewsCard 
              key={article.url || index} 
              article={article}
              summary={summarized[article.url]}
              isSearchResult={!!searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
