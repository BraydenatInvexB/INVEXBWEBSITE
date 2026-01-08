import './ServicesPage.css';

// Format price for South African Rand
const formatPrice = (price) => {
  if (price.includes('p/m')) {
    const amount = price.replace('R', '').replace('p/m', '').trim();
    return `R${parseInt(amount).toLocaleString('en-ZA')}/mo`;
  }
  const amount = price.replace('R', '').trim();
  return `R${parseInt(amount).toLocaleString('en-ZA')}`;
};

function ServicesPage() {
  const services = [
    {
      title: 'Website Creation',
      price: 'R9999',
      startingFrom: true,
      description: 'Custom websites built with modern technologies, optimized for performance and user experience.',
      features: [
        'Responsive design for all devices',
        'SEO optimization',
        'Fast loading times',
        'Content management system',
        'Custom branding and design',
        'Analytics integration'
      ],
      technologies: ['React', 'Next.js', 'WordPress', 'HTML5/CSS3', 'JavaScript']
    },
    {
      title: 'Web Application Development',
      price: 'R19999',
      startingFrom: true,
      description: 'Scalable web applications that solve complex business challenges with elegant solutions.',
      features: [
        'Custom functionality development',
        'Database design and integration',
        'API development',
        'User authentication & authorization',
        'Real-time features',
        'Cloud deployment'
      ],
      technologies: ['React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Supabase']
    },
    {
      title: 'Mobile Application Development',
      price: 'R19999',
      startingFrom: true,
      description: 'Native and cross-platform mobile apps that deliver seamless experiences on iOS and Android.',
      features: [
        'iOS and Android development',
        'Cross-platform solutions',
        'App store optimization',
        'Push notifications',
        'Offline functionality',
        'Performance optimization'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Dart', 'Firebase']
    },
    {
      title: 'Maintenance',
      price: 'R2999p/m',
      description: 'Comprehensive maintenance and support services to keep your applications running smoothly and securely.',
      features: [
        'Regular security updates',
        'Performance monitoring',
        'Bug fixes and patches',
        'Feature enhancements',
        'Backup and recovery',
        'Technical support'
      ],
      technologies: ['Monitoring Tools', 'Cloud Services', 'Security Tools', 'Database Management']
    },
    {
      title: 'Extra Features',
      price: 'R999',
      startingFrom: true,
      description: 'Add custom features and functionality to enhance your application beyond the standard package.',
      features: [
        'Custom feature development',
        'Third-party integrations',
        'Advanced functionality',
        'API integrations',
        'Custom modules',
        'Feature enhancements'
      ],
      technologies: ['Custom Development', 'API Integration', 'Third-party Services']
    },
    {
      title: 'UX Design',
      price: 'R7999',
      startingFrom: true,
      description: 'Professional user experience design services to create intuitive and engaging interfaces for your applications.',
      features: [
        'User research and analysis',
        'Wireframing and prototyping',
        'User interface design',
        'Usability testing',
        'Design system creation',
        'Interactive prototypes'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping Tools']
    },
    {
      title: 'App Store Deployment',
      price: 'R4999',
      startingFrom: false,
      description: 'Complete deployment service to publish your mobile application on the Apple App Store and Google Play Store. Note: Apple Developer License ($99/year) and Google Play Developer Account ($25 one-time) are not included.',
      features: [
        'App Store submission',
        'Play Store submission',
        'Store listing optimization',
        'Screenshots and assets',
        'App description writing',
        'Submission support'
      ],
      technologies: ['App Store Connect', 'Google Play Console', 'Store Optimization']
    }
  ];

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-container">
          <h1 className="services-hero-title">Our Services</h1>
          <p className="services-hero-subtitle">
            Comprehensive software solutions tailored to your business needs
          </p>
        </div>
      </section>

      <section className="services-detailed">
        <div className="services-detailed-container">
          <div className="pricing-disclaimer">
            <div className="disclaimer-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="disclaimer-content">
              <h3 className="disclaimer-title">Great Value Pricing</h3>
              <p className="disclaimer-text">
                These competitive prices are for standard applications with essential features. If your project includes more advanced 
                or complex features, reach out to us and we'll let you know if your requirements fit within these excellent rates. 
                We're here to help you get the best value for your investment.
              </p>
            </div>
          </div>
          {services.map((service, index) => (
            <div key={index} className="service-detailed-card">
              <div className="service-header">
                <h2 className="service-detailed-title">{service.title}</h2>
                <div className="service-detailed-price">
                  {service.startingFrom && <span className="service-price-label">Starting from</span>}
                  <span className="service-price-amount">{formatPrice(service.price)}</span>
                  {service.price.includes('p/m') && <span className="service-price-period">per month</span>}
                </div>
              </div>
              <p className="service-detailed-description">{service.description}</p>
              
              <div className="service-features">
                <h3 className="service-section-title">Key Features</h3>
                <ul className="features-list">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="service-technologies">
                <h3 className="service-section-title">Technologies We Use</h3>
                <div className="tech-tags">
                  {service.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
