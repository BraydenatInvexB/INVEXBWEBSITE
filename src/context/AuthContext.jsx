import { createContext, useContext, useState, useEffect } from 'react';
import { authenticateTelesalesUser } from '../utils/storage';

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
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedFullName = localStorage.getItem('fullName');
    
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      if (storedUserId) setUserId(storedUserId);
      if (storedUsername) setUsername(storedUsername);
      if (storedFullName) setFullName(storedFullName);
    }
  }, []);

  const login = async (usernameOrPassword, password = null) => {
    // Admin login (password only, legacy support)
    if (!password && usernameOrPassword === 'admin123') {
      setIsAuthenticated(true);
      setUserRole('admin');
      setUserId(null);
      setUsername(null);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      return true;
    }
    
    // Telesales user login (username + password)
    if (usernameOrPassword && password) {
      try {
        const user = await authenticateTelesalesUser(usernameOrPassword, password);
        if (user) {
          setIsAuthenticated(true);
          setUserRole('telesales');
          setUserId(user.id);
          setUsername(user.username);
          setFullName(user.fullName || null);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'telesales');
          localStorage.setItem('userId', user.id);
          localStorage.setItem('username', user.username);
          localStorage.setItem('fullName', user.fullName || '');
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    }

    // Legacy telesales123 support (password only)
    if (!password && usernameOrPassword === 'telesales123') {
      setIsAuthenticated(true);
      setUserRole('telesales1');
      setUserId(null);
      setUsername(null);
      setFullName(null);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'telesales1');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('fullName');
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUsername(null);
    setFullName(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, username, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

