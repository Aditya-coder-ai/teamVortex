import React, { useState } from 'react';

export default function DishModal({ dish, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Mild');

  if (!dish) return null;

  const handleAddToCart = () => {
    onAddToCart({
      ...dish,
      quantity,
      spiceLevel
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
          }}>
            <img 
              src={dish.image} 
              alt={dish.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {dish.badge && (
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 91, 0, 0.1)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.25rem 0.85rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              {dish.badge}
            </span>
          )}

          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dish.name}</h3>
          <p style={{ color: 'var(--secondary)', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {dish.description}
          </p>

          {/* Customization Options */}
          <div style={{ background: 'var(--surface-container-low)', padding: '1.25rem', borderRadius: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Spice Preference
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Mild', 'Medium 🌶️', 'Authentic Hot 🌶️🌶️'].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpiceLevel(lvl)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: spiceLevel === lvl ? 'var(--primary)' : 'var(--outline-variant)',
                    background: spiceLevel === lvl ? 'var(--primary)' : 'var(--surface-container-lowest)',
                    color: spiceLevel === lvl ? '#fff' : 'var(--on-surface)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface-container-low)', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ fontSize: '1.25rem', fontWeight: '700', padding: '0 0.5rem' }}
              >
                -
              </button>
              <span style={{ fontWeight: '700', fontSize: '1rem', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ fontSize: '1.25rem', fontWeight: '700', padding: '0 0.5rem' }}
              >
                +
              </button>
            </div>

            <button 
              className="btn-pill-primary"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
            >
              Add to Order • ${(dish.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
