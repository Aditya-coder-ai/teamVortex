import React, { useState } from 'react';

export default function DishModal({ dish, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Mild');

  if (!dish) return null;

  const isSoldOut = dish.stock === 0;

  const handleAdd = () => {
    if (isSoldOut) return;
    onAddToCart({
      ...dish,
      quantity,
      selectedSpice: spiceLevel
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: 0, overflow: 'hidden' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal" style={{ zIndex: 10 }}>
          ✕
        </button>

        {/* Modal Hero Image */}
        <div style={{ position: 'relative', height: '240px' }}>
          <img
            src={dish.image}
            alt={dish.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
          }} />
          
          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', color: '#fff' }}>
            <span style={{
              background: 'var(--primary)',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              {dish.category}
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginTop: '0.2rem', color: '#fff' }}>
              {dish.name}
            </h3>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Price & Rating Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
              ${dish.price.toFixed(2)}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ffb300' }}>★ {dish.rating}</span>
              <span style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>({dish.reviewsCount || 42} reviews)</span>
            </div>
          </div>

          <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.5', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            {dish.description}
          </p>

          {/* Live Availability & Allergen Box */}
          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: '1rem',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--secondary)' }}>Live Availability: </span>
              <strong style={{ color: isSoldOut ? '#c62828' : 'var(--primary)' }}>
                {isSoldOut ? 'Sold Out' : `In Stock (${dish.stock} remaining)`}
              </strong>
            </div>

            {dish.allergens && dish.allergens.length > 0 && (
              <div>
                <span style={{ color: 'var(--secondary)' }}>Allergens: </span>
                <span style={{ fontWeight: '600', color: '#c62828' }}>
                  {dish.allergens.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Spice Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Select Spice Preference
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Mild', 'Medium', 'Extra Spicy'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(level)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '9999px',
                    border: spiceLevel === level ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                    background: spiceLevel === level ? 'rgba(255, 91, 0, 0.08)' : 'var(--background)',
                    color: spiceLevel === level ? 'var(--primary)' : 'var(--on-surface)',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter & Add to Order */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--outline-variant)',
              borderRadius: '9999px',
              padding: '0.25rem 0.5rem'
            }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'none', border: 'none', padding: '0.4rem 0.75rem', cursor: 'pointer', fontWeight: '700' }}
              >
                -
              </button>
              <span style={{ fontWeight: '700', padding: '0 0.5rem' }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(dish.stock || 10, quantity + 1))}
                style={{ background: 'none', border: 'none', padding: '0.4rem 0.75rem', cursor: 'pointer', fontWeight: '700' }}
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={isSoldOut}
              onClick={handleAdd}
              className="btn-pill-primary"
              style={{ flex: 1, padding: '0.85rem', opacity: isSoldOut ? 0.5 : 1 }}
            >
              {isSoldOut ? 'Sold Out' : `Add ${quantity} to Order • $${(dish.price * quantity).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
