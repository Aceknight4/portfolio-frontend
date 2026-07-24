import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ThemeToggle from './Themetoggle';
import './Navbar.css';

export default function Navbar() {
  const { loggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bp-navbar__link bp-navbar__link--active' : 'bp-navbar__link';

  return (
    <nav className="bp-navbar">
      <NavLink to="/" className="bp-navbar__logo" end>
        Anel<span>Graph</span>
      </NavLink>

      <div className="bp-navbar__links">
        <NavLink to="/projects"   className={navClass}>Projects</NavLink>
        <NavLink to="/skills"     className={navClass}>Skills</NavLink>
        <NavLink to="/experience" className={navClass}>Experience</NavLink>
        <NavLink to="/contact"    className={navClass}>Contact</NavLink>
      </div>

      <div className="bp-navbar__right">
        <ThemeToggle />
        {loggedIn ? (
          <>
            <NavLink to="/dashboard" className="bp-navbar__cta">Dashboard</NavLink>
            <button type="button" className="bp-navbar__cta" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="bp-navbar__cta">Admin</NavLink>
        )}
      </div>
    </nav>
  );
}