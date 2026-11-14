import ArticleCard from './ArticleCard';

export default function ProductUpdates({ articles = [] }) {
  return (
    <section className="section-wrapper">
      <div className="container">
        <div className="section-header">
          <h2>Product Updates</h2>
          <p>Latest product features, API enhancements, release notes, and developer tooling rollouts.</p>
        </div>

        <div className="articles-grid-2">
          {articles.map((article) => (
            <ArticleCard key={article.id || article._id} article={article} horizontal={true} />
          ))}
        </div>
      </div>
    </section>
  );
}

