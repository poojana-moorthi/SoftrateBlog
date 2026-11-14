import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { INITIAL_ARTICLES, CATEGORIES } from '../data/blogData';

export default function BlogListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync state if URL query params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Attempt to fetch articles from backend
  useEffect(() => {
    fetch('/api/articles')
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

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setVisibleCount(6);
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setVisibleCount(6);
    if (val.trim()) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  // Filter articles based on category and search query
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags &&
        article.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="blog-listing-page container" style={{ padding: '40px 24px' }}>
      {/* Header Banner */}
      <div className="listing-header" style={{ marginBottom: '32px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
          All Technology Articles
        </h1>
        <p style={{ color: '#626B75', fontSize: '16px' }}>
          Explore insightful tutorials, architecture guides, and industry analyses from Softrate Global engineers.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div
        className="filters-bar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E5E7EB'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleCategorySelect('All')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: selectedCategory === 'All' ? '#16834A' : '#F3F4F6',
              color: selectedCategory === 'All' ? '#FFFFFF' : '#4B5563',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s'
            }}
          >
            All Topics ({articles.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.name)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: selectedCategory === cat.name ? '#16834A' : '#F3F4F6',
                color: selectedCategory === cat.name ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* In-page Search Input */}
        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search within articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Article Count & Active Filter Indicator */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#6B7280' }}>
        Showing <strong>{displayedArticles.length}</strong> of{' '}
        <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'article' : 'articles'}
        {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
        {searchQuery.trim() && <span> matching "<strong>{searchQuery}</strong>"</span>}
      </div>

      {/* Articles Grid */}
      {displayedArticles.length > 0 ? (
        <div className="articles-grid-3">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.id || article._id} article={article} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#F9FAFB',
            borderRadius: '10px',
            border: '1px dashed #D1D5DB'
          }}
        >
          <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>
            No articles found
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
            Try searching for a different keyword or resetting category filters.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSearchParams({});
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setVisibleCount((prev) => prev + 6)}
          >
            Load More Articles ({filteredArticles.length - visibleCount} remaining) &darr;
          </button>
        </div>
      )}
    </div>
  );
}

