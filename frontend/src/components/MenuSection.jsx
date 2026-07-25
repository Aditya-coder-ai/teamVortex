import React, { useState } from 'react';

const MENU_ITEMS = [
  {
    id: 'signature-fresh-bowl',
    name: 'Signature Fresh Bowl',
    category: 'Main Dish',
    price: 17.50,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Organic jasmine grains topped with avocado, edamame, pickled lotus root, and house sesame-chili drizzle.',
    badge: 'House Special'
  },
  {
    id: 'stirred-egg',
    name: 'Stirred Egg',
    category: 'Main Dish',
    price: 14.50,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvAQOmRPQEH0ytTkqXsD9csV-92y9iRpbjAPovL6xsKN2lZaBmH-PyqSiDJkJsvUC84q6BOgUMXBTXHTte64n4RTr9N4ZzdldjEYlocJjTyYTioCx5gq_xZND2sGZ1y-FVLvEUndWZdRHzSSButBw94YYwC6DY6pzi4QpB648Tpg9gbQEhSRLlPlxAFuodcZpFPi01G_p4wz-C-ol5iIlyxjjakXM_Waj5SQoDvede5HMHbkT9p74LYNCANTlaLdKiyIoF9FQbBwQ',
    description: 'This might be the most common Chinese family dish. The dish is easy to cook, fry the stirred egg and sliced tomato with subtle scallion aroma.',
    badge: 'Chef Choice'
  },
  {
    id: 'kung-pao',
    name: 'Kung Pao Chicken',
    category: 'Main Dish',
    price: 18.00,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpSyPBeWiftBE15XQfI66uB4uVJz8PvPQu3I5bCmXn0ojBBh_cLihVdUzFUNNJjtTjwYLF-vQJ2IvD2xzocpNtAYVwOtLBr5YhaLBvADOWOkGENLcdmh5coOo-V-vEmQ1cov0CkYspKFT4frnJpxHudGhKjepgM78i-Xy9bTFu5ARa-wuwby22F0qjMycuZ4kRatdGIIEu-77rQu5TILjl8wQ-MRxwZrnEmLVCnwR2l3A9V8lvS9ySPflRZcm5KWEI_VNChG2WUA8',
    description: 'When temperatures plummet and you are craving something warm and cozy, you cannot go wrong with fluffy chicken breast, roasted peanuts and chili blend.',
    badge: 'Popular'
  },
  {
    id: 'sweet-pork',
    name: 'Sweet Pork Chops',
    category: 'Main Dish',
    price: 19.50,
    rating: 4.7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAypLEvp6Y8W3gYfvTc42KvQaS4MDDVTHweMWn7fTOaLDaU6LF1r7C1nc9jOi8P7S83q4WAMjoVfrY89B4jcvXxoBsKD2kdkiwOlWrApJ9B0km_R7LVIQ8mccMDyOILPiiDdnL_mXfAUjRfhGfMi2TnOQ__qzMOT50kThpGdpnVFX-8KjuolfEz9sxqp8dkKb6bSknh6Uipsyd2WYUkh2SbpyG4CiRSQVwDUFy01BO2hRZTJ3jxxbU88VcD4PPdWt30WCcx-Ia3fJ8',
    description: 'Sweet and sour dishes are popular among Chinese families. Tender pork chops glazed in organic honey, red vinegar and fresh ginger root.',
    badge: 'Classic'
  },
  {
    id: 'dumplings-pork',
    name: 'Pork & Chive Dumplings',
    category: 'Appertizers',
    price: 16.00,
    rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv4JpcGNhscjtCC-dBpI7Gc4C-rIg2cQ6hEFOlxR32FcSjdaFuqC8NvOQt5LAq_E4cPBlogJ2KGiIyf-4qxgGaxLRaJ5obhAcL8imBewr9_VOgDTs8p9zE2OQfzTjDr69ZtEkvABbO26WNQiC40b2xelJTPErvvzBfSy5zjF80xJ3bu5g3fAYwtWRpAJgU2mItjbkp7XY6sBZjYqym2TYvxbo7BlE4jMyBUOvBVuYelt3RYHZ7VwtWR4Hqo85Pn0k8Hy6ctTyo7fU',
    description: 'Freshly folded, steamed dumplings filled with seasoned heritage pork, garlic chives, and served with signature aged black vinegar sauce.',
    badge: 'Must Try'
  },
  {
    id: 'spring-rolls',
    name: 'Crispy Spring Rolls',
    category: 'Appertizers',
    price: 12.00,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-rolled phyllo crisp rolls packed with shiitake mushrooms, shredded cabbage, carrots, and glass noodles.',
    badge: 'Vegan'
  },
  {
    id: 'mango-rice',
    name: 'Mango Sticky Rice',
    category: 'Dessert',
    price: 10.50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80',
    description: 'Sweet jasmine rice soaked in warm coconut milk, served with ripe Alphonso mango slices and toasted sesame seeds.',
    badge: 'Sweet Treat'
  }
];

export default function MenuSection({ onSelectDish }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDishes = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="menu-section" data-purpose="menu-section">
      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-title">What's on our Plate</h2>
        <p className="section-subtitle">Please serve yourself without any hesitate</p>

        {/* Category Tabs */}
        <div className="category-tabs">
          {['All', 'Appertizers', 'Main Dish', 'Dessert'].map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="dishes-grid">
        {filteredDishes.map((dish) => (
          <article 
            key={dish.id} 
            className="dish-card"
            onClick={() => onSelectDish(dish)}
          >
            {dish.badge && (
              <span 
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {dish.badge}
              </span>
            )}

            <div className="dish-img-wrapper">
              <img 
                src={dish.image} 
                alt={dish.name} 
                className="dish-img"
              />
            </div>

            <h3 className="dish-title">{dish.name}</h3>
            <p className="dish-desc">{dish.description}</p>

            <div className="dish-footer">
              <span className="dish-price">${dish.price.toFixed(2)}</span>
              <button 
                className="btn-pill-outline" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDish(dish);
                }}
              >
                Order Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
