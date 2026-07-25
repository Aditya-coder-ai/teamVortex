import React, { useState } from 'react';

export default function AiTasteAssistantModal({ isOpen, onClose, menuItems, onSelectDish }) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState('Comforting');
  const [diet, setDiet] = useState('Vegan');
  const [spice, setSpice] = useState('Mild');
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleGenerateRecommendations = () => {
    // Smart recommendation scoring based on user selected tags
    const scored = menuItems.map(dish => {
      let score = 70; // baseline
      if (dish.aiTags?.includes(mood)) score += 15;
      if (dish.aiTags?.includes(diet)) score += 10;
      if (dish.aiTags?.includes(spice)) score += 5;
      return { ...dish, matchScore: Math.min(99, score) };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    setResults(scored.slice(0, 3));
    setStep(4); // Results step
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,91,0,0.2), rgba(228,190,177,0.4))',
            color: 'var(--primary)',
            fontSize: '1.75rem',
            marginBottom: '0.75rem'
          }}>
            🤖
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.3rem' }}>
            Fresh Bowl AI Sommelier
          </h3>
          <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Answer 3 quick questions to discover your personalized dish match
          </p>
        </div>

        {/* Step 1: Mood & Flavor Vibe */}
        {step === 1 && (
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
              Step 1/3: What vibe are you craving today?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Comforting & Warm', value: 'Comforting', icon: '🍲' },
                { label: 'Light & Refreshing', value: 'Light & Refreshing', icon: '🥗' },
                { label: 'Bold & Spicy', value: 'Bold & Spicy', icon: '🌶️' },
                { label: 'High Protein Fuel', value: 'High Protein', icon: '🥑' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMood(opt.value)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: mood === opt.value ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    background: mood === opt.value ? 'rgba(255, 91, 0, 0.08)' : 'var(--background)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: mood === opt.value ? '700' : '500',
                    color: mood === opt.value ? 'var(--primary)' : 'var(--on-surface)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{opt.icon}</div>
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-pill-primary"
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Next: Dietary Preference →
            </button>
          </div>
        )}

        {/* Step 2: Dietary Goal */}
        {step === 2 && (
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
              Step 2/3: Any specific dietary preference?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['Vegan', 'Balanced Bowl', 'High Protein', 'Keto'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiet(d)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: diet === d ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    background: diet === d ? 'rgba(255, 91, 0, 0.08)' : 'var(--background)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: diet === d ? '700' : '500',
                    color: diet === d ? 'var(--primary)' : 'var(--on-surface)'
                  }}
                >
                  🌿 {d}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'transparent'
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn-pill-primary"
                onClick={() => setStep(3)}
                style={{ flex: 2 }}
              >
                Next: Spice Level →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Spice Level */}
        {step === 3 && (
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
              Step 3/3: Preferred spice intensity?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['Mild', 'Medium', 'Extra Spicy'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpice(s)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: spice === s ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    background: spice === s ? 'rgba(255, 91, 0, 0.08)' : 'var(--background)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: spice === s ? '700' : '500',
                    color: spice === s ? 'var(--primary)' : 'var(--on-surface)'
                  }}
                >
                  🔥 {s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'transparent'
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn-pill-primary"
                onClick={handleGenerateRecommendations}
                style={{ flex: 2 }}
              >
                ✨ Match My Taste!
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Recommendations Display */}
        {step === 4 && results && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                Recommended for You
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {results.map((dish, idx) => (
                <div
                  key={dish.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    borderRadius: '1.25rem',
                    background: idx === 0 ? 'rgba(255, 91, 0, 0.06)' : 'var(--surface-container-low)',
                    border: idx === 0 ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{ width: '70px', height: '70px', borderRadius: '1rem', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <h5 style={{ fontWeight: '700', fontSize: '1rem' }}>{dish.name}</h5>
                      <span style={{
                        color: 'var(--primary)',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        background: '#fff',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(255,91,0,0.2)'
                      }}>
                        {dish.matchScore}% Match
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '0.4rem' }}>
                      {dish.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: 'var(--on-surface)' }}>${dish.price.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => { onSelectDish(dish); onClose(); }}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Order This Dish →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '9999px',
                border: '1px solid var(--outline-variant)',
                background: 'transparent',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Retake AI Preference Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
