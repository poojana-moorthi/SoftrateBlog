import { Link } from 'react-router-dom';

export default function ViewAllStoriesCTA() {
  return (
    <section className="container">
      <div className="view-all-cta-banner">
        <h3>Explore Our Entire Technical Knowledge Base</h3>
        <p>
          Discover comprehensive architectural guides, tutorials, and deep dives across cloud computing, AI, web frameworks, and cybersecurity.
        </p>
        <Link to="/blogs" className="btn-primary">
          View All Stories &rarr;
        </Link>
      </div>
    </section>
  );
}

