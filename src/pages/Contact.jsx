import { Link } from 'react-router-dom';
import Contact from '../components/Contact';
import './ContactPage.css';

function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-container">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            Have a project in mind? Let's discuss how we can bring your vision to life
          </p>
        </div>
      </section>
      
      <Contact />
      
      <section className="contact-info-section">
        <div className="contact-info-container">
          <div className="info-cards">
            <div className="info-card">
              <h3>Email Us</h3>
              <p>For general inquiries and support</p>
              <a href="mailto:support@invexb.com">support@invexb.com</a>
            </div>
            
            <div className="info-card">
              <h3>Quick Response</h3>
              <p>We typically respond within 24 hours</p>
              <span className="info-highlight">24/7 Support Available</span>
            </div>
            
            <div className="info-card">
              <h3>Start Your Project</h3>
              <p>Ready to get started?</p>
              <Link to="/configurator" className="info-link">Use Our Configurator</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
