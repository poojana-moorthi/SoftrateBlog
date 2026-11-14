import { useState, useEffect } from 'react';
import FeaturedPosts from '../components/FeaturedPosts';
import GeneralStories from '../components/GeneralStories';
import ExploreCategories from '../components/ExploreCategories';
import LatestStories from '../components/LatestStories';
import ViewAllStoriesCTA from '../components/ViewAllStoriesCTA';
import TrendsInsights from '../components/TrendsInsights';
import GeneralUpdates from '../components/GeneralUpdates';
import ProductUpdates from '../components/ProductUpdates';
import { INITIAL_ARTICLES, CATEGORIES, getStoredArticles } from '../data/blogData';

export default function HomePage() {
  const [articles, setArticles] = useState(() => getStoredArticles());
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    // Attempt to fetch fresh articles from the Express backend API
    fetch('/api/articles')
      .then((res) => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then((data) => {
        if (data && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {
        // Fallback: use localStorage data (already set via initial state)
      });

    // Listen for changes made in Admin CMS (localStorage sync)
    const handleArticlesUpdated = () => {
      setArticles(getStoredArticles());
    };
    window.addEventListener('articlesUpdated', handleArticlesUpdated);
    return () => window.removeEventListener('articlesUpdated', handleArticlesUpdated);
  }, []);

  // Filter articles for each required section in exact order
  const featuredArticles = articles.filter((a) => Boolean(a.isFeatured));
  const generalArticles = articles.filter((a) => a.section === 'general').slice(0, 3);
  const latestArticles = articles.filter((a) => a.section === 'latest' || a.section === 'general').slice(0, 3);
  const trendArticles = articles.filter((a) => a.section === 'trends').slice(0, 2);
  const generalUpdates = articles.filter((a) => a.section === 'general-updates').slice(0, 2);
  const productUpdates = articles.filter((a) => a.section === 'product-updates').slice(0, 2);

  return (
    <main className="homepage-content">
      {/* 2. Featured Articles: large left card & smaller right card */}
      <FeaturedPosts articles={featuredArticles} />

      {/* 3. General technology blog stories */}
      <GeneralStories articles={generalArticles.length ? generalArticles : articles.slice(2, 5)} />

      {/* 4. Explore Categories */}
      <ExploreCategories categories={categories} />

      {/* 5. Latest Stories */}
      <LatestStories articles={latestArticles.length ? latestArticles : articles.slice(0, 3)} />

      {/* 6. View All Stories button */}
      <ViewAllStoriesCTA />

      {/* 7. Trends & Insights */}
      <TrendsInsights articles={trendArticles.length ? trendArticles : articles.slice(5, 7)} />

      {/* 8. General Updates */}
      <GeneralUpdates articles={generalUpdates.length ? generalUpdates : articles.slice(7, 9)} />

      {/* 9. Product Updates */}
      <ProductUpdates articles={productUpdates.length ? productUpdates : articles.slice(9, 11)} />
    </main>
  );
}
