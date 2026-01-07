import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Header.css';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/configurator">Configurator</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

