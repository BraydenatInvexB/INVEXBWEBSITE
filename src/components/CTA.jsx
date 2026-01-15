import { Link } from 'react-router-dom';
import './CTA.css';

function CTA() {
    return (
        <section className="cta">
            <div className="cta-bg"></div>
            <div className="cta-container">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Build Your Project?</h2>
                    <p className="cta-subtitle">
                        Let's turn your idea into reality. Get a custom quote and start building today.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/configurator" className="cta-btn cta-btn-primary">
                            Start Your Project
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link to="/contact" className="cta-btn cta-btn-secondary">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTA;
