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
            </div>
            <p className="footer-tagline">
              A cozy corner of the internet dedicated to the art of
              dessert-making — with love, sugar, and a sprinkle of magic.
            </p>

            {/* ✔️ אייקונים בלי קישורים */}
            <div className="social-links">
              <span className="social-icon" aria-label="Instagram">📸</span>
              <span className="social-icon" aria-label="Pinterest">📌</span>
              <span className="social-icon" aria-label="TikTok">🎵</span>
            </div>
          </div>

          <div className="footer-section">
            <h4>Recipes</h4>
            <ul>
              <li><Link to="/recipes">All Recipes</Link></li>
              <li><Link to="/recipes?category=Cakes">Cakes</Link></li>
              <li><Link to="/recipes?category=Cookies">Cookies</Link></li>
              <li><Link to="/recipes?category=Pastries">Pastries</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sweety</h4>
            <ul>
              <li><Link to="/baking-tips">Baking Tips</Link></li>
              <li><Link to="/ingredient-guide">Ingredient Guide</Link></li>
              <li><Link to="/tools">Tools We Love</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/newsletter">Newsletter</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
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