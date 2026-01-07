import { Link } from 'react-router-dom';
import './Services.css';

// Format price for South African Rand
const formatPrice = (price) => {
  if (price.includes('p/m')) {
    const amount = price.replace('R', '').replace('p/m', '').trim();
    return `R${parseInt(amount).toLocaleString('en-ZA')}/mo`;
  }
  const amount = price.replace('R', '').trim();
  return `R${parseInt(amount).toLocaleString('en-ZA')}`;
};

function Services() {
  const services = [
    {
      title: 'Website Creation',
      description: 'Custom websites built with modern technologies, optimized for performance and user experience.',
      price: 'R9999',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #0e42d0 0%, #1452f0 100%)'
    },
    {
      title: 'Web Application Development',
      description: 'Scalable web applications that solve complex business challenges with elegant solutions.',
      price: 'R19999',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #1452f0 0%, #4d7ff3 100%)'
    },
    {
      title: 'Mobile Application Development',
      description: 'Native and cross-platform mobile apps that deliver seamless experiences on iOS and Android.',
      price: 'R19999',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #4d7ff3 0%, #6b95f5 100%)'
    },
    {
      title: 'Maintenance',
      description: 'Comprehensive maintenance and support services to keep your applications running smoothly.',
      price: 'R2999p/m',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6b95f5 0%, #8aaff7 100%)'
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-background"></div>
      <div className="services-container">
        <div className="services-header">
          <span className="services-badge">What We Offer</span>
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">
            We deliver comprehensive software solutions tailored to your needs
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon-wrapper" style={{ background: service.gradient }}>
                <div className="service-icon">{service.icon}</div>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <div className="service-price">
                <span className="service-price-amount">{formatPrice(service.price)}</span>
                {service.price.includes('p/m') && <span className="service-price-period">per month</span>}
              </div>
              <p className="service-description">{service.description}</p>
              <Link to="/services" className="service-link">
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
