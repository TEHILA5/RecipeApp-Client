// ===============================================
// Footer Component - Sweet&Treat Theme (FIXED)
// ===============================================
import { Box, Typography, Link as MuiLink } from '@mui/material';
import './Footer.css';

export default function Footer() {
  return (
    <Box component="footer" className="main-footer">
      <div className="footer-content">

        {/* Footer Top */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-text">Sweet&Treat</span>
              <span className="logo-emoji">🍰</span>
            </div>
            <Typography className="footer-tagline">
              A cozy corner of the internet dedicated to the art of
              dessert-making — with love, sugar, and a sprinkle of magic.
            </Typography>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Instagram">📸</a>
              <a href="#" className="social-icon" aria-label="Pinterest">📌</a>
              <a href="#" className="social-icon" aria-label="TikTok">🎵</a>
            </div>
          </div>

          {/* Recipes */}
          <div className="footer-section">
            <h4>Recipes</h4>
            <ul>
              <li><MuiLink href="/recipes">All Recipes</MuiLink></li>
              <li><MuiLink href="/recipes?category=cakes">Cakes</MuiLink></li>
              <li><MuiLink href="/recipes?category=cookies">Cookies</MuiLink></li>
              <li><MuiLink href="/recipes?category=pastries">Pastries</MuiLink></li>
            </ul>
          </div>

          {/* Sweety */}
          <div className="footer-section">
            <h4>Sweety</h4>
            <ul>
              <li><MuiLink href="#">Baking Tips</MuiLink></li>
              <li><MuiLink href="#">Ingredient Guide</MuiLink></li>
              <li><MuiLink href="#">Tools We Love</MuiLink></li>
              <li><MuiLink href="#">FAQ</MuiLink></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><MuiLink href="#">About Us</MuiLink></li>
              <li><MuiLink href="#">Contact</MuiLink></li>
              <li><MuiLink href="#">Newsletter</MuiLink></li>
              <li><MuiLink href="#">Privacy</MuiLink></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <Typography className="copyright">
            © 2026 Sweet&Treat — Made with 💕
          </Typography>
        </div>

      </div>
    </Box>
  );
}
