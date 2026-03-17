import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-paw">🐾</span>
          <span className="brand-text">PawsHome</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`ham-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`ham-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`ham-bar ${menuOpen ? 'open' : ''}`} />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/pets" className={`nav-link ${isActive('/pets') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Find a Pet</Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <Link to="/dashboard" className={`nav-link ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Applications</Link>
              <div className="nav-user">
                <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
