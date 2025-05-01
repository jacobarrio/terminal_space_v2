import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-terminal">Terminal</span>
            <span className="logo-space">Space</span>
          </Link>
        </div>
        
        <div className="mobile-icons">
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode} 
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i data-feather={darkMode ? 'sun' : 'moon'}></i>
          </button>
          
          <button 
            className="menu-toggle" 
            onClick={toggleMenu} 
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <i data-feather={isMenuOpen ? 'x' : 'menu'}></i>
          </button>
        </div>

        <nav className={`main-nav ${isMenuOpen ? 'menu-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/compare" onClick={closeMenu}>Compare Articles</Link>
            </li>
            <li className="nav-item search-container">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button" aria-label="Search">
                  <i data-feather="search"></i>
                </button>
              </form>
            </li>
            <li className="nav-item desktop-only">
              <button 
                className="dark-mode-toggle" 
                onClick={toggleDarkMode} 
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <i data-feather={darkMode ? 'sun' : 'moon'}></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
