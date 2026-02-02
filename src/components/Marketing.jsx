import { Link } from 'react-router-dom';
import './Marketing.css';

const formatPrice = (price) => {
  if (price.includes('p/m')) {
    const amount = price.replace('R', '').replace('p/m', '').trim();
    return `R${parseInt(amount).toLocaleString('en-ZA')}`;
  }
  const amount = price.replace('R', '').trim();
  return `R${parseInt(amount).toLocaleString('en-ZA')}`;
};

function Marketing() {
  const packages = [
    {
      title: 'Starter',
      price: 'R999p/m',
      description: 'Perfect for small businesses. Choose 2 social media accounts and we manage your presence.',
      features: [
        '2 social media accounts managed',
        'Content creation & posting',
        'Basic engagement & replies',
        'Monthly performance report'
      ],
      popular: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Growth',
      price: 'R2499p/m',
      description: 'Scale your reach with 5 social accounts plus content strategy and basic paid ads support.',
      features: [
        '5 social media accounts managed',
        'Content calendar & strategy',
        'Basic paid ads management',
        'Engagement & community management',
        'Bi-weekly reports & insights'
      ],
      popular: true,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'Full Presence',
      price: 'R4999p/m',
      description: 'We set up your website and manage up to 10 social media accounts. Complete online presence.',
      features: [
        'Website setup included',
        'Up to 10 social media accounts managed',
        'Full content & ad strategy',
        'Dedicated account manager',
        'Weekly strategy calls',
        'Priority support'
      ],
      popular: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="marketing" className="marketing">
      <div className="marketing-container">
        <div className="marketing-header">
          <span className="marketing-badge">Marketing</span>
          <h2 className="marketing-title">Social Media & Web Presence</h2>
          <p className="marketing-subtitle">
            Choose a package that fits your needs: from social media management for 2 accounts to a complete online presence including website setup and up to 10 channels. We handle your digital presence so you can focus on running your business.
          </p>
        </div>
        <div className="marketing-grid">
          {packages.map((pkg, index) => (
            <div key={index} className={`marketing-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <span className="marketing-popular-badge">Most Popular</span>}
              <div className="marketing-icon">{pkg.icon}</div>
              <h3 className="marketing-card-title">{pkg.title}</h3>
              <div className="marketing-price">
                <span className="marketing-price-amount">{formatPrice(pkg.price)}</span>
                <span className="marketing-price-period">/month</span>
              </div>
              <p className="marketing-description">{pkg.description}</p>
              <ul className="marketing-features">
                {pkg.features.map((feature, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="marketing-cta">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Marketing;
