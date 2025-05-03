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
  // State to manage dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user previously set dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || 
           (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

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
