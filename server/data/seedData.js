export const INITIAL_CATEGORIES = [
  { name: 'Software Development', icon: '💻', count: 8, description: 'Best practices, software architecture, patterns and clean code.' },
  { name: 'Artificial Intelligence & Machine Learning', icon: '🤖', count: 6, description: 'AI innovation, LLMs, neural networks and automated workflows.' },
  { name: 'Web and Mobile App Development', icon: '📱', count: 7, description: 'Modern frontends, React, responsive design and native apps.' },
  { name: 'Technology & Innovation', icon: '⚡', count: 5, description: 'Emerging digital technologies transforming modern enterprises.' },
  { name: 'Cybersecurity', icon: '🔒', count: 4, description: 'Zero trust security, encryption, compliance and threat defense.' },
  { name: 'Cloud Computing', icon: '☁️', count: 6, description: 'AWS, Azure, Docker, Kubernetes and scalable infrastructure.' },
  { name: 'Industry Insights', icon: '📈', count: 5, description: 'Market research, executive perspectives and tech business trends.' }
];

export const INITIAL_ARTICLES = [
  {
    title: 'How Modern Web Applications Are Transforming Businesses',
    slug: 'how-modern-web-applications-are-transforming-businesses',
    description: 'Discover how modern web technologies are helping businesses improve their digital presence, streamline operations, and deliver better user experiences through scalable and secure web applications.',
    category: 'Web and Mobile App Development',
    tags: ['Web Development', 'React', 'Cloud', 'Digital Transformation'],
    author: {
      name: 'Softrate Editorial Team',
      role: 'Enterprise Solutions Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    isFeatured: true,
    isSecondaryFeatured: false,
    section: 'featured',
    readTime: '6 min read',
    publishedAt: new Date('2026-11-12T09:00:00.000Z'),
    tableOfContents: [
      { id: 'intro', text: 'The Evolution of Modern Web Applications' },
      { id: 'architecture', text: 'Architectural Shift: Single Page and Progressive Web Apps' },
      { id: 'speed', text: 'Performance, User Experience and Business Conversion' },
      { id: 'scalability', text: 'Cloud Infrastructure and Microservices Integration' }
    ],
    content: `
      <p>In today's fast-paced digital ecosystem, web applications have evolved far beyond static informational brochures. Modern enterprises rely on dynamic, data-driven web applications to drive core business operations, deliver seamless customer interactions, and scale across global markets.</p>
      <h2 id="intro">The Evolution of Modern Web Applications</h2>
      <p>Over the past decade, web engineering has undergone a profound transformation. What once required bulky desktop software can now be executed instantly inside a lightweight web browser.</p>
      <h2 id="architecture">Architectural Shift: Single Page and Progressive Web Apps</h2>
      <p>Modern frontend frameworks such as React and Vite have democratized responsive single-page applications. Paired with PWA standards, web apps offer offline caching and native app fluidity.</p>
      <h2 id="speed">Performance, User Experience and Business Conversion</h2>
      <p>Every 100ms improvement in page speed directly improves customer retention and conversion metrics.</p>
    `
  },
  {
    title: 'How Artificial Intelligence Is Shaping the Future of Software Development',
    slug: 'how-artificial-intelligence-is-shaping-the-future-of-software-development',
    description: 'Explore how artificial intelligence is transforming software development through intelligent automation, faster workflows, and smarter digital solutions.',
    category: 'Artificial Intelligence & Machine Learning',
    tags: ['AI', 'Machine Learning', 'Automation', 'Developer Productivity'],
    author: {
      name: 'Softrate Editorial Team',
      role: 'AI & Data Science Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    isFeatured: true,
    isSecondaryFeatured: true,
    section: 'featured',
    readTime: '5 min read',
    publishedAt: new Date('2026-11-12T08:30:00.000Z'),
    tableOfContents: [
      { id: 'ai-era', text: 'The Dawn of AI-Assisted Engineering' },
      { id: 'code-gen', text: 'Automating Repetitive Boilerplate' },
      { id: 'qa-testing', text: 'Predictive Testing and Bug Detection' }
    ],
    content: `
      <p>Artificial intelligence is rapidly becoming an indispensable co-pilot in modern software engineering. From automated test creation to semantic code analysis, AI models are reshaping developer workflows.</p>
      <h2 id="ai-era">The Dawn of AI-Assisted Engineering</h2>
      <p>Modern development teams face accelerating deadlines. AI models reduce friction and accelerate prototyping phases.</p>
      <h2 id="code-gen">Automating Repetitive Boilerplate</h2>
      <p>Automating CRUD layers and DTO mappings allows engineers to focus on architectural decisions and complex domain algorithms.</p>
    `
  },
  {
    title: 'Building Resilient Cloud-Native Systems with Microservices',
    slug: 'building-resilient-cloud-native-systems-with-microservices',
    description: 'Learn foundational patterns for building scalable, fault-tolerant microservices that withstand network partitions and traffic surges.',
    category: 'Cloud Computing',
    tags: ['Cloud', 'Microservices', 'Docker', 'Kubernetes'],
    author: {
      name: 'Priya Sundaram',
      role: 'Principal Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'general',
    readTime: '7 min read',
    publishedAt: new Date('2026-11-10T11:00:00.000Z'),
    content: `<p>Transitioning from monolithic applications to microservices offers operational independence, but introduces distributed systems challenges. Circuit breakers and rate limiters are essential.</p>`
  },
  {
    title: 'Designing Accessible User Interfaces: Principles for Modern Web & Mobile',
    slug: 'designing-accessible-user-interfaces-principles-for-modern-web-mobile',
    description: 'A comprehensive guide to WCAG compliance, semantic HTML, color contrast, and creating digital experiences that everyone can use.',
    category: 'Web and Mobile App Development',
    tags: ['UI/UX', 'Accessibility', 'CSS', 'Design Systems'],
    author: {
      name: 'Karthik Raman',
      role: 'Design Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'general',
    readTime: '4 min read',
    publishedAt: new Date('2026-11-09T14:20:00.000Z'),
    content: `<p>Digital accessibility ensures people with diverse abilities can perceive, understand, navigate, and interact with the web easily.</p>`
  },
  {
    title: 'Clean Architecture in Node.js: Structuring Maintainable Enterprise Backends',
    slug: 'clean-architecture-in-nodejs-structuring-maintainable-enterprise-backends',
    description: 'Structure your Express and Node.js applications with separation of concerns, domain entities, repository patterns, and clean testability.',
    category: 'Software Development',
    tags: ['Software Engineering', 'Node.js', 'Clean Code', 'Backend'],
    author: {
      name: 'Arun Kumar',
      role: 'Senior Backend Architect',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'general',
    readTime: '6 min read',
    publishedAt: new Date('2026-11-08T10:15:00.000Z'),
    content: `<p>Organizing Node.js applications into clear controllers, services, and domain entities prevents messy codebases and ensures long-term testability.</p>`
  },
  {
    title: 'Zero Trust Security Architecture: Defending the Modern Cloud Perimeter',
    slug: 'zero-trust-security-architecture-defending-the-modern-cloud-perimeter',
    description: 'Never trust, always verify. How modern enterprises enforce identity verification, micro-segmentation, and encrypted transit everywhere.',
    category: 'Cybersecurity',
    tags: ['Cybersecurity', 'Zero Trust', 'Cloud Security'],
    author: {
      name: 'Siddharth Rao',
      role: 'Security Engineer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'latest',
    readTime: '5 min read',
    publishedAt: new Date('2026-11-13T07:15:00.000Z'),
    content: `<p>Zero trust enforces continuous identity verification at every transaction across hybrid cloud architectures.</p>`
  },
  {
    title: 'Optimizing Mobile App Performance: Cross-Platform vs Native Performance',
    slug: 'optimizing-mobile-app-performance-cross-platform-vs-native-performance',
    description: 'Deep dive into frame rendering, memory management, bundle sizes, and battery efficiency for hybrid and native mobile apps.',
    category: 'Web and Mobile App Development',
    tags: ['Mobile Applications', 'React Native', 'Performance'],
    author: {
      name: 'Ananya Sharma',
      role: 'Mobile Engineering Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'latest',
    readTime: '6 min read',
    publishedAt: new Date('2026-11-12T16:45:00.000Z'),
    content: `<p>Choosing between native and cross-platform requires evaluating CPU bottlenecks, frame rates, and battery usage.</p>`
  },
  {
    title: 'Scaling E-Commerce Platforms for High-Concurrency Flash Sales',
    slug: 'scaling-e-commerce-platforms-for-high-concurrency-flash-sales',
    description: 'Architecting inventory locks, distributed caching with Redis, message queues, and resilient checkout pipelines during 100x traffic spikes.',
    category: 'Software Development',
    tags: ['E-commerce', 'Distributed Systems', 'Redis', 'Database'],
    author: {
      name: 'Softrate Engineering Desk',
      role: 'Commerce Infrastructure Group',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224d?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'latest',
    readTime: '7 min read',
    publishedAt: new Date('2026-11-11T13:00:00.000Z'),
    content: `<p>Handling thousands of simultaneous checkout attempts requires atomic database transactions and distributed locks.</p>`
  },
  {
    title: 'The Rise of Edge Computing and Next-Gen API Gateways in 2026',
    slug: 'the-rise-of-edge-computing-and-next-gen-api-gateways-in-2026',
    description: 'How bringing computation closer to users reduces latency to single-digit milliseconds and decentralizes data processing.',
    category: 'Technology & Innovation',
    tags: ['Edge Computing', 'APIs', 'Cloud', 'Trends'],
    author: {
      name: 'Priya Sundaram',
      role: 'Principal Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'trends',
    readTime: '5 min read',
    publishedAt: new Date('2026-11-10T09:30:00.000Z'),
    content: `<p>Edge functions execute code across global points of presence, delivering instantaneous response times.</p>`
  },
  {
    title: 'Autonomous AI Agents: Transforming Enterprise Decision Systems',
    slug: 'autonomous-ai-agents-transforming-enterprise-decision-systems',
    description: 'Moving beyond chat interfaces: how autonomous multi-agent swarms coordinate workflows, data pipelines, and ERP operations.',
    category: 'Industry Insights',
    tags: ['AI Agents', 'Automation', 'Enterprise', 'Strategy'],
    author: {
      name: 'Siddharth Rao',
      role: 'Technology Strategy Consultant',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'trends',
    readTime: '6 min read',
    publishedAt: new Date('2026-11-07T12:00:00.000Z'),
    content: `<p>Enterprises are shifting from single-turn chat prompts to orchestrated multi-agent workflows.</p>`
  },
  {
    title: 'Softrate Expands Cloud Consulting & DevOps Engineering Practices',
    slug: 'softrate-expands-cloud-consulting-devops-engineering-practices',
    description: 'Announcing our expanded technical advisory and cloud migration practice to help regional and global partners modernize legacy workloads.',
    category: 'Industry Insights',
    tags: ['Softrate News', 'Cloud Consulting', 'Company Update'],
    author: {
      name: 'Softrate Communications Desk',
      role: 'Corporate Communications',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'general-updates',
    readTime: '3 min read',
    publishedAt: new Date('2026-11-06T15:00:00.000Z'),
    content: `<p>Softrate Global is pleased to announce a strategic expansion of our cloud solutions and DevOps engineering units.</p>`
  },
  {
    title: 'Quarterly Technology Review: Key Shifts in Full-Stack Web Development',
    slug: 'quarterly-technology-review-key-shifts-in-full-stack-web-development',
    description: 'A summary of emerging tools, runtime benchmarks, and framework shifts analyzed by our internal engineering guilds.',
    category: 'Software Development',
    tags: ['Tech Roundup', 'FullStack', 'Guild Review'],
    author: {
      name: 'Arun Kumar',
      role: 'Senior Backend Architect',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'general-updates',
    readTime: '4 min read',
    publishedAt: new Date('2026-11-05T09:00:00.000Z'),
    content: `<p>Every quarter, Softrate engineering guilds evaluate runtime performance and library stability.</p>`
  },
  {
    title: 'Introducing Softrate Cloud Suite v2.0: Unified Deployment & Telemetry',
    slug: 'introducing-softrate-cloud-suite-v2-unified-deployment-telemetry',
    description: 'Explore the newly released features in our developer platform, featuring zero-configuration previews, live logging, and automated rollbacks.',
    category: 'Technology & Innovation',
    tags: ['Product Release', 'Cloud Suite', 'DevOps Tools'],
    author: {
      name: 'Product Engineering Team',
      role: 'Platform Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'product-updates',
    readTime: '4 min read',
    publishedAt: new Date('2026-11-04T10:00:00.000Z'),
    content: `<p>Softrate Cloud Suite v2.0 brings automatic canary deployments and granular telemetry heatmaps.</p>`
  },
  {
    title: 'Enhanced Developer APIs and SDKs Now Available for Seamless Integration',
    slug: 'enhanced-developer-apis-and-sdks-now-available-for-seamless-integration',
    description: 'Official TypeScript and Python SDKs launched to accelerate integration with Softrate enterprise services.',
    category: 'Software Development',
    tags: ['SDK', 'API', 'Developer Experience'],
    author: {
      name: 'Product Engineering Team',
      role: 'Platform Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    imageUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    section: 'product-updates',
    readTime: '3 min read',
    publishedAt: new Date('2026-11-02T14:00:00.000Z'),
    content: `<p>Developers can now take advantage of end-to-end type safety with the new Softrate SDK packages.</p>`
  }
];

