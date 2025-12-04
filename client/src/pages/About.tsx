import { Link } from 'react-router-dom';

function About() {
  const features = [
    {
      title: 'Recently Viewed',
      description: 'Session-persistent browsing history that helps users continue exploring seamlessly.'
    },
    {
      title: 'AI Recommendations',
      description: 'Semantic product matching powered by pgvector and Gemini embeddings.'
    },
    {
      title: 'Secure Authentication',
      description: 'Robust security with JWT tokens and encrypted user information.'
    },
    {
      title: 'Responsive Design',
      description: 'A beautifully responsive interface for mobile, tablet, and desktop.'
    }
  ];

  const techStack = {
    frontend: ['React 19', 'Redux Toolkit Query', 'Tailwind CSS', 'Shadcn UI'],
    backend: ['Node.js', 'Express.js', 'JWT Authentication', 'REST API'],
    database: ['PostgreSQL', 'pgvector', 'Indexed Queries'],
    ai: ['Gemini-004', 'Vector Embeddings', 'Semantic Search']
  };

  return (
    <div className="min-h-screen bg-background">

      {/* HERO SECTION */}
      <div className="border-b border-border bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Modern E-Commerce,
              <br />
              <span className="text-muted-foreground">Built from Scratch</span>
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground/80 font-light leading-relaxed">
              A complete full-stack e-commerce experience crafted with modern technology,
              optimized design, and AI-powered intelligence.
            </p>
          </div>
        </div>
      </div>


      {/* PROJECT STORY */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-light mb-8 tracking-tight">The Project</h2>
        <div className="space-y-6 text-muted-foreground/80 leading-relaxed">
          <p className="text-lg font-light">
            This platform began as an academic project with an ambitious goal — to build
            a polished, production-ready application comparable to modern commercial systems.
          </p>
          <p className="font-light">
            Every part of the system, from backend architecture to responsive UI, was
            intentionally crafted to demonstrate real-world full-stack development skills.
          </p>
          <p className="font-light">
            What makes this project stand out is the integration of AI-powered recommendation
            systems using vector embeddings — a feature typically exclusive to
            enterprise-grade applications.
          </p>
        </div>
      </div>


      {/* FEATURES GRID */}
      <div className="bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-light mb-12 tracking-tight">Core Features</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-background border border-border p-7 rounded-md hover:shadow-lg transition-all hover:border-foreground/20"
              >
                <h3 className="text-lg font-normal mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* TECH STACK */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-light mb-12 tracking-tight">Technology Stack</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {Object.entries(techStack).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground/70 mb-4 font-medium">
                {category}
              </h3>

              <div className="space-y-3">
                {items.map((t, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-foreground/60 rounded-full mr-3"></div>
                    <span className="text-foreground/80 font-light text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* TECH HIGHLIGHTS */}
      <div className="bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-light mb-12 tracking-tight">
            Technical Highlights
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Frontend Architecture',
                desc: 'React 18 component architecture with RTK Query for server state, caching, and auto refetching.'
              },
              {
                title: 'Backend Design',
                desc: 'REST APIs with validation, middleware-based error handling, and optimized SQL queries.'
              },
              {
                title: 'AI Integration',
                desc: 'Gemini embeddings + pgvector powering semantic recommendations far beyond keyword search.'
              }
            ].map((h, i) => (
              <div key={i} className="space-y-4">
                <div className="w-14 h-0.5 bg-foreground/50"></div>
                <h3 className="text-xl font-light tracking-tight">{h.title}</h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ABOUT DEVELOPER */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="border border-border rounded-md p-10 bg-muted/20">
          <h2 className="text-2xl font-light mb-6 tracking-tight">
            About the Developer
          </h2>

          <p className="text-muted-foreground/80 mb-4 leading-relaxed font-light">
            Built by <span className="text-foreground font-normal">Himanshu Singh</span>, 
            a 3rd year B.Tech ECE student passionate about modern web development and AI integration.
          </p>

          <p className="text-muted-foreground/80 leading-relaxed font-light">
            This project represents months of deep learning, design exploration, and hands-on
            problem solving — combining frontend, backend, database engineering,
            and applied AI/ML techniques.
          </p>
        </div>
      </div>


      {/* CTA */}
      <div className="border-t border-border bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h3 className="text-2xl font-light mb-3 tracking-tight">Experience the Platform</h3>
          <p className="text-background/80 mb-8 font-light">
            Explore the features and see the technology in action.
          </p>
          <Link
            to="/products"
            className="inline-block px-10 py-4 bg-background text-foreground text-sm uppercase tracking-wider hover:bg-background/90 transition-colors font-light rounded-md"
          >
            Browse Products
          </Link>
        </div>
      </div>

    </div>
  );
}

export default About;
