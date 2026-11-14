import { USEFUL_LINKS } from '../data/blogData';

export default function UsefulLinks() {
  return (
    <section className="section-wrapper bg-alt">
      <div className="container">
        <div className="section-header">
          <h2>Useful Links & Developer Resources</h2>
          <p>Quick access to Softrate engineering documentation, community channels, and open-source packages.</p>
        </div>

        <div className="useful-links-grid">
          {USEFUL_LINKS.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target={item.isExternal ? '_blank' : '_self'}
              rel={item.isExternal ? 'noopener noreferrer' : ''}
              className="useful-link-card"
            >
              <div className="link-card-header">
                <span className="link-badge">{item.badge}</span>
                <span>↗</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <span className="useful-link-action">Access Resource &rarr;</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

