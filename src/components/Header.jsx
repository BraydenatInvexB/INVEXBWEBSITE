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
          <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/services" onClick={closeMobileMenu}>Services</NavLink>
          <NavLink to="/configurator" onClick={closeMobileMenu}>Configurator</NavLink>
          <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin" onClick={closeMobileMenu}>Admin</NavLink>
          )}
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

