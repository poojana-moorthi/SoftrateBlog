import { Link } from 'react-router-dom';

export default function ArticleCard({ article, horizontal = false }) {
  if (!article) return null;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  if (horizontal) {
    return (
      <article className="card-horizontal">
        <div className="card-image-wrap">
          <Link to={`/blogs/${article.slug}`}>
            <img src={article.imageUrl} alt={article.title} loading="lazy" />
          </Link>
        </div>
        <div className="card-body">
          <span className="article-badge">{article.category}</span>
          <h3 className="card-title">
            <Link to={`/blogs/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="card-description">{article.description}</p>
          <div className="card-footer">
            <span>By {article.author?.name || 'Softrate Team'}</span>
            <span>{formattedDate} • {article.readTime || '5 min read'}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card">
      <div className="card-image-wrap">
        <Link to={`/blogs/${article.slug}`}>
          <img src={article.imageUrl} alt={article.title} loading="lazy" />
        </Link>
      </div>
      <div className="card-body">
        <span className="article-badge">{article.category}</span>
        <h3 className="card-title">
          <Link to={`/blogs/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="card-description">{article.description}</p>
        <div className="card-footer">
          <span>By {article.author?.name || 'Softrate Team'}</span>
          <span>{formattedDate} • {article.readTime || '5 min read'}</span>
        </div>
      </div>
    </article>
  );
}

