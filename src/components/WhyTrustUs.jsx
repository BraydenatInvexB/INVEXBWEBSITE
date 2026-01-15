import { Link } from 'react-router-dom';
import './WhyTrustUs.css';

function WhyTrustUs() {
    const reasons = [
        {
            title: 'Fast Delivery',
            description: 'Get your project delivered on time with our efficient development process.',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            link: '/services'
        },
        {
            title: 'Quality Code',
            description: 'Clean, maintainable code built with industry best practices and modern standards.',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            link: '/services'
        },
        {
            title: 'Transparent Pricing',
            description: 'No hidden fees. Know exactly what you\'re paying for from the start.',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            link: '/configurator'
        },
        {
            title: 'Ongoing Support',
            description: 'We\'re with you after launch. Get dedicated support and maintenance services.',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            link: '/contact'
        }
    ];

    return (
        <section className="why-trust">
            <div className="why-trust-container">
                <div className="why-trust-header">
                    <span className="why-trust-badge">Why Choose Us</span>
                    <h2 className="why-trust-title">Built for Your Success</h2>
                    <p className="why-trust-subtitle">
                        Whether you're launching a new product or scaling your business, we deliver results you can count on
                    </p>
                </div>
                <div className="why-trust-grid">
                    {reasons.map((reason, index) => (
                        <Link to={reason.link} key={index} className="trust-card">
                            <div className="trust-card-icon">{reason.icon}</div>
                            <h3 className="trust-card-title">{reason.title}</h3>
                            <p className="trust-card-description">{reason.description}</p>
                            <span className="trust-card-link">
                                Learn more
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyTrustUs;
