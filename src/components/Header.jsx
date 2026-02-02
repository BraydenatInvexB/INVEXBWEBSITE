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

        <nav className="nav desktop-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/marketing">Marketing</NavLink>
          <NavLink to="/configurator">Configurator</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </nav>

        <div className="header-actions">
          <Link to="/configurator" className="header-cta">
            Start Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'hidden' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-menu-logo" onClick={closeMobileMenu}>
              <Logo />
            </Link>
            <button
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <nav className="mobile-menu-nav">
            <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/services" onClick={closeMobileMenu}>Services</NavLink>
            <NavLink to="/marketing" onClick={closeMobileMenu}>Marketing</NavLink>
            <NavLink to="/configurator" onClick={closeMobileMenu}>Configurator</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
            {isAuthenticated && (
              <NavLink to="/admin" onClick={closeMobileMenu}>Admin</NavLink>
            )}
          </nav>
          <div className="mobile-menu-cta">
            <Link to="/configurator" className="mobile-cta-button" onClick={closeMobileMenu}>
              Start Your Project
            </Link>
          </div>
        </div>
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
