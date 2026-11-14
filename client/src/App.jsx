import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListingPage from './pages/BlogListingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminCMSPage from './pages/AdminCMSPage';
import './App.css';

/**
 * Softrate Global Blog - Main Application Root
 * Sets up client-side routing for:
 *   - / (Homepage with all 11 required Zoho-inspired sections in exact order)
 *   - /blogs (All articles listing with category filters and keyword search)
 *   - /blogs/:slug (Individual article page with TOC, reading time, code blocks)
 *   - /admin (Admin CMS for publishing, drafting, scheduling, editing articles)
 */
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogListingPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/admin" element={<AdminCMSPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
