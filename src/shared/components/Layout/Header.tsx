// ===============================================
// Header Component - Sweet&Treat Theme
// ===============================================
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout } from '../../../features/auth/redux/authSlice';
import logo from '../../../assets/images/logo1.png';
import chefHat from '../../../assets/icons/chef-hat.png';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      {/* Logo */}
      <Link to="/" className="nav-logo">
        <img src={logo} alt="Sweet&Treat" className="logo-image" />
      </Link>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/recipes">Recipes</Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/my-recipes">My Recipes</Link>
            </li>
          </>
        )}
      </ul>

      {/* Right Side - User Actions */}
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-user">
              <img src={chefHat} alt="Chef" className="chef-hat-icon" />
              <span className="user-name">{user?.name || 'Chef'}</span>
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link to="/register" className="btn-signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
