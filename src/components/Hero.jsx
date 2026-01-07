import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-pattern"></div>
      <div className="hero-container">
        <div className="hero-badge">Transform Your Ideas Into Reality</div>
        <h1 className="hero-title">
          Building Digital
          <span className="hero-highlight"> Excellence</span>
        </h1>
        <p className="hero-subtitle">
          We create powerful web and mobile applications that drive your business forward.
          Simple solutions, smart technology.
        </p>
        <div className="hero-cta-group">
          <Link to="/configurator" className="hero-cta primary">
            Start Your Project
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/contact" className="hero-cta secondary">
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

