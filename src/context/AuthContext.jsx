import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = (password) => {
    // Password-based login only
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setUserRole('admin');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      return true;
    }
    
    if (password === 'telesales123') {
      setIsAuthenticated(true);
      setUserRole('telesales1');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'telesales1');
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

