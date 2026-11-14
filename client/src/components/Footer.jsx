import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand & Logo Section */}
          <Link to="/" className="footer-brand-header">
            <img
              src={logoImg}
              alt="Softrate Logo"
              className="footer-logo-img"
            />
            <div className="footer-brand-text">
              <h2>SOFTRATE</h2>
              <span>BLOG</span>
            </div>
          </Link>

          <p className="company-desc">
            Softrate Global delivers high-impact software engineering, scalable cloud solutions, and artificial intelligence systems for forward-thinking enterprises worldwide.
          </p>

          {/* Social Links */}
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">in</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub">gh</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Twitter / X">𝕏</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="YouTube">yt</a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Softrate Global. All rights reserved. Technology Blog & Knowledge Base.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Security Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
