import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/blogData';

export default function ExploreCategories({ categories = CATEGORIES }) {
  return (
    <section id="categories" className="section-wrapper">
      <div className="container">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <p>Browse targeted technical articles across our primary engineering domains.</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.name}
              to={`/blogs?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <div className="category-info">
                <h4>{cat.name}</h4>
                <p>{cat.description}</p>
                <span className="category-count">{cat.count ? `${cat.count} Articles` : 'Explore'} &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

