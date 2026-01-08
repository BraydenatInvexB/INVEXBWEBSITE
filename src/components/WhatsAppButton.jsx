import { useState } from 'react';
import './WhatsAppButton.css';

function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true);
  const phoneNumber = '27772758305'; // Remove spaces and + for WhatsApp link
  const message = 'Hi InvexB! I\'m interested in your services.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="whatsapp-container">
      <button 
        className="whatsapp-close"
        onClick={() => setIsVisible(false)}
        aria-label="Hide WhatsApp button"
        type="button"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="currentColor"
          className="whatsapp-icon"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958C9.714 30.986 12.736 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.484 22.606c-.396 1.116-1.95 2.042-3.21 2.312-.864.184-1.99.33-5.786-1.244-4.856-2.014-7.978-6.94-8.22-7.262-.232-.32-1.95-2.6-1.95-4.96s1.232-3.52 1.67-4.002c.396-.438.924-.612 1.232-.612.148 0 .282.008.402.014.44.02.66.046.95.734.364.864 1.252 3.05 1.36 3.272.11.222.22.52.07.82-.14.31-.264.448-.486.702-.222.254-.432.448-.654.722-.2.24-.426.496-.182.936.244.44 1.084 1.788 2.328 2.896 1.6 1.424 2.946 1.866 3.364 2.074.418.208.662.174.906-.104.254-.29 1.076-1.254 1.364-1.684.278-.43.566-.358.95-.214.39.14 2.464 1.162 2.886 1.374.42.212.702.32.804.492.1.174.1.998-.296 2.114z"/>
        </svg>
      </a>
    </div>
  );
}

export default WhatsAppButton;

