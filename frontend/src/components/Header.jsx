import React, { useState } from 'react';

export default function Header({ activeSection, onNavigate, onOpenLogin, user, onLogout, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header" data-purpose="site-header">
      {/* Brand Logo */}
      <div 
        className="brand-logo" 
        onClick={() => handleNavClick('hero')}
      >
        fresh bowl <span>.</span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="nav-links" aria-label="Main Navigation">
        <button 
          className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
          onClick={() => handleNavClick('hero')}
        >
          Welcome
        </button>
        <button 
          className={`nav-link ${activeSection === 'menu' ? 'active' : ''}`}
          onClick={() => handleNavClick('menu')}
        >
          Our Menu
        </button>
        <button 
          className={`nav-link ${activeSection === 'recipes' ? 'active' : ''}`}
          onClick={() => handleNavClick('recipes')}
        >
          Recipes
        </button>
        <button 
          className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => handleNavClick('contact')}
        >
          Stay Connected
        </button>
      </nav>

      {/* Actions / User State */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: 'rgba(255, 91, 0, 0.1)',
              color: 'var(--primary-dark)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '600',
              border: '1px solid var(--outline-variant)'
            }}>
              👤 {user.fullName || user.name || user.email?.split('@')[0]} ({user.role || 'customer'})
            </span>
            <button 
              className="btn-pill-outline"
              onClick={onLogout}
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            className="btn-pill-outline"
            onClick={onOpenLogin}
            aria-label="Login"
          >
            Login / Register
          </button>
        )}

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            fontSize: '1.5rem',
            padding: '0.5rem',
            color: 'var(--on-surface)'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface-container-lowest)',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            borderBottom: '2px solid var(--primary)'
          }}
        >
          <button 
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => handleNavClick('hero')}
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
          >
            Welcome
          </button>
          <button 
            className={`nav-link ${activeSection === 'menu' ? 'active' : ''}`}
            onClick={() => handleNavClick('menu')}
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
          >
            Our Menu
          </button>
          <button 
            className={`nav-link ${activeSection === 'recipes' ? 'active' : ''}`}
            onClick={() => handleNavClick('recipes')}
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
          >
            Recipes
          </button>
          <button 
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavClick('contact')}
            style={{ textAlign: 'left', fontSize: '1.1rem' }}
          >
            Stay Connected
          </button>
        </div>
      )}
    </header>
  );
}
