import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export default function FeaturedPosts({ articles = [] }) {
  // Only include articles where isFeatured is explicitly true
  const featured = articles.filter((a) => Boolean(a.isFeatured));

  // If no articles are selected as featured, do not render this section
  if (featured.length === 0) {
    return null;
  }

  const mainArticle = featured[0];
  const secondaryArticle = featured.length > 1 ? featured[1] : null;

  return (
    <section className="featured-posts container">
      <div className="featured-header">
        <h2>Featured Articles</h2>
      </div>

      <div
        className="featured-grid"
        style={{
          gridTemplateColumns: secondaryArticle ? '1.8fr 1.2fr' : '1fr'
        }}
      >
        {/* Main Large Featured Card (Left) */}
        <article className="main-featured">
          <Link to={`/blogs/${mainArticle.slug}`}>
            <img
              src={mainArticle.imageUrl || heroImg}
              alt={mainArticle.title}
              loading="eager"
            />
          </Link>
          <span>{mainArticle.category}</span>
          <h2>
            <Link to={`/blogs/${mainArticle.slug}`}>{mainArticle.title}</Link>
          </h2>
          <p>{mainArticle.description}</p>
          <div className="article-meta">
            <div className="author-info">
              <span className="author-name">{mainArticle.author?.name || 'Softrate Editorial Team'}</span>
              <small>
                {mainArticle.date || (mainArticle.publishedAt ? new Date(mainArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent')} | {mainArticle.readTime || '6 min read'}
              </small>
            </div>
          </div>
        </article>

        {/* Secondary Featured Card (Right) */}
        {secondaryArticle && (
          <article className="secondary-featured">
            <Link to={`/blogs/${secondaryArticle.slug}`}>
              <img
                src={secondaryArticle.imageUrl || heroImg}
                alt={secondaryArticle.title}
                loading="eager"
              />
            </Link>
            <span>{secondaryArticle.category}</span>
            <h2>
              <Link to={`/blogs/${secondaryArticle.slug}`}>{secondaryArticle.title}</Link>
            </h2>
            <p>{secondaryArticle.description}</p>
            <div className="article-meta">
              <div className="author-info">
                <span className="author-name">{secondaryArticle.author?.name || 'Softrate Editorial Team'}</span>
                <small>
                  {secondaryArticle.date || (secondaryArticle.publishedAt ? new Date(secondaryArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent')} | {secondaryArticle.readTime || '5 min read'}
                </small>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
