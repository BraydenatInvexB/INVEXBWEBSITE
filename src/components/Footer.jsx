import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo />
              <p className="footer-tagline">
                Building digital excellence through innovative software solutions. We help businesses grow with modern technology and exceptional service.
              </p>
              <div className="footer-social">
                <a href="mailto:support@invexb.com" className="social-link" aria-label="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/invexb_pty_ltd/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links-grid">
              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <nav className="footer-nav">
                  <Link to="/">Home</Link>
                  <Link to="/services">Services</Link>
                  <Link to="/contact">Contact</Link>
                </nav>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Services</h4>
                <nav className="footer-nav">
                  <Link to="/services">Website Creation</Link>
                  <Link to="/services">Web Applications</Link>
                  <Link to="/services">Mobile Apps</Link>
                  <Link to="/services">Maintenance</Link>
                </nav>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Get Started</h4>
                <nav className="footer-nav">
                  <Link to="/configurator">Project Configurator</Link>
                  <Link to="/contact">Contact Us</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} INVEXB PTY LTD. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="footer-separator">•</span>
              <Link to="/terms">Terms of Service</Link>
              {!isAuthenticated && (
                <>
                  <span className="footer-separator">•</span>
                  <Link to="/login" className="footer-sign-in">Sign In</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
