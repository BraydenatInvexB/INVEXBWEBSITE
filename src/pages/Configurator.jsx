import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveProjectConfiguration } from '../utils/storage';
import './Configurator.css';

function Configurator() {
  const [formData, setFormData] = useState({
    projectType: '',
    projectName: '',
    description: '',
    features: [],
    targetAudience: '',
    timeline: '',
    platform: [],
    integrations: '',
    designStyle: '',
    colorScheme: '',
    branding: '',
    contentManagement: false,
    userAuthentication: false,
    paymentIntegration: false,
    analytics: false,
    seoOptimization: false,
    responsiveDesign: false,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    additionalNotes: '',
    termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }));
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    
    try {
      await saveProjectConfiguration(formData);
      setSubmitted(true);
      // Reset form
      setFormData({
        projectType: '',
        projectName: '',
        description: '',
        features: [],
        targetAudience: '',
        timeline: '',
        platform: [],
        integrations: '',
        designStyle: '',
        colorScheme: '',
        branding: '',
        contentManagement: false,
        userAuthentication: false,
        paymentIntegration: false,
        analytics: false,
        seoOptimization: false,
        responsiveDesign: false,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        companyName: '',
        additionalNotes: '',
        termsAccepted: false
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit project configuration:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Failed to submit project configuration: ${errorMessage}\n\nPlease check:\n1. Supabase tables are created\n2. RLS policies allow inserts\n3. Check browser console for details`);
    }
  };

  return (
    <div className="configurator-page">
      <section className="configurator-hero">
        <div className="configurator-hero-container">
          <h1 className="configurator-hero-title">Project Configurator</h1>
          <p className="configurator-hero-subtitle">
            Tell us about your project and we'll create a customized solution for you
          </p>
        </div>
      </section>

      <section className="configurator-form-section">
        <div className="configurator-container">
          <form className="configurator-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="success-message">
                Thank you! Your project configuration has been submitted. We'll get back to you within 24 hours.
              </div>
            )}
            {/* Project Basics */}
            <div className="form-section">
              <h2 className="form-section-title">Project Basics</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="projectType">Project Type *</label>
                  <div className="custom-select-wrapper">
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className="custom-select"
                    >
                      <option value="">Select project type</option>
                      <option value="website">Website</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile Application</option>
                      <option value="ecommerce">E-commerce Platform</option>
                      <option value="other">Other</option>
                    </select>
                    <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="projectName">Project Name *</label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., My Business App"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Project Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe your project, its goals, and what you want to achieve..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="targetAudience">Target Audience</label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    placeholder="e.g., Small businesses, Students, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="timeline">Timeline</label>
                  <div className="custom-select-wrapper">
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="custom-select"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-3months">1-3 months</option>
                      <option value="3-6months">3-6 months</option>
                      <option value="6-12months">6-12 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                    <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="form-section">
              <h2 className="form-section-title">Platform & Technology</h2>
              <div className="form-group">
                <label>Target Platforms *</label>
                <div className="checkbox-group">
                  {['Web', 'iOS', 'Android', 'Desktop'].map(platform => (
                    <label key={platform} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.platform.includes(platform)}
                        onChange={() => handlePlatformToggle(platform)}
                      />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="integrations">Required Integrations</label>
                <input
                  type="text"
                  id="integrations"
                  name="integrations"
                  value={formData.integrations}
                  onChange={handleChange}
                  placeholder="e.g., Stripe, Google Analytics, Mailchimp..."
                />
              </div>
            </div>

            {/* Design Preferences */}
            <div className="form-section">
              <h2 className="form-section-title">Design & Branding</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="designStyle">Design Style</label>
                  <div className="custom-select-wrapper">
                    <select
                      id="designStyle"
                      name="designStyle"
                      value={formData.designStyle}
                      onChange={handleChange}
                      className="custom-select"
                    >
                      <option value="">Select style</option>
                      <option value="modern">Modern & Minimal</option>
                      <option value="classic">Classic & Professional</option>
                      <option value="bold">Bold & Creative</option>
                      <option value="custom">Custom Design</option>
                    </select>
                    <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="colorScheme">Color Scheme Preference</label>
                  <input
                    type="text"
                    id="colorScheme"
                    name="colorScheme"
                    value={formData.colorScheme}
                    onChange={handleChange}
                    placeholder="e.g., Blue and white, Dark theme..."
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="branding">Branding Guidelines</label>
                  <textarea
                    id="branding"
                    name="branding"
                    value={formData.branding}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any specific branding requirements, logo guidelines, or brand colors..."
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="form-section">
              <h2 className="form-section-title">Required Features</h2>
              <div className="features-grid">
                {[
                  'Content Management System',
                  'User Authentication',
                  'Payment Integration',
                  'Analytics & Reporting',
                  'SEO Optimization',
                  'Responsive Design',
                  'Multi-language Support',
                  'Real-time Chat',
                  'Email Notifications',
                  'Social Media Integration',
                  'Search Functionality',
                  'Admin Dashboard'
                ].map(feature => (
                  <label key={feature} className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h2 className="form-section-title">Contact Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="contactName">Your Name *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactEmail">Email Address *</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-section">
              <h2 className="form-section-title">Additional Notes</h2>
              <div className="form-group">
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Any additional information, specific requirements, or questions you'd like to share..."
                />
              </div>
            </div>

            <div className="form-submit">
              <div className="terms-checkbox-group">
                <label className="terms-checkbox-label">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                    className="terms-checkbox"
                  />
                  <span className="terms-text">
                    I agree to the <Link to="/terms" className="terms-link">Terms and Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </span>
                </label>
              </div>
              <button 
                type="submit" 
                className={`submit-button ${!formData.termsAccepted ? 'submit-button-disabled' : ''}`}
                disabled={!formData.termsAccepted}
              >
                Submit Project Configuration
              </button>
              <p className="form-note">
                * Required fields. We'll review your configuration and get back to you within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Configurator;

