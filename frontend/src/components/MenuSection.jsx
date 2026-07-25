import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';

const ALLERGEN_LIST = [
  { id: 'Nuts', label: 'No Nuts', icon: '🥜' },
  { id: 'Dairy', label: 'No Dairy', icon: '🥛' },
  { id: 'Gluten', label: 'No Gluten', icon: '🌾' },
  { id: 'Soy', label: 'No Soy', icon: '🫘' },
  { id: 'Shellfish', label: 'No Shellfish', icon: '🦐' },
];

export default function MenuSection({
  menuItems,
  onSelectDish,
  onAddToCart,
  lang = 'EN',
  onOpenAiAssistant
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [excludedAllergens, setExcludedAllergens] = useState([]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const toggleAllergenFilter = (allergenId) => {
    if (excludedAllergens.includes(allergenId)) {
      setExcludedAllergens(excludedAllergens.filter(a => a !== allergenId));
    } else {
      setExcludedAllergens([...excludedAllergens, allergenId]);
    }
  };

  // Filter items by category & allergen exclusion
  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    // Check if dish contains any excluded allergen
    if (excludedAllergens.some(allergen => item.allergens?.includes(allergen))) {
      return false;
    }
    return true;
  });

  return (
    <section id="menu" className="menu-section" data-purpose="menu-section" style={{ padding: '6rem 2rem 4rem 2rem' }}>
      <div className="section-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            color: 'var(--primary)',
            fontFamily: 'var(--font-sans)',
            fontWeight: '700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '0.8rem'
          }}>
            {t.menuHeaderTitle}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            marginTop: '0.4rem',
            marginBottom: '0.5rem',
            color: 'var(--on-surface)'
          }}>
            Seasonal Epicurean Menu
          </h2>
          <p style={{ color: 'var(--secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t.menuHeaderSubtitle}
          </p>

          {/* AI Sommelier Banner Callout */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255,91,0,0.1), rgba(228,190,177,0.3))',
            border: '1px solid rgba(255,91,0,0.2)',
            cursor: 'pointer'
          }} onClick={onOpenAiAssistant}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>
              Unsure what to choose? Try our <strong>AI Taste Assistant Quiz</strong> →
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          justify: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          {[
            { id: 'All', label: t.filterAll },
            { id: 'Main Dish', label: t.filterMain },
            { id: 'Appetizer', label: t.filterAppetizers },
            { id: 'Dessert', label: t.filterDesserts },
            { id: 'Beverage', label: t.filterBeverages },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: activeCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                background: activeCategory === cat.id ? 'var(--primary)' : 'var(--surface-container-lowest)',
                color: activeCategory === cat.id ? '#ffffff' : 'var(--on-surface)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(255,91,0,0.25)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Allergen Warnings & Exclusion Filter */}
        <div style={{
          background: 'var(--surface-container-low)',
          borderRadius: '1.25rem',
          padding: '1rem 1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          justify: 'center'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>
            ⚠️ {t.allergyFilterTitle}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {ALLERGEN_LIST.map(allergen => {
              const isExcluded = excludedAllergens.includes(allergen.id);
              return (
                <button
                  key={allergen.id}
                  type="button"
                  onClick={() => toggleAllergenFilter(allergen.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: isExcluded ? '1px solid var(--error, #ba1a1a)' : '1px solid var(--outline-variant)',
                    background: isExcluded ? '#ffebee' : '#ffffff',
                    color: isExcluded ? '#c62828' : 'var(--on-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {allergen.icon} {allergen.label} {isExcluded ? '✓ (Excluded)' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {filteredItems.map(dish => {
            const isSoldOut = dish.stock === 0;
            const isLowStock = dish.stock > 0 && dish.stock <= 5;

            return (
              <div
                key={dish.id}
                className="dish-card"
                style={{
                  background: 'var(--surface-container-lowest)',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  border: '1px solid var(--outline-variant)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  opacity: isSoldOut ? 0.75 : 1
                }}
              >
                {/* Dish Image Container */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isSoldOut ? 'grayscale(60%)' : 'none'
                    }}
                  />
                  
                  {/* Badge */}
                  {dish.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(26,28,27,0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#ffffff',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {dish.badge}
                    </span>
                  )}

                  {/* Live Stock Indicator Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: isSoldOut ? '#ba1a1a' : isLowStock ? '#ff9800' : '#2e7d32',
                    color: '#ffffff',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {isSoldOut ? t.stockSoldOut : isLowStock ? `Only ${dish.stock} Left!` : t.stockInStock}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: 'var(--on-surface)',
                      margin: 0
                    }}>
                      {dish.name}
                    </h3>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-sans)'
                    }}>
                      ${dish.price.toFixed(2)}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--secondary)',
                    lineHeight: '1.4',
                    marginBottom: '1rem',
                    flex: 1
                  }}>
                    {dish.description}
                  </p>

                  {/* Allergen Tags */}
                  {dish.allergens && dish.allergens.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', alignSelf: 'center' }}>Contains:</span>
                      {dish.allergens.map(alg => (
                        <span key={alg} style={{
                          background: 'var(--surface-container-low)',
                          color: 'var(--on-surface-variant)',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          border: '1px solid var(--outline-variant)'
                        }}>
                          {alg}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => onSelectDish(dish)}
                      style={{
                        flex: 1,
                        padding: '0.6rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--outline-variant)',
                        background: 'transparent',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => onAddToCart(dish)}
                      className="btn-pill-primary"
                      style={{
                        flex: 1,
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.8rem',
                        opacity: isSoldOut ? 0.5 : 1,
                        cursor: isSoldOut ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSoldOut ? t.stockSoldOut : t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
