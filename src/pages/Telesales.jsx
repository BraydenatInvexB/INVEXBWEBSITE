import { Link } from 'react-router-dom';
import './TelesalesPage.css';

function Telesales() {
  return (
    <div className="telesales-page">
      <section className="telesales-hero">
        <div className="telesales-hero-container">
          <span className="telesales-badge">Outsourced Telesales</span>
          <h1 className="telesales-hero-title">Remote Telesales Agents for Your Business</h1>
          <p className="telesales-hero-subtitle">
            We provide skilled remote telesales agents to companies. We recruit, manage, and pay the agents. You get more sales without the overhead.
          </p>
          <div className="telesales-hero-value">
            <span className="telesales-value-pill">Pay for 1 agent, get 3</span>
          </div>
          <Link to="/contact" className="telesales-enquire-btn">Enquire</Link>
        </div>
      </section>

      <section className="telesales-how">
        <div className="telesales-container">
          <h2 className="telesales-section-title">How It Works</h2>
          <div className="telesales-cards">
            <div className="telesales-card">
              <div className="telesales-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>We Manage and Pay the Agents</h3>
              <p className="telesales-card-lead">Pay for one agent, get three on your campaign. We hire, train, and pay them.</p>
              <ul className="telesales-card-list">
                <li>Commission to the agent; we take a small share for management and CRM</li>
                <li>No HR or payroll on your side</li>
              </ul>
            </div>
            <div className="telesales-card">
              <div className="telesales-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3>We Cover Call Costs</h3>
              <p className="telesales-card-lead">All call costs are on us. No extra phone bills or telecom setup.</p>
              <ul className="telesales-card-list">
                <li>Everything included so you focus on results</li>
                <li>No surprise costs</li>
              </ul>
            </div>
            <div className="telesales-card">
              <div className="telesales-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>Managed Through Our CRM</h3>
              <p className="telesales-card-lead">Every agent works through our CRM. You get full visibility and control.</p>
              <ul className="telesales-card-list">
                <li>Reporting and quality control</li>
                <li>Everything organised and accountable</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="telesales-outcomes">
        <div className="telesales-container">
          <div className="telesales-outcomes-card">
            <h2 className="telesales-outcomes-title">Your Business, Your Goals</h2>
            <p className="telesales-outcomes-text">
              We gather everything about your business, products, and services and brief the telesales team. We need to understand what you are aiming for so we can align the campaign accordingly. That might be appointments, leads, orders, or something else. Tell us your goal and we will work with you to set it up.
            </p>
          </div>
        </div>
      </section>

      <section className="telesales-cta">
        <div className="telesales-container">
          <h2 className="telesales-cta-title">Ready to Scale Your Sales?</h2>
          <p className="telesales-cta-text">Get three remote telesales agents for the price of one. We manage them, cover call costs, and run everything through our CRM.</p>
          <Link to="/contact" className="telesales-enquire-btn large">Enquire Now</Link>
        </div>
      </section>
    </div>
  );
}

export default Telesales;
