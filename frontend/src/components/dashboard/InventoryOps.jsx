import React, { useState } from 'react';

function InventoryOps() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Organic Hass Avocado', category: 'Fresh Produce', stock: '12 kg', status: 'LOW', percent: 18, unit: 'kg', supplier: 'Green Valley Organic Farms' },
    { id: 2, name: 'Organic Quinoa & Wild Rice', category: 'Grains & Bases', stock: '45 kg', status: 'GOOD', percent: 82, unit: 'kg', supplier: 'Whole Grain Co.' },
    { id: 3, name: 'Wild Alaskan Salmon Fillet', category: 'Proteins', stock: '8 kg', status: 'CRITICAL', percent: 10, unit: 'kg', supplier: 'Pacific Seafood Express' },
    { id: 4, name: 'Organic Baked Tofu Cubes', category: 'Proteins', stock: '22 kg', status: 'GOOD', percent: 65, unit: 'kg', supplier: 'Artisan Soy Foods' },
    { id: 5, name: 'House Creamy Tahini Dressing', category: 'Sauces & Dressings', stock: '15 Liters', status: 'GOOD', percent: 70, unit: 'Liters', supplier: 'Fresh Bowl In-House Prep' },
    { id: 6, name: 'Toasted Pumpkin & Sesame Seeds', category: 'Toppings & Crunch', stock: '3 kg', status: 'LOW', percent: 22, unit: 'kg', supplier: 'Spice & Seed Direct' }
  ]);

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const handleRestock = (id, amount) => {
    setIngredients(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'GOOD',
          percent: 95,
          stock: '50 ' + item.unit
        };
      }
      return item;
    }));
  };

  const filteredItems = ingredients.filter(item => {
    const matchesCat = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="inventory-dashboard-container">
      <div className="inventory-header font-sans">
        <div>
          <h1 className="dashboard-page-title font-serif">Inventory & Supply Operations</h1>
          <p className="dashboard-page-sub font-sans">Real-time stock tracking for organic ingredients, bases & dressings</p>
        </div>

        <div className="inventory-quick-actions font-sans">
          <button 
            className="action-btn-primary font-sans"
            onClick={() => alert('Automated Supplier POs generated for low stock items!')}
          >
            📦 One-Click Auto Restock All Low Items
          </button>
        </div>
      </div>

      {/* Low Stock Urgent Alert Banner */}
      <div className="urgent-stock-alert">
        <div className="alert-content">
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Low Inventory Warning:</strong> Wild Alaskan Salmon & Hass Avocado are below safety threshold!
          </div>
        </div>
        <button 
          className="alert-reorder-btn"
          onClick={() => alert('Supplier orders submitted to Pacific Seafood & Green Valley Farms.')}
        >
          Express Order Now
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="inventory-controls-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search ingredients, dressings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter-pills font-sans">
          {['ALL', 'Fresh Produce', 'Grains & Bases', 'Proteins', 'Sauces & Dressings', 'Toppings & Crunch'].map(cat => (
            <button 
              key={cat}
              className={`cat-pill ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Ingredient Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Stock Level</th>
              <th>Primary Supplier</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <strong className="ingredient-title">{item.name}</strong>
                </td>
                <td>
                  <span className="category-tag">{item.category}</span>
                </td>
                <td>
                  <span className="stock-quantity">{item.stock}</span>
                </td>
                <td>
                  <div className="stock-level-cell">
                    <div className="stock-progress-track">
                      <div 
                        className={`stock-progress-bar ${item.status.toLowerCase()}`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                    <span className={`stock-status-badge ${item.status.toLowerCase()}`}>
                      {item.status} ({item.percent}%)
                    </span>
                  </div>
                </td>
                <td>
                  <span className="supplier-name">{item.supplier}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="restock-btn"
                    onClick={() => handleRestock(item.id)}
                  >
                    ➕ Restock Batch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryOps;
