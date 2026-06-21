import { Link } from 'react-router-dom';
import instagramIcon from '../../../assets/icons/social-instagram.png';
import pinterestIcon from '../../../assets/icons/social-pinterest.png';
import tiktokIcon from '../../../assets/icons/social-tiktok.png';
import heartIcon from '../../../assets/icons/footer-heart.png';
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

            <div className="social-links">
              <span className="social-icon" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" className="social-icon-img" />
              </span>
              <span className="social-icon" aria-label="Pinterest">
                <img src={pinterestIcon} alt="Pinterest" className="social-icon-img" />
              </span>
              <span className="social-icon" aria-label="TikTok">
                <img src={tiktokIcon} alt="TikTok" className="social-icon-img" />
              </span>
            </div>
          </div>

          <nav className="footer-section">
            <h4>Recipes</h4>
            <ul>
              <li><Link to="/recipes">All Recipes</Link></li>
              <li><Link to="/recipes?category=Cakes">Cakes</Link></li>
              <li><Link to="/recipes?category=Cookies">Cookies</Link></li>
              <li><Link to="/recipes?category=Pastries">Pastries</Link></li>
            </ul>
          </nav>

          <nav className="footer-section">
            <h4>Sweety</h4>
            <ul>
              <li><Link to="/baking-tips">Baking Tips</Link></li>
              <li><Link to="/ingredient-guide">Ingredient Guide</Link></li>
              <li><Link to="/tools">Tools We Love</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </nav>

          <nav className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/newsletter">Newsletter</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2026 Sweet&amp;Treat — Made with{' '}
            <img src={heartIcon} alt="love" className="footer-heart-icon" />
          </p>
        </div>
      </div>
    </footer>
  );
}