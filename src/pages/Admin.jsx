import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getContactSubmissions, 
  getProjectConfigurations, 
  getPageVisits,
  clearAllData,
  getPromotionData,
  savePromotionData
} from '../utils/storage';
import './Admin.css';

function Admin() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [projectConfigs, setProjectConfigs] = useState([]);
  const [pageVisits, setPageVisits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [promotionData, setPromotionData] = useState({ enabled: true, message: '', price: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      const [contacts, projects, visits, promotion] = await Promise.all([
        getContactSubmissions(),
        getProjectConfigurations(),
        getPageVisits(),
        getPromotionData()
      ]);
      setContactSubmissions(contacts);
      setProjectConfigs(projects);
      setPageVisits(visits);
      setPromotionData(promotion);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        await clearAllData();
        await loadData();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data. Please try again.');
      }
    }
  };

  const getVisitStats = () => {
    const stats = {};
    pageVisits.forEach(visit => {
      stats[visit.path] = (stats[visit.path] || 0) + 1;
    });
    return stats;
  };

  const visitStats = getVisitStats();

  const filteredContacts = contactSubmissions.filter(sub => 
    sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projectConfigs.filter(proj =>
    proj.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proj.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proj.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <div className="admin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage submissions and view analytics</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={activeTab === 'overview' ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => setActiveTab('overview')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Overview</span>
            </button>
            <button 
              className={activeTab === 'contacts' ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => setActiveTab('contacts')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Contact Submissions</span>
              <span className="nav-badge">{contactSubmissions.length}</span>
            </button>
            <button 
              className={activeTab === 'projects' ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => setActiveTab('projects')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Project Configurations</span>
              <span className="nav-badge">{projectConfigs.length}</span>
            </button>
            <button 
              className={activeTab === 'analytics' ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => setActiveTab('analytics')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Page Analytics</span>
            </button>
            <button 
              className={activeTab === 'promotion' ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => setActiveTab('promotion')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Promotion Banner</span>
            </button>
          </nav>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Dashboard Overview</h2>
                <div className="section-actions">
                  <button onClick={loadData} className="action-button refresh">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.49 15C19.84 16.8399 18.6093 18.4187 17.0019 19.4984C15.3945 20.5781 13.4901 21.1066 11.5449 21.0129C9.59978 20.9192 7.75166 20.2076 6.25605 18.9878C4.76043 17.768 3.6869 16.1009 3.18213 14.221C2.67736 12.341 2.76859 10.3433 3.44424 8.52007C4.11989 6.69681 5.34697 5.14126 6.9519 4.08628C8.55683 3.03129 10.4536 2.52998 12.3788 2.65388C14.3041 2.77779 16.1634 3.52089 17.6569 4.77252L23 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh
                  </button>
                  <button onClick={handleClearData} className="action-button danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Clear All
                  </button>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card stat-primary">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{contactSubmissions.length}</h3>
                    <p className="stat-label">Contact Submissions</p>
                  </div>
                </div>
                <div className="stat-card stat-success">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{projectConfigs.length}</h3>
                    <p className="stat-label">Project Configurations</p>
                  </div>
                </div>
                <div className="stat-card stat-info">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{pageVisits.length}</h3>
                    <p className="stat-label">Total Page Visits</p>
                  </div>
                </div>
                <div className="stat-card stat-warning">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{Object.keys(visitStats).length}</h3>
                    <p className="stat-label">Unique Pages</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Contact Form Submissions</h2>
                <div className="search-box">
                  <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              {filteredContacts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>No contact submissions</h3>
                  <p>{searchQuery ? 'No results found for your search.' : 'No contact submissions yet.'}</p>
                </div>
              ) : (
                <div className="submissions-list">
                  {filteredContacts.slice().reverse().map((submission) => (
                    <div key={submission.id} className="submission-card">
                      <div className="submission-header">
                        <div className="submission-info">
                          <h3 className="submission-name">{submission.name}</h3>
                          <p className="submission-email">{submission.email}</p>
                        </div>
                        <div className="submission-meta">
                          <span className="submission-date">
                            {new Date(submission.timestamp).toLocaleDateString()}
                          </span>
                          <span className="submission-time">
                            {new Date(submission.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="submission-message">
                        <div className="message-label">Message</div>
                        <p>{submission.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Project Configurations</h2>
                <div className="search-box">
                  <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              {filteredProjects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>No project configurations</h3>
                  <p>{searchQuery ? 'No results found for your search.' : 'No project configurations yet.'}</p>
                </div>
              ) : (
                <div className="submissions-list">
                  {filteredProjects.slice().reverse().map((config) => (
                    <div key={config.id} className="submission-card project-card">
                      <div className="submission-header">
                        <div className="submission-info">
                          <h3 className="submission-name">{config.projectName || 'Untitled Project'}</h3>
                          <div className="submission-contact">
                            <span className="submission-email">{config.contactEmail}</span>
                            {config.companyName && (
                              <span className="submission-company"> • {config.companyName}</span>
                            )}
                          </div>
                        </div>
                        <div className="submission-meta">
                          <span className="submission-date">
                            {new Date(config.timestamp).toLocaleDateString()}
                          </span>
                          <span className="submission-time">
                            {new Date(config.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="project-details">
                        {/* Project Information */}
                        <div className="details-section">
                          <h4 className="details-section-title">Project Information</h4>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Project Type</span>
                              <span className="detail-value">{config.projectType || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Timeline</span>
                              <span className="detail-value">{config.timeline || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Target Audience</span>
                              <span className="detail-value">{config.targetAudience || 'Not specified'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Platforms</span>
                              <span className="detail-value">
                                {Array.isArray(config.platform) && config.platform.length > 0 
                                  ? config.platform.join(', ') 
                                  : 'None'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="details-section">
                          <h4 className="details-section-title">Contact Information</h4>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Contact Name</span>
                              <span className="detail-value">{config.contactName || 'Not provided'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Email</span>
                              <span className="detail-value">{config.contactEmail || 'Not provided'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">{config.contactPhone || 'Not provided'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Company</span>
                              <span className="detail-value">{config.companyName || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Design & Branding */}
                        {(config.designStyle || config.colorScheme || config.branding) && (
                          <div className="details-section">
                            <h4 className="details-section-title">Design & Branding</h4>
                            <div className="details-grid">
                              {config.designStyle && (
                                <div className="detail-item">
                                  <span className="detail-label">Design Style</span>
                                  <span className="detail-value">{config.designStyle}</span>
                                </div>
                              )}
                              {config.colorScheme && (
                                <div className="detail-item">
                                  <span className="detail-label">Color Scheme</span>
                                  <span className="detail-value">{config.colorScheme}</span>
                                </div>
                              )}
                              {config.branding && (
                                <div className="detail-item full-width">
                                  <span className="detail-label">Branding Guidelines</span>
                                  <span className="detail-value">{config.branding}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Integrations */}
                        {config.integrations && (
                          <div className="details-section">
                            <h4 className="details-section-title">Required Integrations</h4>
                            <p className="detail-text">{config.integrations}</p>
                          </div>
                        )}

                        {/* Features */}
                        {Array.isArray(config.features) && config.features.length > 0 && (
                          <div className="details-section">
                            <h4 className="details-section-title">Selected Features</h4>
                            <div className="features-list">
                              {config.features.map((feature, idx) => (
                                <span key={idx} className="feature-tag">{feature}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Boolean Features */}
                        {(config.contentManagement || config.userAuthentication || config.paymentIntegration || 
                          config.analytics || config.seoOptimization || config.responsiveDesign) && (
                          <div className="details-section">
                            <h4 className="details-section-title">Additional Features</h4>
                            <div className="boolean-features">
                              {config.contentManagement && <span className="boolean-feature">Content Management</span>}
                              {config.userAuthentication && <span className="boolean-feature">User Authentication</span>}
                              {config.paymentIntegration && <span className="boolean-feature">Payment Integration</span>}
                              {config.analytics && <span className="boolean-feature">Analytics</span>}
                              {config.seoOptimization && <span className="boolean-feature">SEO Optimization</span>}
                              {config.responsiveDesign && <span className="boolean-feature">Responsive Design</span>}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {config.description && (
                          <div className="details-section">
                            <h4 className="details-section-title">Project Description</h4>
                            <p className="detail-text">{config.description}</p>
                          </div>
                        )}

                        {/* Additional Notes */}
                        {config.additionalNotes && (
                          <div className="details-section">
                            <h4 className="details-section-title">Additional Notes</h4>
                            <p className="detail-text">{config.additionalNotes}</p>
                          </div>
                        )}

                        {/* Terms Accepted */}
                        {config.termsAccepted && (
                          <div className="details-section">
                            <div className="terms-badge">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Terms and Conditions Accepted
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="admin-section">
              <h2 className="section-title">Page Analytics</h2>
              <div className="analytics-content">
                <div className="analytics-card">
                  <h3 className="analytics-title">Page Visit Statistics</h3>
                  {Object.keys(visitStats).length === 0 ? (
                    <div className="empty-state-small">No page visits recorded yet.</div>
                  ) : (
                    <div className="visit-stats">
                      {Object.entries(visitStats)
                        .sort((a, b) => b[1] - a[1])
                        .map(([path, count]) => (
                          <div key={path} className="visit-stat-item">
                            <div className="visit-stat-info">
                              <span className="visit-path">{path === '/' ? 'Home' : path}</span>
                              <span className="visit-bar">
                                <span 
                                  className="visit-bar-fill" 
                                  style={{ width: `${(count / Math.max(...Object.values(visitStats))) * 100}%` }}
                                ></span>
                              </span>
                            </div>
                            <span className="visit-count">{count}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="analytics-card">
                  <h3 className="analytics-title">Recent Visits</h3>
                  {pageVisits.length === 0 ? (
                    <div className="empty-state-small">No visits recorded.</div>
                  ) : (
                    <div className="visits-list">
                      {pageVisits.slice().reverse().slice(0, 50).map((visit) => (
                        <div key={visit.id} className="visit-item">
                          <span className="visit-path">{visit.path === '/' ? 'Home' : visit.path}</span>
                          <span className="visit-time">
                            {new Date(visit.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'promotion' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Promotion Banner Management</h2>
              </div>
              <div className="promotion-admin-card">
                <div className="promotion-preview">
                  <h3 className="promotion-admin-title">Preview</h3>
                  <div className="promotion-preview-banner">
                    <div className="promotion-preview-content">
                      <div className="promotion-preview-text">
                        <span className="promotion-preview-label">Limited Time Offer</span>
                        <div className="promotion-preview-message-wrapper">
                          <span className="promotion-preview-message">
                            {promotionData.message || 'start a business for'}
                          </span>
                          {promotionData.price && (
                            <span className="promotion-preview-price">
                              <span className="promotion-price-currency">R</span>
                              <span className="promotion-price-amount">
                                {promotionData.price.replace('R', '').trim().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="promotion-form">
                  <div className="form-group-admin">
                    <label className="form-label-admin">
                    <input
                      type="checkbox"
                      checked={promotionData.enabled}
                      onChange={async (e) => {
                        const updated = { ...promotionData, enabled: e.target.checked };
                        setPromotionData(updated);
                        try {
                          await savePromotionData(updated);
                        } catch (error) {
                          console.error('Failed to save promotion data:', error);
                        }
                      }}
                      className="form-checkbox-admin"
                    />
                      <span>Enable Promotion Banner</span>
                    </label>
                  </div>
                  <div className="form-group-admin">
                    <label htmlFor="promotion-message" className="form-label-admin-text">Promotion Message</label>
                    <input
                      type="text"
                      id="promotion-message"
                      value={promotionData.message || ''}
                      onChange={async (e) => {
                        const updated = { ...promotionData, message: e.target.value };
                        setPromotionData(updated);
                        try {
                          await savePromotionData(updated);
                        } catch (error) {
                          console.error('Failed to save promotion data:', error);
                        }
                      }}
                      placeholder="start a business for"
                      className="form-textarea-admin"
                    />
                    <p className="form-hint">The main promotional message (e.g., "start a business for")</p>
                  </div>
                  <div className="form-group-admin">
                    <label htmlFor="promotion-price" className="form-label-admin-text">Price</label>
                    <input
                      type="text"
                      id="promotion-price"
                      value={promotionData.price || ''}
                      onChange={async (e) => {
                        const updated = { ...promotionData, price: e.target.value };
                        setPromotionData(updated);
                        try {
                          await savePromotionData(updated);
                        } catch (error) {
                          console.error('Failed to save promotion data:', error);
                        }
                      }}
                      placeholder="R19999"
                      className="form-textarea-admin"
                    />
                    <p className="form-hint">The price will be displayed on a separate line below the message</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await savePromotionData(promotionData);
                        alert('Promotion settings saved successfully!');
                      } catch (error) {
                        console.error('Failed to save promotion data:', error);
                        alert('Failed to save promotion settings. Please try again.');
                      }
                    }}
                    className="save-promotion-button"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
