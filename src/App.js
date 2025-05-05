import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AnalysisView from './pages/AnalysisView';
import Header from './components/Header';
import ImmersiveBackground from './components/ImmersiveBackground';
import './styles/GlobalStyles.css';
import './styles/GoldInteractiveElements.css';
import './styles/GoldenBackgroundEffect.css'; // Import the new global background effects

const App = () => {
  // State to manage dark mode - button removed, setting default mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check system preference or default to true
    return window.matchMedia('(prefers-color-scheme: dark)').matches || true;
  });

  // Apply dark mode class to body - always enabled
  useEffect(() => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  }, []);

  // Function placeholder to maintain API compatibility
  const toggleDarkMode = () => {
    // Functionality removed as buttons have been removed
    console.log('Dark mode toggle removed');
  };

  // Listen for scroll events to apply parallax effects
  useEffect(() => {
    const handleScroll = () => {
      // Apply any scroll-based effects here if needed
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Immersive background that appears on all pages */}
        <ImmersiveBackground />
        
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/analysis/:id" element={<AnalysisView />} />
            <Route path="/compare" element={<AnalysisView isCompareMode={true} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
