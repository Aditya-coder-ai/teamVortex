import React, { useState, useEffect } from 'react';

function LiveOrdersKDS({ orders = [], onUpdateOrderStatus }) {
  // Default sample KDS orders if none active
  const initialKdsOrders = [
    {
      id: 'FB-9012',
      tableNumber: '04',
      zone: 'Garden Terrace',
      timeAgo: '3 mins ago',
      timerSec: 180,
      type: 'Dine-In',
      items: [
        { name: 'Fresh Bowl Signature Grain', quantity: 2, notes: 'Extra Tahini, No Onions' },
        { name: 'Matcha Iced Latte', quantity: 2, notes: 'Oat Milk' }
      ],
      status: 'NEW'
    },
    {
      id: 'FB-9011',
      tableNumber: '12',
      zone: 'Main Dining',
      timeAgo: '7 mins ago',
      timerSec: 420,
      type: 'Dine-In',
      items: [
        { name: 'Crispy Tofu Harvest Bowl', quantity: 1, notes: 'Spicy Peanut Dressing' },
        { name: 'Avocado Crunch Salad', quantity: 1, notes: '' }
      ],
      status: 'PREP'
    },
    {
      id: 'FB-9009',
      tableNumber: 'Takeout',
      zone: 'Pickup Counter',
      timeAgo: '12 mins ago',
      timerSec: 720,
      type: 'Takeout',
      items: [
        { name: 'Wild Salmon Protein Bowl', quantity: 2, notes: 'Dressing on side' }
      ],
      status: 'READY'
    }
  ];

  const [kdsOrders, setKdsOrders] = useState(() => {
    if (orders && orders.length > 0) {
      return orders.map(o => ({
        id: o.orderId || 'FB-' + Math.floor(1000 + Math.random() * 9000),
        tableNumber: o.tableNumber || 'Takeout',
        zone: o.zone || 'Dine-In',
        timeAgo: 'Just Now',
        timerSec: 30,
        type: o.tableNumber !== 'Takeout' ? 'Dine-In' : 'Takeout',
        items: o.items || [],
        status: o.step === 2 ? 'PREP' : o.step === 3 ? 'READY' : 'NEW'
      }));
    }
    return initialKdsOrders;
  });

  // Sync incoming storefront orders if updated
  useEffect(() => {
    if (orders && orders.length > 0) {
      const formatted = orders.map(o => ({
        id: o.orderId || 'FB-' + Math.floor(1000 + Math.random() * 9000),
        tableNumber: o.tableNumber || 'Takeout',
        zone: 'Dine-In',
        timeAgo: 'Just Now',
        timerSec: 45,
        type: o.tableNumber !== 'Takeout' ? 'Dine-In' : 'Takeout',
        items: o.items || [],
        status: o.step === 2 ? 'PREP' : o.step === 3 ? 'READY' : 'NEW'
      }));

      // Merge avoiding duplicates
      setKdsOrders(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newOnes = formatted.filter(f => !existingIds.has(f.id));
        return [...newOnes, ...prev];
      });
    }
  }, [orders]);

  const advanceOrderStatus = (orderId, currentStatus) => {
    let nextStatus = 'PREP';
    if (currentStatus === 'NEW') nextStatus = 'PREP';
    else if (currentStatus === 'PREP') nextStatus = 'READY';
    else if (currentStatus === 'READY') nextStatus = 'COMPLETED';

    setKdsOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    }));

    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, nextStatus);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW': return <span className="kds-badge new">🔔 NEW TICKET</span>;
      case 'PREP': return <span className="kds-badge prep">🔥 IN PREPARATION</span>;
      case 'READY': return <span className="kds-badge ready">✅ READY FOR PICKUP</span>;
      default: return null;
    }
  };

  const renderColumn = (colStatus, colTitle, colIcon) => {
    const columnOrders = kdsOrders.filter(o => o.status === colStatus);

    return (
      <div className={`kds-column col-${colStatus.toLowerCase()}`}>
        <div className="kds-column-header">
          <div className="col-title">
            <span>{colIcon}</span>
            <span>{colTitle}</span>
          </div>
          <span className="col-count">{columnOrders.length}</span>
        </div>

        <div className="kds-tickets-list">
          {columnOrders.length === 0 ? (
            <div className="kds-empty-state">
              <span>☕</span>
              <p>No orders in {colTitle.toLowerCase()}</p>
            </div>
          ) : (
            columnOrders.map(order => (
              <div key={order.id} className="kds-ticket-card">
                <div className="ticket-top font-sans">
                  <div className="ticket-id">
                    <strong>{order.id}</strong>
                    <span className="ticket-type">{order.type}</span>
                  </div>
                  <div className="ticket-location font-sans">
                    🪑 Table #{order.tableNumber}
                  </div>
                </div>

                <div className="ticket-status-bar font-sans">
                  {getStatusBadge(order.status)}
                  <span className="ticket-timer font-sans">⏱️ {order.timeAgo}</span>
                </div>

                <div className="ticket-items-list font-sans">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="ticket-item-row font-sans">
                      <span className="item-qty">{item.quantity || 1}x</span>
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        {item.notes && <span className="item-notes font-sans">⚠️ {item.notes}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ticket-actions font-sans">
                  {order.status === 'NEW' && (
                    <button 
                      className="kds-action-btn btn-start-prep font-sans"
                      onClick={() => advanceOrderStatus(order.id, order.status)}
                    >
                      🔥 Start Cooking / Prep
                    </button>
                  )}

                  {order.status === 'PREP' && (
                    <button 
                      className="kds-action-btn btn-mark-ready font-sans"
                      onClick={() => advanceOrderStatus(order.id, order.status)}
                    >
                      ✅ Mark Order Ready
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button 
                      className="kds-action-btn btn-complete font-sans"
                      onClick={() => advanceOrderStatus(order.id, order.status)}
                    >
                      🎉 Complete & Clear Ticket
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="kds-dashboard-container">
      <div className="kds-header">
        <div>
          <h1 className="dashboard-page-title">Kitchen Display System (KDS)</h1>
          <p className="dashboard-page-sub">Live fresh bowl prep queue and order fulfillment</p>
        </div>

        <div className="kds-header-stats font-sans">
          <div className="stat-pill font-sans">
            <span>Pending Tickets:</span>
            <strong>{kdsOrders.filter(o => o.status !== 'COMPLETED').length}</strong>
          </div>
          <button 
            className="refresh-kds-btn font-sans"
            onClick={() => alert('KDS synced with latest storefront orders!')}
          >
            🔄 Sync Orders
          </button>
        </div>
      </div>

      {/* KDS 3-Column Kanban Board */}
      <div className="kds-kanban-board">
        {renderColumn('NEW', 'Incoming Orders', '🔔')}
        {renderColumn('PREP', 'Kitchen Prep & Assembly', '🔥')}
        {renderColumn('READY', 'Ready for Serving / Pickup', '✅')}
      </div>
    </div>
  );
}

export default LiveOrdersKDS;
