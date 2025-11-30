import React from 'react';

function About() {
  const features = [
    {
      title: 'Recently Viewed',
      description: 'Track and display user browsing history across sessions'
    },
    {
      title: 'AI Recommendations',
      description: 'Smart product suggestions using pgvector and embeddings'
    },
    {
      title: 'Secure Authentication',
      description: 'Protected user accounts with JWT-based authentication'
    },
    {
      title: 'Responsive Design',
      description: 'Seamless experience across all devices and screen sizes'
    }
  ];

  const technologies = [
    'React & Redux Toolkit Query',
    'Node.js & Express',
    'PostgreSQL with pgvector',
    'Gemini-004 for Embeddings',
    'RESTful API Architecture',
    'JWT Authentication'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              About This Project
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              A full-stack e-commerce platform developed as part of academic curriculum, 
              showcasing modern web development practices and technologies.
            </p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Project Overview</h2>
            <p className="text-gray-600 mb-4 leading-relaxed font-light">
              This e-commerce platform is a comprehensive college project that demonstrates 
              the implementation of modern web technologies and best practices in full-stack 
              development.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed font-light">
              The application features a complete shopping experience including product browsing, 
              cart management, user authentication, and order processing. Built with scalability 
              and user experience in mind.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              Key features include recently viewed products tracking, advanced filtering, 
              responsive design, and a clean, minimalist interface inspired by modern 
              e-commerce standards.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Technologies Used</h2>
            <div className="space-y-3">
              {technologies.map((tech, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-1 h-1 bg-gray-900 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-light">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-light text-gray-900 mb-12 tracking-tight">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-normal text-gray-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-gray-900 mb-12 tracking-tight">Implementation Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border-l-2 border-gray-900 pl-6">
            <h3 className="text-lg font-normal text-gray-900 mb-3 tracking-tight">Frontend</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Built with React and Redux Toolkit for state management. 
              Implements RTK Query for efficient data fetching and caching.
            </p>
          </div>
          <div className="border-l-2 border-gray-900 pl-6">
            <h3 className="text-lg font-normal text-gray-900 mb-3 tracking-tight">Backend</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              RESTful API built with Node.js and Express. Database design includes 
              optimized queries and proper indexing.
            </p>
          </div>
          <div className="border-l-2 border-gray-900 pl-6">
            <h3 className="text-lg font-normal text-gray-900 mb-3 tracking-tight">AI Recommendations</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Vector-based recommendation system using pgvector extension. 
              Product embeddings generated using Gemini-004 model for semantic similarity.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Context */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">About Developer</h2>
            <p className="text-gray-600 mb-4 leading-relaxed font-light">
              Developed by Himanshu Singh, B.Tech 3rd Year Electronics and Communication Engineering student.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              This project demonstrates practical application of full-stack development skills, 
              modern database techniques including vector embeddings, and AI-powered features 
              for an enhanced e-commerce experience.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h3 className="text-xl font-light text-gray-900 mb-4 tracking-tight">
            Explore the Platform
          </h3>
          <button className="px-8 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors font-light">
            VIEW PRODUCTS
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;