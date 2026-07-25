import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: 'var(--on-surface)',
      color: 'var(--background)',
      padding: '4.5rem 2rem 2.5rem 2rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '3rem',
        marginBottom: '3.5rem'
      }}>
        {/* Brand info */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'var(--background)',
            marginBottom: '1rem'
          }}>
            fresh bowl <span style={{ color: 'var(--primary)' }}>.</span>
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#a0a0a0', lineHeight: '1.7', maxWidth: '280px' }}>
            A tactile, minimalist kitchen celebrating fresh artisan bowls, handmade dumplings, and vibrant epicurean dining.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#c0c0c0' }}>
            <li><button onClick={() => onNavigate('hero')} style={{ color: 'inherit' }}>Welcome</button></li>
            <li><button onClick={() => onNavigate('menu')} style={{ color: 'inherit' }}>Our Menu</button></li>
            <li><button onClick={() => onNavigate('recipes')} style={{ color: 'inherit' }}>Chef Recipes</button></li>
            <li><button onClick={() => onNavigate('contact')} style={{ color: 'inherit' }}>Reservations</button></li>
          </ul>
        </div>

        {/* Hours & Contact */}
        <div>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            Dining Hours
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#c0c0c0', lineHeight: '1.8' }}>
            Tuesday – Thursday: 11:30 AM – 9:30 PM<br />
            Friday – Sunday: 11:30 AM – 10:30 PM<br />
            Monday: Closed for Kitchen Prep
          </p>
        </div>

        {/* Social */}
        <div>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            Follow Our Kitchen
          </h4>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem' }}>
            <span style={{ cursor: 'pointer' }}>📸 Instagram</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#808080', marginTop: '1rem' }}>
            Tag @luscious.epicurean to share your dining moments.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: '0.825rem',
        color: '#808080'
      }}>
        <span>© {new Date().getFullYear()} Fresh Bowl. All rights reserved.</span>
        <span>Crafted from Stitch Project #6352525490282656851</span>
      </div>
    </footer>
  );
}
