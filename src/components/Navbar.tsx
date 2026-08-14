import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ThemeToggle from './Themetoggle';
import './Navbar.css';

export default function Navbar() {
  const { loggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bp-navbar__link bp-navbar__link--active' : 'bp-navbar__link';

  return (
    <nav className="bp-navbar">
      <NavLink to="/" className="bp-navbar__logo" end onClick={closeMenu}>
        Anel<span>Graph</span>
      </NavLink>

      <div className={`bp-navbar__links ${menuOpen ? 'bp-navbar__links--open' : ''}`}>
        <NavLink to="/projects"   className={navClass} onClick={closeMenu}>Projects</NavLink>
        <NavLink to="/skills"     className={navClass} onClick={closeMenu}>Skills</NavLink>
        <NavLink to="/experience" className={navClass} onClick={closeMenu}>Experience</NavLink>
        <NavLink to="/contact"    className={navClass} onClick={closeMenu}>Contact</NavLink>
      </div>

      <div className="bp-navbar__right">
        <ThemeToggle />
        {loggedIn ? (
          <>
            <NavLink to="/dashboard" className="bp-navbar__cta" onClick={closeMenu}>Dashboard</NavLink>
            <button type="button" className="bp-navbar__cta" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="bp-navbar__cta" onClick={closeMenu}>Admin</NavLink>
        )}
        <button
          type="button"
          className="bp-navbar__burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}