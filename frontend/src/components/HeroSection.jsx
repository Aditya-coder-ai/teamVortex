import React from 'react';

export default function HeroSection({ onExploreClick, onReserveClick }) {
  return (
    <section id="hero" className="editorial-hero-section" data-purpose="hero-section">
      <div className="hero-content-wrapper">
        {/* Right Column / Circular Hero Image Container */}
        <div className="hero-circular-image-container" data-purpose="hero-image-container">
          <div className="hero-circular-frame">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv4JpcGNhscjtCC-dBpI7Gc4C-rIg2cQ6hEFOlxR32FcSjdaFuqC8NvOQt5LAq_E4cPBlogJ2KGiIyf-4qxgGaxLRaJ5obhAcL8imBewr9_VOgDTs8p9zE2OQfzTjDr69ZtEkvABbO26WNQiC40b2xelJTPErvvzBfSy5zjF80xJ3bu5g3fAYwtWRpAJgU2mItjbkp7XY6sBZjYqym2TYvxbo7BlE4jMyBUOvBVuYelt3RYHZ7VwtWR4Hqo85Pn0k8Hy6ctTyo7fU" 
              alt="A plate of freshly steamed dumplings with dipping sauce" 
              className="hero-circular-img"
            />
          </div>
        </div>

        {/* Left Column Text Content */}
        <div className="hero-text-content">
          <h1 className="hero-editorial-title" id="hero-heading">
            <span className="block">Take a</span>
            <span className="block italic-highlight">taste</span>
          </h1>

          <div className="hero-details-row">
            {/* Intro Text Box */}
            <div className="hero-intro-box">
              <h2 className="hero-tagline-heading">Life is so endlessly delicious.</h2>
              <p className="hero-body-description">
                Dumpling is a broad classification for a dish that consists of pieces of dough made from a variety of starch sources wrapped around a filling, or of dough with no filling. Come join us on this flavorful journey.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="btn-pill-primary-lg" 
                  onClick={onExploreClick}
                >
                  Explore Now →
                </button>
                {onReserveClick && (
                  <button 
                    type="button"
                    className="btn-pill-outline-lg" 
                    onClick={onReserveClick}
                  >
                    Reserve Table
                  </button>
                )}
              </div>
            </div>

            {/* Chef's Note Block */}
            <div className="chef-note-sidebar">
              <span className="chef-note-label">Chef's Note</span>
              <p className="chef-note-text">
                "Every fold tells a story of tradition. We invite you to experience the authentic, handcrafted flavors that bring our heritage to life, one bite at a time."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
