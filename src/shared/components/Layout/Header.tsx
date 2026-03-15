// ===============================================
// Header Component - Sweet&Treat Theme
// ===============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout } from '../../../features/auth/redux/authSlice';
import { useIsMobile } from '../../hooks/useMediaQuery';
import logo from '../../../assets/images/logo1.png';
import chefHat from '../../../assets/icons/chef-hat.png';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isAdmin } = useAppSelector((state) => state.auth);
  const isMobile = useIsMobile(); // ✅ useMediaQuery
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <img src={logo} alt="Sweet&Treat" className="logo-image" />
      </Link>

      {/* ✅ כפתור המבורגר למובייל */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', color: '#d4547a', marginLeft: 'auto' }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Navigation Links */}
      {(!isMobile || mobileMenuOpen) && (
        <ul className="nav-links" style={isMobile ? {
          position: 'absolute', top: 'var(--nav-height, 70px)', left: 0, right: 0,
          background: 'white', flexDirection: 'column', padding: '16px 24px',
          boxShadow: '0 8px 20px rgba(212,84,122,0.1)', zIndex: 100,
          borderBottom: '2px solid #fce7f3',
        } : undefined}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/recipes" onClick={closeMenu}>Recipes</Link></li>
          <li><Link to="/conversions" onClick={closeMenu}>Conversions</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/search" onClick={closeMenu}>Search</Link></li>
              <li><Link to="/my-recipes" onClick={closeMenu}>My Recipes</Link></li>
              <li><Link to="/chat" onClick={closeMenu}>🍰 Sweetie</Link></li>
            </>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin" onClick={closeMenu} style={{
                background: 'linear-gradient(135deg, #e8799a, #d4547a)',
                color: 'white', padding: '6px 16px',
                borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem',
              }}>🛠️ Admin</Link>
            </li>
          )}
          {isMobile && (
            <li style={{ marginTop: '8px', borderTop: '1px solid #fce7f3', paddingTop: '12px' }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/profile" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4547a', fontWeight: 700 }}>
                    <img src={chefHat} alt="Chef" style={{ width: '24px' }} />
                    {user?.name || 'Chef'}
                  </Link>
                  <button onClick={handleLogout} style={{ background: 'none', border: '2px solid #fce7f3', borderRadius: '999px', padding: '8px 16px', color: '#d4547a', cursor: 'pointer', fontWeight: 700 }}>
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to="/login" onClick={closeMenu} className="btn-login">Login</Link>
                  <Link to="/register" onClick={closeMenu} className="btn-signup">Sign Up</Link>
                </div>
              )}
            </li>
          )}
        </ul>
      )}

      {/* Desktop - Right Side */}
      {!isMobile && (
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-user">
                <img src={chefHat} alt="Chef" className="chef-hat-icon" />
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
