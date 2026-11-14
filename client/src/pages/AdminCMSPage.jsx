import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_ARTICLES, CATEGORIES, getStoredArticles, saveStoredArticles } from '../data/blogData';
import logoImg from '../assets/logo.jpg';

// Helper: Converts HTML into clean, normal plain text for the editor
function formatContentForEditor(html) {
  if (!html) return '';
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html;
  }
  return html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n\n"$1"\n\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
    .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n\n$1\n\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '$1')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Helper: Converts normal plain text paragraphs into clean HTML for display
function formatContentForSaving(text) {
  if (!text) return '';
  if (/<(p|h2|h3|ul|ol|div|blockquote)[^>]*>/i.test(text)) {
    return text;
  }
  const blocks = text.split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed
          .split('\n')
          .map((line) => `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }

      if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^#+\s*/, '');
        return `<h2>${headingText}</h2>`;
      }

      const lines = trimmed.split('\n');
      if (lines.length === 1 && trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.endsWith(',')) {
        return `<h2>${trimmed}</h2>`;
      }

      const withBr = trimmed.replace(/\n/g, '<br/>');
      return `<p>${withBr}</p>`;
    })
    .filter(Boolean)
    .join('\n\n');
}

export default function AdminCMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [articles, setArticles] = useState(() => getStoredArticles());
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'editor' | 'categories'
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState('');

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Software Development',
    tags: '',
    authorName: 'Softrate Editorial Team',
    authorRole: 'Enterprise Solutions Specialist',
    imageUrl: '',
    status: 'published', // 'published' | 'draft' | 'scheduled'
    scheduledDate: '',
    isFeatured: false,
    readTime: '5 min read',
    content: '',
    seoTitle: '',
    metaDescription: ''
  });

  // Attempt to fetch articles from backend
  const fetchArticlesFromAPI = () => {
    fetch('/api/admin/articles')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data && data.articles) setArticles(data.articles);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchArticlesFromAPI();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const trimmedEmail = loginEmail.trim();
    const trimmedPassword = loginPassword.trim();

    try {
      // Authenticate against backend REST API
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginError('');
        showNotification('Signed in successfully as Administrator.');
        return;
      }

      setLoginError('Invalid email or password. Access denied.');
    } catch {
      // In-memory fallback if backend server is not running
      if (trimmedEmail === 'admin@softrate.com' && trimmedPassword === 'admin123') {
        setIsAuthenticated(true);
        setLoginError('');
        showNotification('Signed in successfully as Administrator.');
      } else {
        setLoginError('Invalid email or password. Access denied.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Auto-generate URL slug from title
  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    const generatedSlug = titleVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      slug: prev.slug === '' || prev.slug === generatedSlug ? generatedSlug : prev.slug,
      seoTitle: prev.seoTitle === '' ? `${titleVal} | Softrate Global` : prev.seoTitle
    }));
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: 'Software Development',
      tags: '',
      authorName: 'Softrate Editorial Team',
      authorRole: 'Enterprise Solutions Specialist',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      scheduledDate: '',
      isFeatured: false,
      readTime: '5 min read',
      content: '',
      seoTitle: '',
      metaDescription: ''
    });
    setActiveTab('editor');
  };

  const handleStartEdit = (art) => {
    setEditingId(art.id || art._id);
    setFormData({
      title: art.title || '',
      slug: art.slug || '',
      description: art.description || '',
      category: art.category || 'Software Development',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : '',
      authorName: art.author?.name || 'Softrate Editorial Team',
      authorRole: art.author?.role || 'Technical Lead',
      imageUrl: art.imageUrl || '',
      status: art.status || 'published',
      scheduledDate: art.scheduledDate || '',
      isFeatured: Boolean(art.isFeatured),
      readTime: art.readTime || '5 min read',
      content: formatContentForEditor(art.content || ''),
      seoTitle: art.seoTitle || `${art.title} | Softrate Global`,
      metaDescription: art.metaDescription || art.description || ''
    });
    setActiveTab('editor');
  };

  const handleDelete = (artId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    fetch(`/api/articles/${artId}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('API delete failed');
      })
      .catch(() => {});

    setArticles((prev) => {
      const updated = prev.filter((a) => (a.id || a._id) !== artId);
      saveStoredArticles(updated);
      return updated;
    });
    showNotification('Article deleted successfully.');
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const savedContent = formatContentForSaving(formData.content);

    const articlePayload = {
      id: editingId || `art-${Date.now()}`,
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      tags: tagsArray,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      imageUrl: formData.imageUrl,
      status: formData.status,
      scheduledDate: formData.scheduledDate,
      isFeatured: formData.isFeatured,
      readTime: formData.readTime,
      content: savedContent,
      seoTitle: formData.seoTitle,
      metaDescription: formData.metaDescription,
      publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
      section: formData.isFeatured ? 'featured' : 'general'
    };

    // Save to backend API if live
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `/api/articles/${editingId}` : '/api/articles';
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articlePayload)
    }).catch(() => {});

    // Update in-memory state + persist to localStorage
    if (editingId) {
      setArticles((prev) => {
        const updated = prev.map((a) => ((a.id || a._id) === editingId ? { ...a, ...articlePayload } : a));
        saveStoredArticles(updated);
        return updated;
      });
      showNotification(`Article "${formData.title}" updated successfully!`);
    } else {
      setArticles((prev) => {
        const updated = [articlePayload, ...prev];
        saveStoredArticles(updated);
        return updated;
      });
      showNotification(`Article "${formData.title}" created successfully!`);
    }

    setActiveTab('list');
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 24px', maxWidth: '440px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '36px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src={logoImg}
              alt="Softrate Logo"
              style={{ height: '48px', objectFit: 'contain', margin: '0 auto 12px auto', display: 'block' }}
            />
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>
              Softrate Admin CMS
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
              Sign in to manage articles, categories, and publication workflows
            </p>
          </div>

          {loginError && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  outline: 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoggingIn}
              style={{ justifyContent: 'center', marginTop: '8px', opacity: isLoggingIn ? 0.7 : 1 }}
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In to CMS →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cms container" style={{ padding: '36px 24px' }}>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '20px',
          marginBottom: '28px'
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: '#16834A', fontWeight: '700', textTransform: 'uppercase' }}>
            Content Management System
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '4px 0 0 0' }}>
            Softrate Publishing Portal
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleStartCreate}
          >
            + Create New Article
          </button>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#6B7280',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          style={{
            backgroundColor: '#E8F5EC',
            color: '#16834A',
            border: '1px solid #C4E7D0',
            padding: '12px 18px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px'
          }}
        >
          {notification}
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: activeTab === 'list' ? '#16834A' : '#F3F4F6',
            color: activeTab === 'list' ? '#FFFFFF' : '#4B5563',
            cursor: 'pointer'
          }}
        >
          All Articles ({articles.length})
        </button>
        <button
          type="button"
          onClick={handleStartCreate}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: activeTab === 'editor' ? '#16834A' : '#F3F4F6',
            color: activeTab === 'editor' ? '#FFFFFF' : '#4B5563',
            cursor: 'pointer'
          }}
        >
          {editingId ? 'Edit Article' : 'Article Editor'}
        </button>
      </div>

      {/* TAB 1: ARTICLES LIST */}
      {activeTab === 'list' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563' }}>
                <th style={{ padding: '14px 18px' }}>Title & Slug</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Featured</th>
                <th style={{ padding: '14px 18px' }}>Author</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art.id || art._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 18px', maxWidth: '320px' }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{art.title}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>/{art.slug}</div>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#4B5563' }}>
                    <span className="article-badge" style={{ margin: 0 }}>
                      {art.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        backgroundColor:
                          art.status === 'published' ? '#DEF7EC' : art.status === 'scheduled' ? '#FEF08A' : '#F3F4F6',
                        color:
                          art.status === 'published' ? '#03543F' : art.status === 'scheduled' ? '#854D0E' : '#374151'
                      }}
                    >
                      {art.status || 'published'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {art.isFeatured ? (
                      <span style={{ color: '#16834A', fontWeight: '700' }}>Yes</span>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>No</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#6B7280', fontSize: '13px' }}>
                    {art.author?.name || 'Softrate Team'}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Link
                        to={`/blogs/${art.slug}`}
                        target="_blank"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid #E5E7EB',
                          fontSize: '12px',
                          color: '#4B5563'
                        }}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(art)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid #16834A',
                          backgroundColor: '#E8F5EC',
                          fontSize: '12px',
                          color: '#16834A',
                          fontWeight: '600'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(art.id || art._id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid #FCA5A5',
                          backgroundColor: '#FEE2E2',
                          fontSize: '12px',
                          color: '#B91C1C',
                          fontWeight: '600'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ARTICLE EDITOR */}
      {activeTab === 'editor' && (
        <form
          onSubmit={handleSaveArticle}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            padding: '32px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#111827' }}>
              {editingId ? 'Edit Article' : 'Create New Technical Article'}
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer' }}
            >
              &larr; Cancel and Return to List
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Left Column: Core Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. How Cloud Native Architecture Powers Global Scale"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '15px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  URL Slug (Customizable SEO identifier) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="how-cloud-native-architecture-powers-global-scale"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Short Summary / Excerpt *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief 2-3 sentence summary that appears on blog cards and search results..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Article Content *
                </label>
                <textarea
                  rows={14}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Type or paste your article content here as normal text. Separate paragraphs with an empty line..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    fontFamily: 'inherit'
                  }}
                  required
                />
                <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                  Write naturally in normal text format. No HTML tags needed.
                </span>
              </div>

              {/* SEO Metadata Box */}
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  SEO & Metadata Configuration
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                      Meta Description
                    </label>
                    <input
                      type="text"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Publishing Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
                  Publishing Status
                </h4>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="scheduled">Scheduled for Future</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                      Schedule Publication Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Feature on Homepage (Top Spot)
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Primary Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, Microservices, Security"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Author Name & Role
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Author Name"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}
                />
                <input
                  type="text"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="Job Role / Title"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Reading Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="e.g. 5 min read"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {editingId ? 'Update Article' : 'Publish Article Now'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

