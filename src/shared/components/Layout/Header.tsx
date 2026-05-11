import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout } from '../../../features/auth/redux/authSlice';
import { useIsMobile } from '../../hooks/useMediaQuery';
import logo from '../../../assets/images/logo1.png';
import sweetieIcon from '../../../assets/icons/nav-sweetie.png';
import adminIcon   from '../../../assets/icons/nav-admin.png';
import chefHat     from '../../../assets/icons/profile-avatar.png';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isAdmin } = useAppSelector((s) => s.auth);
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); setMenuOpen(false); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <img src={logo} alt="Sweet&Treat" className="logo-image" />
      </Link>

      {isMobile && (
        <button className="hamburger" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      )}

      {(!isMobile || menuOpen) && (
        <ul className={`nav-links ${isMobile ? 'mobile' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/recipes" onClick={closeMenu}>Recipes</Link></li>
          <li><Link to="/conversions" onClick={closeMenu}>Conversions</Link></li>

          {isAuthenticated && (
            <>
              <li><Link to="/search" onClick={closeMenu}>Search</Link></li>
              <li><Link to="/my-recipes" onClick={closeMenu}>My Recipes</Link></li>
              <li><Link to="/newchat" onClick={closeMenu}>Chat</Link></li>
              <li>
                <Link to="/chat" onClick={closeMenu} className="nav-sweetie-link">
                  <img src={sweetieIcon} alt="" className="nav-inline-icon" />
                  Sweetie
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <li>
              <Link to="/admin" onClick={closeMenu} className="admin-link">
                <img src={adminIcon} alt="" className="nav-inline-icon" />
                Admin
              </Link>
            </li>
          )}

          {isMobile && (
            <li className="mobile-user-section">
              {isAuthenticated ? (
                <div className="mobile-user">
                  <Link to="/profile" onClick={closeMenu} className="mobile-profile-link">
                    <img src={chefHat} alt="Profile" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    {user?.name || 'Chef'}
                  </Link>
                  <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
                </div>
              ) : (
                <div className="mobile-auth-btns">
                  <Link to="/login" onClick={closeMenu} className="btn-login">Login</Link>
                  <Link to="/register" onClick={closeMenu} className="btn-signup">Sign Up</Link>
                </div>
              )}
            </li>
          )}
        </ul>
      )}

      {!isMobile && (
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-user">
                <img src={chefHat} alt="Profile" className="chef-hat-icon" />
                <span className="user-name">{user?.name || 'Chef'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
