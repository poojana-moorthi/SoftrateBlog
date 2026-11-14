import ArticleCard from './ArticleCard';

export default function LatestStories({ articles = [] }) {
  return (
    <section className="section-wrapper bg-alt">
      <div className="container">
        <div className="section-header">
          <h2>Latest Stories</h2>
          <p>Freshly published research, security analyses, and developer tutorials.</p>
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

