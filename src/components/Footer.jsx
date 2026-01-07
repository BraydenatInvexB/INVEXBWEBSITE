import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <Logo />
              <p className="footer-tagline">
                Building digital excellence through innovative software solutions.
              </p>
            </div>
            
            <div className="footer-links">
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
                  <a href="mailto:support@invexb.com">Contact Us</a>
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
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <span className="footer-separator">•</span>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              {!isAuthenticated && (
                <>
                  <span className="footer-separator">•</span>
                  <Link to="/login" className="footer-link footer-sign-in">Sign In</Link>
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
