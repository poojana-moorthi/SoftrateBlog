import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, getStoredArticles, saveStoredArticles } from '../data/blogData';
import { apiUrl } from '../api';
import logoImg from '../assets/logo.jpg';

// The Vercel frontend URL — used for the "View" button so it opens the correct deployed page
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || '';

// Helper: Converts HTML into clean plain text for the editor
function formatContentForEditor(html) {
  if (!html) return '';
  if (!/<[a-z][\s\S]*>/i.test(html)) return html;
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

// Helper: Converts plain text paragraphs into clean HTML for display
function formatContentForSaving(text) {
  if (!text) return '';
  if (/<(p|h2|h3|ul|ol|div|blockquote)[^>]*>/i.test(text)) return text;
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
        return `<h2>${trimmed.replace(/^#+\s*/, '')}</h2>`;
      }
      const lines = trimmed.split('\n');
      if (lines.length === 1 && trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.endsWith(',')) {
        return `<h2>${trimmed}</h2>`;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .filter(Boolean)
    .join('\n\n');
}

const DEFAULT_AUTHORS = [
  { id: 'auth-1', name: 'Softrate Editorial Team', role: 'Enterprise Solutions Specialist', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'auth-2', name: 'Priya Sundaram', role: 'Cloud Infrastructure Lead', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80' },
  { id: 'auth-3', name: 'Arjun Krishnamurthy', role: 'AI Research Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
];

function getStoredAuthors() {
  try {
    const raw = localStorage.getItem('softrate_authors_v1');
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch {}
  return DEFAULT_AUTHORS;
}

function saveStoredAuthors(authors) {
  try { localStorage.setItem('softrate_authors_v1', JSON.stringify(authors)); } catch {}
}

export default function AdminCMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [articles, setArticles] = useState(() => getStoredArticles());
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'editor' | 'authors'
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState('');

  // Authors state
  const [authors, setAuthors] = useState(() => getStoredAuthors());
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorRole, setNewAuthorRole] = useState('');

  // Image upload state
  const imageFileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const emptyForm = {
    title: '', slug: '', description: '', category: 'Software Development',
    tags: '', authorName: 'Softrate Editorial Team', authorRole: 'Enterprise Solutions Specialist',
    imageUrl: '', status: 'published', scheduledDate: '', isFeatured: false,
    readTime: '5 min read', content: '', seoTitle: '', metaDescription: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  // Fetch articles from backend on mount
  useEffect(() => {
    fetch(apiUrl('/api/admin/articles'))
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => { if (d?.articles?.length) setArticles(d.articles); })
      .catch(() => {});
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // ── LOGIN ────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const trimmedEmail = loginEmail.trim();
    const trimmedPassword = loginPassword.trim();
    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        showNotification('Signed in successfully as Administrator.');
        return;
      }
      setLoginError('Invalid email or password. Access denied.');
    } catch {
      // Fallback if backend is offline
      if (trimmedEmail === 'admin@softrate.com' && trimmedPassword === 'admin123') {
        setIsAuthenticated(true);
        showNotification('Signed in successfully as Administrator.');
      } else {
        setLoginError('Invalid email or password. Access denied.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ── IMAGE UPLOAD (FileReader → base64) ───────────────────────
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setImagePreview(dataUrl);
      setImageUploading(false);
    };
    reader.onerror = () => setImageUploading(false);
    reader.readAsDataURL(file);
  };

  // ── ARTICLE HELPERS ──────────────────────────────────────────
  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    const slug = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      slug: prev.slug === '' || prev.slug === slug ? slug : prev.slug,
      seoTitle: prev.seoTitle === '' ? `${titleVal} | Softrate Global` : prev.seoTitle,
    }));
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' });
    setImagePreview('');
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
      metaDescription: art.metaDescription || art.description || '',
    });
    setImagePreview(art.imageUrl || '');
    setActiveTab('editor');
  };

  const handleDelete = (artId) => {
    if (!window.confirm('Delete this article?')) return;
    fetch(apiUrl(`/api/articles/${artId}`), { method: 'DELETE' }).catch(() => {});
    setArticles((prev) => {
      const updated = prev.filter((a) => (a.id || a._id) !== artId);
      saveStoredArticles(updated);
      return updated;
    });
    showNotification('Article deleted.');
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const savedContent = formatContentForSaving(formData.content);
    const selectedAuthor = authors.find((a) => a.name === formData.authorName);

    const payload = {
      id: editingId || `art-${Date.now()}`,
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      tags: tagsArray,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
        avatar: selectedAuthor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
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
      section: formData.isFeatured ? 'featured' : 'general',
    };

    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? apiUrl(`/api/articles/${editingId}`) : apiUrl('/api/articles');
    fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});

    if (editingId) {
      setArticles((prev) => {
        const updated = prev.map((a) => ((a.id || a._id) === editingId ? { ...a, ...payload } : a));
        saveStoredArticles(updated);
        return updated;
      });
      showNotification(`Article "${formData.title}" updated!`);
    } else {
      setArticles((prev) => {
        const updated = [payload, ...prev];
        saveStoredArticles(updated);
        return updated;
      });
      showNotification(`Article "${formData.title}" published!`);
    }
    setActiveTab('list');
  };

  // ── AUTHOR HELPERS ───────────────────────────────────────────
  const handleAddAuthor = (e) => {
    e.preventDefault();
    if (!newAuthorName.trim()) return;
    const newA = { id: `auth-${Date.now()}`, name: newAuthorName.trim(), role: newAuthorRole.trim() || 'Contributor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' };
    const updated = [...authors, newA];
    setAuthors(updated);
    saveStoredAuthors(updated);
    fetch(apiUrl('/api/authors'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newA) }).catch(() => {});
    setNewAuthorName('');
    setNewAuthorRole('');
    showNotification(`Author "${newA.name}" added.`);
  };

  const handleDeleteAuthor = (id) => {
    if (!window.confirm('Remove this author?')) return;
    const updated = authors.filter((a) => a.id !== id);
    setAuthors(updated);
    saveStoredAuthors(updated);
    fetch(apiUrl(`/api/authors/${id}`), { method: 'DELETE' }).catch(() => {});
    showNotification('Author removed.');
  };

  // ── LOGIN SCREEN ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 24px', maxWidth: '440px' }}>
        <div style={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '36px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src={logoImg} alt="Softrate" style={{ height: '48px', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>Softrate Admin CMS</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Sign in to manage articles and publication workflows</p>
          </div>
          {loginError && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Admin Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Enter admin email" autoComplete="email" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none' }} required />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoggingIn} style={{ justifyContent: 'center', marginTop: '8px', opacity: isLoggingIn ? 0.7 : 1 }}>
              {isLoggingIn ? 'Verifying...' : 'Sign In to CMS →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────
  return (
    <div className="admin-cms container" style={{ padding: '36px 24px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '20px', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#16834A', fontWeight: '700', textTransform: 'uppercase' }}>Content Management System</span>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '4px 0 0 0' }}>Softrate Publishing Portal</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="button" className="btn-primary" onClick={handleStartCreate}>+ Create New Article</button>
          <button type="button" onClick={() => setIsAuthenticated(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#FFF', color: '#6B7280', fontSize: '13px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{ backgroundColor: '#E8F5EC', color: '#16834A', border: '1px solid #C4E7D0', padding: '12px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
          {notification}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { key: 'list', label: `All Articles (${articles.length})` },
          { key: 'editor', label: editingId ? 'Edit Article' : 'Article Editor' },
          { key: 'authors', label: `Authors (${authors.length})` },
        ].map((tab) => (
          <button key={tab.key} type="button"
            onClick={() => tab.key === 'editor' ? handleStartCreate() : setActiveTab(tab.key)}
            style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', fontSize: '14px', fontWeight: '600', backgroundColor: activeTab === tab.key ? '#16834A' : '#F3F4F6', color: activeTab === tab.key ? '#FFF' : '#4B5563', cursor: 'pointer' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: ARTICLES LIST ── */}
      {activeTab === 'list' && (
        <div style={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563' }}>
                <th style={{ padding: '14px 18px' }}>Title &amp; Slug</th>
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
                  <td style={{ padding: '14px 18px', maxWidth: '300px' }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{art.title}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>/{art.slug}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="article-badge" style={{ margin: 0 }}>{art.category}</span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', backgroundColor: art.status === 'published' ? '#DEF7EC' : art.status === 'scheduled' ? '#FEF08A' : '#F3F4F6', color: art.status === 'published' ? '#03543F' : art.status === 'scheduled' ? '#854D0E' : '#374151' }}>
                      {art.status || 'published'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {art.isFeatured ? <span style={{ color: '#16834A', fontWeight: '700' }}>Yes</span> : <span style={{ color: '#9CA3AF' }}>No</span>}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#6B7280', fontSize: '13px' }}>{art.author?.name || 'Softrate Team'}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      {/* View opens the Vercel frontend URL for the blog post */}
                      <a
                        href={`${FRONTEND_URL}/blogs/${art.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#4B5563', textDecoration: 'none' }}>
                        View
                      </a>
                      <button type="button" onClick={() => handleStartEdit(art)} style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #16834A', backgroundColor: '#E8F5EC', fontSize: '12px', color: '#16834A', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                      <button type="button" onClick={() => handleDelete(art.id || art._id)} style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', fontSize: '12px', color: '#B91C1C', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB: ARTICLE EDITOR ── */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSaveArticle} style={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#111827' }}>{editingId ? 'Edit Article' : 'Create New Article'}</h3>
            <button type="button" onClick={() => setActiveTab('list')} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer' }}>← Cancel</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Left: Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Article Title *</label>
                <input type="text" value={formData.title} onChange={handleTitleChange} placeholder="e.g. How Cloud Native Architecture Powers Global Scale" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '15px' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>URL Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '14px' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Short Summary *</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief 2-3 sentence summary..." style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '14px' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Article Content *</label>
                <textarea rows={14} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your article content here. Separate paragraphs with an empty line. No HTML tags needed." style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '15px', lineHeight: '1.6', fontFamily: 'inherit' }} required />
                <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', display: 'block' }}>Write naturally in plain text. No HTML tags needed.</span>
              </div>

              {/* SEO */}
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>SEO &amp; Metadata</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>SEO Title</label>
                    <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Meta Description</label>
                    <input type="text" value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Publishing Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status */}
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Publishing</h4>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                {formData.status === 'scheduled' && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Schedule Date</label>
                    <input type="datetime-local" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  <label htmlFor="isFeatured" style={{ fontSize: '13px', fontWeight: '600' }}>Feature on Homepage</label>
                </div>
              </div>

              {/* Category & Tags */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Tags (comma separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="React, Security, Cloud" style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
              </div>

              {/* Author — select from saved authors */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Author</label>
                <select
                  value={formData.authorName}
                  onChange={(e) => {
                    const sel = authors.find((a) => a.name === e.target.value);
                    setFormData({ ...formData, authorName: e.target.value, authorRole: sel?.role || formData.authorRole });
                  }}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                  {authors.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                  <option value="__custom__">— Custom —</option>
                </select>
                {formData.authorName === '__custom__' && (
                  <>
                    <input type="text" value={formData.authorName === '__custom__' ? '' : formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} placeholder="Custom author name" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '6px' }} />
                    <input type="text" value={formData.authorRole} onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })} placeholder="Role / Title" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                  </>
                )}
                {formData.authorName !== '__custom__' && (
                  <input type="text" value={formData.authorRole} onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })} placeholder="Role / Title" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Featured Image</label>
                {/* File upload */}
                <div style={{ border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '16px', textAlign: 'center', marginBottom: '10px', cursor: 'pointer', backgroundColor: '#FAFAFA' }} onClick={() => imageFileRef.current?.click()}>
                  <input ref={imageFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFileChange} />
                  {imageUploading ? (
                    <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Uploading...</p>
                  ) : (
                    <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Click to upload an image from your device</p>
                  )}
                </div>
                {/* OR URL */}
                <input
                  type="text"
                  value={formData.imageUrl?.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={(e) => { setFormData({ ...formData, imageUrl: e.target.value }); setImagePreview(e.target.value); }}
                  placeholder="Or paste an image URL..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px' }}
                />
                {/* Preview */}
                {(imagePreview || formData.imageUrl) && (
                  <img src={imagePreview || formData.imageUrl} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Reading Time</label>
                <input type="text" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} placeholder="5 min read" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {editingId ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── TAB: AUTHORS ── */}
      {activeTab === 'authors' && (
        <div>
          {/* Add Author Form */}
          <div style={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>Add New Author</h3>
            <form onSubmit={handleAddAuthor} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input type="text" value={newAuthorName} onChange={(e) => setNewAuthorName(e.target.value)} placeholder="Full Name *" required style={{ flex: 1, minWidth: '180px', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '14px' }} />
              <input type="text" value={newAuthorRole} onChange={(e) => setNewAuthorRole(e.target.value)} placeholder="Role / Title (optional)" style={{ flex: 1, minWidth: '180px', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '14px' }} />
              <button type="submit" className="btn-primary">Add Author</button>
            </form>
          </div>

          {/* Authors List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {authors.map((author) => (
              <div key={author.id} style={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={author.avatar} alt={author.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{author.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{author.role}</div>
                </div>
                <button type="button" onClick={() => handleDeleteAuthor(author.id)} style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', fontSize: '12px', color: '#B91C1C', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
