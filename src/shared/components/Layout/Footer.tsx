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
                <img src={instagramIcon} alt="Instagram" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </span>
              <span className="social-icon" aria-label="Pinterest">
                <img src={pinterestIcon} alt="Pinterest" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </span>
              <span className="social-icon" aria-label="TikTok">
                <img src={tiktokIcon} alt="TikTok" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </span>
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
          <p className="copyright" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', textAlign: 'center',}}>
            © 2026 Sweet&amp;Treat — Made with{' '}
            <img src={heartIcon} alt="love" style={{ width: '20px', height: '20px', objectFit: 'contain',}} />
          </p>
        </div>
      </div>
    </footer>
  );
}
