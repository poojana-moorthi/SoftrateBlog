import ArticleCard from './ArticleCard';

export default function TrendsInsights({ articles = [] }) {
  return (
    <section className="section-wrapper">
      <div className="container">
        <div className="section-header">
          <h2>Trends & Insights</h2>
          <p>Analysis of emerging architectural paradigms, market shifts, and future enterprise technologies.</p>
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

