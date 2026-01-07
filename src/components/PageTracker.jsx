import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { savePageVisit } from '../utils/storage';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Use requestIdleCallback to avoid blocking the main thread
    const scheduleSave = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          savePageVisit(location.pathname);
        }, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          savePageVisit(location.pathname);
        }, 0);
      }
    };

    scheduleSave();
  }, [location]);

  return null;
}

export default PageTracker;

