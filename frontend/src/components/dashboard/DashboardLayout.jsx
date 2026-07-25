import React, { useState } from 'react';
import ExecutiveDashboard from './ExecutiveDashboard';
import LiveOrdersKDS from './LiveOrdersKDS';
import InventoryOps from './InventoryOps';
import TableManagement from './TableManagement';
import './Dashboard.css';

function DashboardLayout({ onReturnToStore, activeOrders = [], onUpdateOrderStatus, tables = [], onUpdateTableStatus }) {
  const [activeTab, setActiveTab] = useState('executive'); // 'executive' | 'kds' | 'inventory' | 'tables'
  const [isNightMode, setIsNightMode] = useState(false);
  const [storeStatus, setStoreStatus] = useState('OPEN'); // 'OPEN' | 'RUSH' | 'PAUSED'

  return (
    <div className={`freshbowl-dashboard-root ${isNightMode ? 'night-shift' : ''}`}>
      {/* Top Bar */}
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <button className="back-store-btn" onClick={onReturnToStore}>
            <span>← Exit to Storefront</span>
          </button>
          <div className="brand-badge">
            <span className="brand-logo-icon">🥗</span>
            <div>
              <div className="brand-name">Fresh Bowl</div>
              <div className="brand-subtitle">Smart Dine OS • Management Console</div>
            </div>
          </div>
        </div>

        <div className="topbar-center">
          <div className="store-status-pill">
            <span className="status-label">Store Status:</span>
            <button 
              className={`status-btn status-open ${storeStatus === 'OPEN' ? 'active' : ''}`}
              onClick={() => setStoreStatus('OPEN')}
            >
              🟢 Normal
            </button>
            <button 
              className={`status-btn status-rush ${storeStatus === 'RUSH' ? 'active' : ''}`}
              onClick={() => setStoreStatus('RUSH')}
            >
              ⚡ Peak Rush
            </button>
            <button 
              className={`status-btn status-paused ${storeStatus === 'PAUSED' ? 'active' : ''}`}
              onClick={() => setStoreStatus('PAUSED')}
            >
              🔴 Paused
            </button>
          </div>
        </div>

        <div className="topbar-right">
          <button 
            className="theme-toggle-btn"
            onClick={() => setIsNightMode(!isNightMode)}
            title="Toggle Night Shift Mode"
          >
            {isNightMode ? '☀️ Day View' : '🌙 Night Shift'}
          </button>

          <div className="staff-profile">
            <div className="staff-avatar">FB</div>
            <div className="staff-info">
              <span className="staff-name">Chef Manager</span>
              <span className="staff-role">Main Kitchen</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'executive' ? 'active' : ''}`}
              onClick={() => setActiveTab('executive')}
            >
              <span className="nav-icon">📊</span>
              <div className="nav-text">
                <span className="nav-title">Executive View</span>
                <span className="nav-desc">Revenue & Metrics</span>
              </div>
            </button>

            <button 
              className={`nav-item ${activeTab === 'kds' ? 'active' : ''}`}
              onClick={() => setActiveTab('kds')}
            >
              <span className="nav-icon">🍳</span>
              <div className="nav-text">
                <span className="nav-title">Live Orders & KDS</span>
                <span className="nav-desc">Kitchen Tickets ({activeOrders.length})</span>
              </div>
              {activeOrders.length > 0 && (
                <span className="nav-badge">{activeOrders.length}</span>
              )}
            </button>

            <button 
              className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <span className="nav-icon">📦</span>
              <div className="nav-text">
                <span className="nav-title">Inventory & Ops</span>
                <span className="nav-desc">Ingredients & Supply</span>
              </div>
            </button>

            <button 
              className={`nav-item ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              <span className="nav-icon">🪑</span>
              <div className="nav-text">
                <span className="nav-title">Table Floorplan</span>
                <span className="nav-desc">Dine-in QR Setup</span>
              </div>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="kds-system-health">
              <div className="health-header">
                <span className="pulse-dot"></span>
                <span>System Online • v2.4</span>
              </div>
              <p className="health-detail">Synced with Storefront API</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          {activeTab === 'executive' && (
            <ExecutiveDashboard 
              activeOrders={activeOrders} 
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'kds' && (
            <LiveOrdersKDS 
              orders={activeOrders} 
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryOps />
          )}

          {activeTab === 'tables' && (
            <TableManagement 
              tables={tables}
              onUpdateTableStatus={onUpdateTableStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
