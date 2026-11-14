import ArticleCard from './ArticleCard';

export default function GeneralStories({ articles = [] }) {
  return (
    <section className="section-wrapper bg-alt">
      <div className="container">
        <div className="section-header">
          <h2>Technology Stories</h2>
          <p>In-depth engineering perspectives, architectural frameworks, and modern development best practices.</p>
        </div>

        <div className="articles-grid-3">
          {articles.map((article) => (
            <ArticleCard key={article.id || article._id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

