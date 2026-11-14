import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/blogs');
    }
  };

  return (
    <header className="header">
      {/* 1. Softrate Brand Identity with Logo Image */}
      <Link to="/" className="logo-section">
        <img src={logoImg} alt="Softrate Logo" className="header-logo-img" />
        <span className="logo-blog-tag">Softrate Blog</span>
      </Link>

      {/* 2. Navigation Menu */}
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">All Articles</Link>
          </li>
          <li>
            <a href="/#categories">Categories</a>
          </li>
          <li>
            <a href="https://www.softrateglobal.com/" target="_blank" rel="noopener noreferrer">
              About Softrate
            </a>
          </li>
        </ul>
      </nav>

      {/* 3. Search and Admin Login at Top Right End */}
      <div className="header-actions">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <svg
            className="search-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Admin Login Button kept at the top right end */}
        <Link to="/admin" className="admin-login-btn">
          Admin Login &rarr;
        </Link>
      </div>
    </header>
  );
}
