import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-text">Sweet&amp;Treat</span>
              <span className="logo-emoji">🍰</span>
            </div>
            <p className="footer-tagline">
              A cozy corner of the internet dedicated to the art of
              dessert-making — with love, sugar, and a sprinkle of magic.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Instagram">📸</a>
              <a href="#" className="social-icon" aria-label="Pinterest">📌</a>
              <a href="#" className="social-icon" aria-label="TikTok">🎵</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Recipes</h4>
            <ul>
              <li><Link to="/recipes">All Recipes</Link></li>
              <li><Link to="/recipes?category=cakes">Cakes</Link></li>
              <li><Link to="/recipes?category=cookies">Cookies</Link></li>
              <li><Link to="/recipes?category=pastries">Pastries</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sweety</h4>
            <ul>
              <li><a href="#">Baking Tips</a></li>
              <li><a href="#">Ingredient Guide</a></li>
              <li><a href="#">Tools We Love</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Newsletter</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 Sweet&amp;Treat — Made with 💕</p>
        </div>
      </div>
    </footer>
  );
}
