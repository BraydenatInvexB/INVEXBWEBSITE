import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { savePageVisit } from '../utils/storage';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    savePageVisit(location.pathname);
  }, [location]);

  return null;
}

export default PageTracker;

