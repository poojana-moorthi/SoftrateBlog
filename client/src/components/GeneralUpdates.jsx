import ArticleCard from './ArticleCard';

export default function GeneralUpdates({ articles = [] }) {
  return (
    <section className="section-wrapper bg-alt">
      <div className="container">
        <div className="section-header">
          <h2>General Updates</h2>
          <p>Official corporate news, partnership announcements, and community initiatives from Softrate Global.</p>
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

