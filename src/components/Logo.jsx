import './Logo.css';
import transparentLogo from '../assets/Transparent.png';

function Logo() {
  return (
    <div className="logo-container">
      <img src={transparentLogo} alt="InvexB Logo" className="logo-image" />
    </div>
  );
}

export default Logo;

