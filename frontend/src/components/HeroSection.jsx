import React from 'react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section id="hero" className="hero-section" data-purpose="hero-section">
      <div className="hero-grid">
        {/* Left Column Content */}
        <div style={{ zIndex: 2 }}>
          <h1 className="hero-title">
            <span>Take a</span> <br />
            <span className="highlight">taste</span>
          </h1>

          <div style={{ marginTop: '1.5rem' }}>
            <h2 className="hero-subtitle">
              Life is so endlessly delicious.
            </h2>
            <p className="hero-desc">
              Dumpling is a broad classification for a dish that consists of pieces of dough made from a variety of starch sources wrapped around a filling, or of dough with no filling. Come join us on this flavorful journey.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-pill-primary" 
                onClick={onExploreClick}
              >
                Explore Menu →
              </button>
            </div>

            {/* Chef's Note Box */}
            <div className="chef-note">
              <span className="chef-note-tag">Chef's Note</span>
              <p className="chef-note-quote">
                "Every fold tells a story of tradition. We invite you to experience the authentic, handcrafted flavors that bring our heritage to life, one bite at a time."
              </p>
            </div>
          </div>
        </div>

        {/* Right Column Image Frame */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div className="hero-image-frame floating-element">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv4JpcGNhscjtCC-dBpI7Gc4C-rIg2cQ6hEFOlxR32FcSjdaFuqC8NvOQt5LAq_E4cPBlogJ2KGiIyf-4qxgGaxLRaJ5obhAcL8imBewr9_VOgDTs8p9zE2OQfzTjDr69ZtEkvABbO26WNQiC40b2xelJTPErvvzBfSy5zjF80xJ3bu5g3fAYwtWRpAJgU2mItjbkp7XY6sBZjYqym2TYvxbo7BlE4jMyBUOvBVuYelt3RYHZ7VwtWR4Hqo85Pn0k8Hy6ctTyo7fU" 
              alt="Plate of steamed artisanal dumplings" 
              className="hero-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
