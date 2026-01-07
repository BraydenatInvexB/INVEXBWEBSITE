import { useState } from 'react';
import { saveContactSubmission } from '../utils/storage';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveContactSubmission(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="contact-title">Let's Build Something Great</h2>
        <p className="contact-subtitle">
          Ready to transform your ideas into reality? Get in touch with us.
        </p>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <h3>Email</h3>
              <a href="mailto:support@invexb.com">support@invexb.com</a>
            </div>
            <div className="contact-item">
              <h3>Get Started</h3>
              <p>Tell us about your project and we'll get back to you within 24 hours.</p>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;

