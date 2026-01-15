import { Link } from 'react-router-dom';
import homepageVid from '../assets/homepagevid.mp4';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <video
          src={homepageVid}
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
        />
        <div className="hero-overlay"></div>
        <div className="hero-gradient"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Build Your Digital
            <span className="hero-highlight"> Future</span>
          </h1>
          <p className="hero-subtitle">
            We create custom websites and applications that drive results.
            From concept to launch, our team delivers modern technology with exceptional service.
          </p>
          <div className="hero-cta-group">
            <Link to="/configurator" className="hero-cta hero-cta-primary">
              Start Your Project
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/contact" className="hero-cta hero-cta-secondary">
              Book a Consultation
            </Link>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Fast Development</span>
            </div>
            <div className="hero-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Modern Technology</span>
            </div>
            <div className="hero-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Ongoing Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
