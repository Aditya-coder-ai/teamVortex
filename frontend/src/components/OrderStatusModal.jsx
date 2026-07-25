import React from 'react';

export default function OrderStatusModal({ isOpen, onClose, activeOrder }) {
  if (!isOpen || !activeOrder) return null;

  const STAGES = [
    { step: 1, label: 'Order Received', icon: '📝' },
    { step: 2, label: 'Kitchen Prep', icon: '👨‍🍳' },
    { step: 3, label: 'Plating', icon: '🍲' },
    { step: 4, label: 'Served', icon: '✨' }
  ];

  const currentStep = activeOrder.step || 2; // Default to kitchen prep for demo

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
            background: 'rgba(255, 91, 0, 0.1)',
            color: 'var(--primary)',
            fontSize: '1.75rem',
            marginBottom: '0.75rem'
          }}>
            🛎️
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.3rem' }}>
            Live Order Status
          </h3>
          <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Tracking Order <strong>#{activeOrder.orderId || 'FB-8842'}</strong>
            {activeOrder.tableNumber && ` • Table #${activeOrder.tableNumber}`}
          </p>
        </div>

        {/* Timeline Progress Bar */}
        <div style={{
          background: 'var(--surface-container-low)',
          borderRadius: '1.25rem',
          padding: '1.25rem 1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1rem' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '10%',
              right: '10%',
              height: '3px',
              background: 'var(--outline-variant)',
              zIndex: 1
            }}>
              <div style={{
                height: '100%',
                width: `${((currentStep - 1) / 3) * 100}%`,
                background: 'var(--primary)',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {STAGES.map(s => {
              const isCompleted = s.step <= currentStep;
              return (
                <div key={s.step} style={{ textAlign: 'center', zIndex: 2, flex: 1 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--primary)' : 'var(--background)',
                    color: isCompleted ? '#fff' : 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontWeight: '700',
                    border: isCompleted ? 'none' : '2px solid var(--outline-variant)',
                    boxShadow: isCompleted ? '0 4px 12px rgba(255,91,0,0.3)' : 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    {s.icon}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: isCompleted ? '700' : '500',
                    color: isCompleted ? 'var(--primary)' : 'var(--secondary)'
                  }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '1rem',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            border: '1px solid var(--outline-variant)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>ESTIMATED TIME TO SERVE</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
              ⏱️ 8 - 12 Minutes
            </div>
          </div>
        </div>

        {/* Order Details List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            Items in this order ({activeOrder.items?.length || 0})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '160px', overflowY: 'auto' }}>
            {(activeOrder.items || []).map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justify: 'space-between',
                padding: '0.6rem 0.85rem',
                borderRadius: '0.75rem',
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                fontSize: '0.85rem'
              }}>
                <span><strong>{item.quantity || 1}x</strong> {item.name}</span>
                <span style={{ fontWeight: '700' }}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justify: 'space-between',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '2px dashed var(--outline-variant)',
            fontWeight: '800',
            fontSize: '1.1rem'
          }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--primary)' }}>${(activeOrder.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-pill-primary"
          onClick={onClose}
          style={{ width: '100%', padding: '0.85rem' }}
        >
          Close Status Window
        </button>
      </div>
    </div>
  );
}
