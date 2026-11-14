import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { INITIAL_ARTICLES } from '../data/blogData';
import { apiUrl } from '../api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [article, setArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load articles from backend if available
  useEffect(() => {
    fetch(apiUrl('/api/articles'))
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (data && data.articles) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  // Find active article based on slug parameter
  useEffect(() => {
    const found = articles.find((a) => a.slug === slug);
    if (found) {
      setArticle(found);
      window.scrollTo(0, 0);
    }
  }, [slug, articles]);

  if (!article) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: '#6B7280', margin: '16px 0 24px 0' }}>
          The requested article could not be located. It might have been moved or updated.
        </p>
        <Link to="/blogs" className="btn-primary">
          Back to All Articles
        </Link>
      </div>
    );
  }

  // Find currentIndex, previous, next, and related articles
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const relatedArticles = articles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  // If not enough in same category, pad with others
  const fallbackRelated = relatedArticles.length > 0
    ? relatedArticles
    : articles.filter((a) => a.slug !== slug).slice(0, 3);

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  const handleShareClick = (platform) => {
    const url = window.location.href;
    const text = encodeURIComponent(article.title);
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard?.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="blog-detail-page">
      {/* Article Header & Breadcrumbs */}
      <div style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '36px 0' }}>
        <div className="container">
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>
            <Link to="/" style={{ color: '#16834A' }}>Home</Link> &rsaquo;{' '}
            <Link to="/blogs" style={{ color: '#16834A' }}>Blogs</Link> &rsaquo;{' '}
            <Link to={`/blogs?category=${encodeURIComponent(article.category)}`} style={{ color: '#16834A' }}>
              {article.category}
            </Link>
          </div>

          <span className="article-badge" style={{ marginTop: 0 }}>
            {article.category}
          </span>

          <h1
            style={{
              fontSize: '34px',
              fontWeight: '800',
              color: '#111827',
              lineHeight: 1.25,
              margin: '12px 0 16px 0'
            }}
          >
            {article.title}
          </h1>

          <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: 1.6, maxWidth: '820px' }}>
            {article.description}
          </p>

          {/* Author and Metadata Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {article.author?.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>
                  {article.author?.name || 'Softrate Editorial Team'}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {article.author?.role || 'Technical Content Contributor'}
                </div>
              </div>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#6B7280' }}>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{article.readTime || '5 min read'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid: Content + Sidebar TOC & Share */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px', alignItems: 'start' }}>
          
          {/* Main Content Area */}
          <div className="article-main-body">
            {/* Featured Image */}
            <div style={{ marginBottom: '32px', borderRadius: '10px', overflow: 'hidden' }}>
              <img
                src={article.imageUrl}
                alt={article.title}
                style={{ width: '100%', maxHeight: '440px', objectFit: 'cover' }}
              />
            </div>

            {/* Article Content Rendered Safely */}
            <div
              className="article-rich-content"
              style={{
                fontSize: '17px',
                lineHeight: 1.75,
                color: '#24292F'
              }}
              dangerouslySetInnerHTML={{
                __html: article.content && (article.content.includes('<p>') || article.content.includes('<h2>'))
                  ? article.content
                  : (article.content || '')
                      .split(/\n\s*\n/)
                      .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
                      .join('')
              }}
            />

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                <h4 style={{ fontSize: '14px', color: '#6B7280', marginBottom: '10px' }}>Tags</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Previous and Next Article Navigation */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginTop: '44px',
                paddingTop: '24px',
                borderTop: '2px solid #E5E7EB'
              }}
            >
              {prevArticle ? (
                <Link
                  to={`/blogs/${prevArticle.slug}`}
                  style={{
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    display: 'block'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#16834A', fontWeight: '700', textTransform: 'uppercase' }}>
                    &larr; Previous Article
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
                    {prevArticle.title}
                  </p>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link
                  to={`/blogs/${nextArticle.slug}`}
                  style={{
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    display: 'block',
                    textAlign: 'right'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#16834A', fontWeight: '700', textTransform: 'uppercase' }}>
                    Next Article &rarr;
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
                    {nextArticle.title}
                  </p>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Sticky Sidebar: Table of Contents & Social Share */}
          <aside className="article-sidebar" style={{ position: 'sticky', top: '90px' }}>
            {/* Table of Contents */}
            {article.tableOfContents && article.tableOfContents.length > 0 && (
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  Table of Contents
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
                  {article.tableOfContents.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      <a
                        href={`#${item.id}`}
                        style={{ color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseOver={(e) => (e.target.style.color = '#16834A')}
                        onMouseOut={(e) => (e.target.style.color = '#4B5563')}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Sharing Box */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                padding: '20px'
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Share This Article
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleShareClick('linkedin')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #0077B5',
                    color: '#0077B5',
                    backgroundColor: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Share on LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => handleShareClick('twitter')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #111827',
                    color: '#111827',
                    backgroundColor: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Share on X (Twitter)
                </button>
                <button
                  type="button"
                  onClick={() => handleShareClick('copy')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #16834A',
                    color: '#16834A',
                    backgroundColor: '#E8F5EC',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedLink ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </aside>

        </div>

        {/* Related Articles Section */}
        <section style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid #E5E7EB' }}>
          <div className="section-header">
            <h2>Related Articles</h2>
            <p>Continue exploring engineering topics from {article.category}.</p>
          </div>
          <div className="articles-grid-3">
            {fallbackRelated.map((rel) => (
              <ArticleCard key={rel.id || rel._id} article={rel} />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

