import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Header.css';

function Header() {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <Logo />
        </Link>
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Desktop Navigation */}
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/configurator">Configurator</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin">Admin</NavLink>
          )}
          
          {/* Mobile Navigation */}
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-menu-logo" onClick={closeMobileMenu}>
              <Logo />
            </Link>
            <button 
              className="mobile-menu-close-btn" 
              onClick={closeMobileMenu}
              aria-label="Close menu"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="mobile-menu-items">
            <NavLink to="/" end onClick={closeMobileMenu} className="mobile-menu-item">
              <span>Home</span>
            </NavLink>
            <NavLink to="/services" onClick={closeMobileMenu} className="mobile-menu-item">
              <span>Services</span>
            </NavLink>
            <NavLink to="/configurator" onClick={closeMobileMenu} className="mobile-menu-item">
              <span>Configurator</span>
            </NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className="mobile-menu-item">
              <span>Contact</span>
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/admin" onClick={closeMobileMenu} className="mobile-menu-item">
                <span>Admin</span>
              </NavLink>
            )}
          </div>
        </nav>
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      </div>
    </header>
  );
}

export default Header;

