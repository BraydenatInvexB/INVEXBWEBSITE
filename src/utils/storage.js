// Storage utility for saving submissions
export const saveContactSubmission = (data) => {
  const submissions = getContactSubmissions();
  const newSubmission = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString()
  };
  submissions.push(newSubmission);
  localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  return newSubmission;
};

export const getContactSubmissions = () => {
  const stored = localStorage.getItem('contactSubmissions');
  return stored ? JSON.parse(stored) : [];
};

export const saveProjectConfiguration = (data) => {
  const configurations = getProjectConfigurations();
  const newConfig = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString()
  };
  configurations.push(newConfig);
  localStorage.setItem('projectConfigurations', JSON.stringify(configurations));
  return newConfig;
};

export const getProjectConfigurations = () => {
  const stored = localStorage.getItem('projectConfigurations');
  return stored ? JSON.parse(stored) : [];
};

export const savePageVisit = (path) => {
  const visits = getPageVisits();
  const visit = {
    id: Date.now(),
    path,
    timestamp: new Date().toISOString()
  };
  visits.push(visit);
  localStorage.setItem('pageVisits', JSON.stringify(visits));
  return visit;
};

export const getPageVisits = () => {
  const stored = localStorage.getItem('pageVisits');
  return stored ? JSON.parse(stored) : [];
};

export const clearAllData = () => {
  localStorage.removeItem('contactSubmissions');
  localStorage.removeItem('projectConfigurations');
  localStorage.removeItem('pageVisits');
};

export const savePromotionData = (data) => {
  localStorage.setItem('promotionData', JSON.stringify(data));
  return data;
};

export const getPromotionData = () => {
  const stored = localStorage.getItem('promotionData');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default promotion
  return {
    enabled: true,
    message: 'start a business for',
    price: 'R19999'
  };
};

