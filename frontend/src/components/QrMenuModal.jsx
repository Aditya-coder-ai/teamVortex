import React, { useState } from 'react';

export default function QrMenuModal({ isOpen, onClose, currentTable, onSelectTable }) {
  const [selectedTable, setSelectedTable] = useState(currentTable || '04');
  const [zone, setZone] = useState('Garden Terrace');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectTable({ tableNumber: selectedTable, zone });
    onClose();
  };

  const menuUrl = `https://freshbowl.app/menu?table=${selectedTable}&zone=${encodeURIComponent(zone)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        <div style={{ marginBottom: '1.25rem' }}>
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
            📱
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.3rem' }}>
            Dine-In Table QR Menu
          </h3>
          <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Scan or select your table number for contactless dine-in service
          </p>
        </div>

        {/* Table & Zone Selector */}
        <div style={{
          background: 'var(--surface-container-low)',
          padding: '1.25rem',
          borderRadius: '1.25rem',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Table Number
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  fontWeight: '600',
                  color: 'var(--on-surface)'
                }}
              >
                {Array.from({ length: 20 }, (_, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  return <option key={num} value={num}>Table #{num}</option>;
                })}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Dining Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  fontWeight: '600',
                  color: 'var(--on-surface)'
                }}
              >
                <option value="Garden Terrace">Garden Terrace</option>
                <option value="Main Dining Room">Main Dining Room</option>
                <option value="Chef's Counter">Chef's Counter</option>
                <option value="Patio Bar">Patio Bar</option>
              </select>
            </div>
          </div>
        </div>

        {/* SVG QR Code Simulation */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '1.5rem',
          display: 'inline-block',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '2px solid var(--outline-variant)',
          marginBottom: '1.25rem'
        }}>
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
            {/* Outer Frame & Finder Patterns */}
            <rect x="0" y="0" width="100" height="100" fill="white"/>
            <rect x="5" y="5" width="25" height="25" fill="#1A1C1B" rx="3"/>
            <rect x="9" y="9" width="17" height="17" fill="white" rx="2"/>
            <rect x="13" y="13" width="9" height="9" fill="#FF5B00" rx="1"/>

            <rect x="70" y="5" width="25" height="25" fill="#1A1C1B" rx="3"/>
            <rect x="74" y="9" width="17" height="17" fill="white" rx="2"/>
            <rect x="78" y="13" width="9" height="9" fill="#FF5B00" rx="1"/>

            <rect x="5" y="70" width="25" height="25" fill="#1A1C1B" rx="3"/>
            <rect x="9" y="74" width="17" height="17" fill="white" rx="2"/>
            <rect x="13" y="78" width="9" height="9" fill="#FF5B00" rx="1"/>

            {/* Simulated QR Modules */}
            <rect x="35" y="10" width="6" height="6" fill="#1A1C1B"/>
            <rect x="45" y="10" width="6" height="6" fill="#1A1C1B"/>
            <rect x="55" y="10" width="6" height="6" fill="#FF5B00"/>

            <rect x="10" y="35" width="6" height="6" fill="#1A1C1B"/>
            <rect x="20" y="35" width="6" height="6" fill="#FF5B00"/>
            <rect x="35" y="35" width="30" height="30" fill="#1A1C1B" rx="4"/>
            <rect x="40" y="40" width="20" height="20" fill="white" rx="2"/>
            <circle cx="50" cy="50" r="6" fill="#FF5B00"/>

            <rect x="75" y="35" width="6" height="6" fill="#1A1C1B"/>
            <rect x="85" y="35" width="6" height="6" fill="#1A1C1B"/>

            <rect x="35" y="75" width="6" height="6" fill="#FF5B00"/>
            <rect x="45" y="75" width="6" height="6" fill="#1A1C1B"/>
            <rect x="55" y="75" width="6" height="6" fill="#1A1C1B"/>
            <rect x="75" y="75" width="15" height="15" fill="#1A1C1B" rx="2"/>
          </svg>
          <div style={{ marginTop: '0.5rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>
            Table #{selectedTable} — {zone}
          </div>
        </div>

        {/* Link Copy & Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid var(--outline-variant)',
              background: 'var(--surface-container-lowest)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {copied ? '✓ Link Copied!' : '📋 Copy Digital Menu Link'}
          </button>
        </div>

        <button
          type="button"
          className="btn-pill-primary"
          onClick={handleConfirm}
          style={{ width: '100%', padding: '0.85rem' }}
        >
          Confirm Table #{selectedTable} Dine-In Mode
        </button>
      </div>
    </div>
  );
}
