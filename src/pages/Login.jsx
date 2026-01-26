import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Admin login: password only (admin123)
      if (!username && password === 'admin123') {
        if (login(password)) {
          navigate('/admin');
          return;
        }
      }
      
      // Telesales login: username + password
      if (username && password) {
        const success = await login(username, password);
        if (success) {
          navigate('/admin');
          return;
        }
      }
      
      // Legacy telesales123 support
      if (!username && password === 'telesales123') {
        if (login(password)) {
          navigate('/admin');
          return;
        }
      }
      
      setError('Incorrect username or password. Please try again.');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Enter your credentials to access the panel</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username (Optional for Admin)</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

