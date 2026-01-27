import { Link } from 'react-router-dom';
import './Services.css';

const formatPrice = (price) => {
  if (price.includes('p/m')) {
    const amount = price.replace('R', '').replace('p/m', '').trim();
    return `R${parseInt(amount).toLocaleString('en-ZA')}`;
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
      startingFrom: true,
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Web Applications',
      description: 'Scalable web applications that solve complex business challenges with elegant solutions.',
      price: 'R19999',
      startingFrom: true,
      features: ['Custom Backend', 'Database Integration', 'API Development'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 8L10 11L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile apps that deliver seamless experiences on iOS and Android.',
      price: 'R19999',
      startingFrom: true,
      features: ['iOS & Android', 'Push Notifications', 'Offline Support'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Basic Maintenance',
      description: 'Essential maintenance services for basic website updates, content changes, and simple modifications.',
      price: 'R499p/m',
      startingFrom: false,
      features: ['Basic Edits', 'Pricing Changes', 'Content Updates'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Maintenance',
      description: 'Comprehensive maintenance and support services to keep your applications running smoothly.',
      price: 'R2999p/m',
      startingFrom: false,
      features: ['24/7 Monitoring', 'Security Updates', 'Performance Optimization'],
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="services-header">
          <span className="services-badge">Our Services</span>
          <h2 className="services-title">Solutions That Drive Results</h2>
          <p className="services-subtitle">
            Professional software solutions designed to help your business grow and succeed online
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-features">
                {service.features.map((feature, i) => (
                  <span key={i} className="service-feature">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </span>
                ))}
              </div>
              <div className="service-footer">
                <div className="service-price">
                  {service.startingFrom && <span className="service-price-label">Starting from</span>}
                  <span className="service-price-amount">{formatPrice(service.price)}</span>
                  {service.price.includes('p/m') && <span className="service-price-period">/month</span>}
                </div>
                <Link to="/services" className="service-link">
                  Learn More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
