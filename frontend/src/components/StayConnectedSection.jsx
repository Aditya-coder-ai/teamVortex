import React, { useState } from 'react';

const RECIPES = [
  {
    id: 'rec-1',
    title: 'Signature Hand-Folded Pork Dumplings',
    time: '45 mins',
    difficulty: 'Medium',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv4JpcGNhscjtCC-dBpI7Gc4C-rIg2cQ6hEFOlxR32FcSjdaFuqC8NvOQt5LAq_E4cPBlogJ2KGiIyf-4qxgGaxLRaJ5obhAcL8imBewr9_VOgDTs8p9zE2OQfzTjDr69ZtEkvABbO26WNQiC40b2xelJTPErvvzBfSy5zjF80xJ3bu5g3fAYwtWRpAJgU2mItjbkp7XY6sBZjYqym2TYvxbo7BlE4jMyBUOvBVuYelt3RYHZ7VwtWR4Hqo85Pn0k8Hy6ctTyo7fU',
    summary: 'Master the art of traditional pleating and authentic ginger-chive pork filling straight from our kitchen.'
  },
  {
    id: 'rec-2',
    title: 'Szechuan Chili Oil & Peanut Sauce',
    time: '20 mins',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    summary: 'Infuse high-aroma chili flakes, star anise, Szechuan peppercorns, and toasted sesame for the ultimate dip.'
  }
];

export default function StayConnectedSection({ onToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '2',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setSubmitted(true);
    if (onToast) onToast('Reservation & Newsletter subscription confirmed! We look forward to welcoming you.');
  };

  return (
    <section id="contact" style={{ padding: '6rem 2rem', background: 'var(--surface-container-low)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Chef Recipes Showcase */}
        <div id="recipes" style={{ marginBottom: '6rem' }}>
          <div className="section-header">
            <h2 className="section-title">Artisanal Recipes & Secrets</h2>
            <p className="section-subtitle">Bring the authentic flavors of Fresh Bowl to your own dining table</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '3rem' }}>
            {RECIPES.map((recipe) => (
              <div 
                key={recipe.id}
                style={{
                  background: 'var(--surface-container-lowest)',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                    <span>⏱ {recipe.time}</span>
                    <span>•</span>
                    <span>⚡ {recipe.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{recipe.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {recipe.summary}
                  </p>
                  <button 
                    className="btn-pill-outline"
                    onClick={() => onToast && onToast(`Opening recipe: ${recipe.title}`)}
                  >
                    View Full Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter & Table Reservation */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: '2.5rem',
          padding: '3.5rem 2.5rem',
          boxShadow: '0 20px 40px rgba(168, 57, 0, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
              Reserve a Table & Join Us
            </span>
            <h2 style={{ fontSize: '2.75rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Stay Connected
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.7', marginBottom: '2rem' }}>
              Sign up for our exclusive private dining events, seasonal menu releases, and chef tasting invitations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,91,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>📍</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Location</strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>452 Epicurean Way, Culinary District</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,91,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>⏰</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Hours</strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Tue - Sun: 11:30 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div style={{ padding: '2rem', background: 'rgba(255, 91, 0, 0.08)', border: '1px solid var(--primary)', borderRadius: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Thank You!</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--on-surface-variant)' }}>
                  Your request has been received. Our concierge team will reach out to confirm your booking at <strong>{formData.email}</strong>.
                </p>
                <button 
                  className="btn-pill-outline"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '1.5rem' }}
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--background)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--background)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Guests</label>
                    <select 
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--outline-variant)',
                        background: 'var(--background)',
                        outline: 'none'
                      }}
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6+ Guests (Party)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Date</label>
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--outline-variant)',
                        background: 'var(--background)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-pill-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                  Submit Reservation & Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
