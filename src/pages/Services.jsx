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
          {services.map((service, index) => (
            <div key={index} className="service-detailed-card">
              <div className="service-header">
                <h2 className="service-detailed-title">{service.title}</h2>
                <div className="service-detailed-price">
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
