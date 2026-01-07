import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPromotionData } from '../utils/storage';
import './PromotionBanner.css';

// Format price for display
const formatPrice = (price) => {
  if (!price) return '';
  const amount = price.replace('R', '').trim();
  const numAmount = parseInt(amount);
  if (isNaN(numAmount)) return price;
  return `R${numAmount.toLocaleString('en-ZA')}`;
};

function PromotionBanner() {
  const [promotion, setPromotion] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const promoData = await getPromotionData();
        if (promoData && promoData.enabled) {
          setPromotion(promoData);
        } else {
          setPromotion(null);
        }
      } catch (error) {
        console.error('Error loading promotion data:', error);
        setPromotion(null);
      }
    };

    loadPromotion();

    // Listen for custom event when promotion is updated
    const handlePromotionUpdate = () => {
      loadPromotion();
    };

    window.addEventListener('promotionUpdated', handlePromotionUpdate);

    return () => {
      window.removeEventListener('promotionUpdated', handlePromotionUpdate);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!promotion || !promotion.enabled || !isVisible) {
    return null;
  }

  return (
    <div className="promotion-banner">
      <div className="promotion-content">
        <div className="promotion-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="promotion-text">
          <span className="promotion-label">Limited Time Offer</span>
          <div className="promotion-message-wrapper">
            <span className="promotion-message">{promotion.message || 'start a business for'}</span>
            {promotion.price && (
              <span className="promotion-price">
                <span className="promotion-price-currency">R</span>
                <span className="promotion-price-amount">{formatPrice(promotion.price).replace('R', '')}</span>
              </span>
            )}
          </div>
        </div>
        <div className="promotion-actions">
          <Link to="/configurator" className="promotion-cta">
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <button className="promotion-close" onClick={handleClose} aria-label="Close banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="promotion-glow"></div>
    </div>
  );
}

export default PromotionBanner;

