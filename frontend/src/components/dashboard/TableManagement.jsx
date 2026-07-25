import React, { useState } from 'react';

function TableManagement({ tables: propTables = [], onUpdateTableStatus }) {
  const defaultTables = [
    { id: 'T01', number: '01', zone: 'Garden Terrace', seats: 4, status: 'AVAILABLE', currentOrder: null },
    { id: 'T02', number: '02', zone: 'Garden Terrace', seats: 2, status: 'OCCUPIED', currentOrder: 'FB-9014', timeSeated: '22m' },
    { id: 'T03', number: '03', zone: 'Garden Terrace', seats: 6, status: 'RESERVED', reservedFor: '7:30 PM (Sarah M.)' },
    { id: 'T04', number: '04', zone: 'Garden Terrace', seats: 4, status: 'OCCUPIED', currentOrder: 'FB-9012', timeSeated: '14m' },

    { id: 'T05', number: '05', zone: 'Main Dining', seats: 2, status: 'AVAILABLE', currentOrder: null },
    { id: 'T06', number: '06', zone: 'Main Dining', seats: 4, status: 'DIRTY', currentOrder: null },
    { id: 'T07', number: '07', zone: 'Main Dining', seats: 4, status: 'OCCUPIED', currentOrder: 'FB-9010', timeSeated: '35m' },
    { id: 'T08', number: '08', zone: 'Main Dining', seats: 8, status: 'AVAILABLE', currentOrder: null },

    { id: 'T09', number: '09', zone: 'Outdoor Patio', seats: 4, status: 'AVAILABLE', currentOrder: null },
    { id: 'T10', number: '10', zone: 'Outdoor Patio', seats: 2, status: 'OCCUPIED', currentOrder: 'FB-9008', timeSeated: '8m' },
    { id: 'T11', number: '11', zone: 'Outdoor Patio', seats: 4, status: 'AVAILABLE', currentOrder: null },
    { id: 'T12', number: '12', zone: 'Outdoor Patio', seats: 6, status: 'RESERVED', reservedFor: '8:00 PM' }
  ];

  const [tables, setTables] = useState(defaultTables);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [qrModalTable, setQrModalTable] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleStatusChange = (tableId, newStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));

    if (onUpdateTableStatus) {
      onUpdateTableStatus(tableId, newStatus);
    }
  };

  const filteredTables = tables.filter(t => selectedZone === 'ALL' || t.zone === selectedZone);

  const getTableQrUrl = (table) => {
    const origin = window.location.origin;
    return `${origin}/?table=${table.number}&zone=${encodeURIComponent(table.zone)}`;
  };

  const copyQrLink = (table) => {
    const url = getTableQrUrl(table);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="table-management-container font-sans">
      <div className="table-header">
        <div>
          <h1 className="dashboard-page-title font-serif">Dine-In Floorplan & Table Setup</h1>
          <p className="dashboard-page-sub font-sans">Manage table seating status, reservations and QR code links</p>
        </div>

        <div className="table-summary-badges">
          <span className="summary-pill available">🟢 {tables.filter(t => t.status === 'AVAILABLE').length} Available</span>
          <span className="summary-pill occupied">🔴 {tables.filter(t => t.status === 'OCCUPIED').length} Occupied</span>
          <span className="summary-pill reserved">🟡 {tables.filter(t => t.status === 'RESERVED').length} Reserved</span>
          <span className="summary-pill dirty">🧹 {tables.filter(t => t.status === 'DIRTY').length} Cleaning</span>
        </div>
      </div>

      {/* Zone Selector */}
      <div className="zone-filter-bar">
        {['ALL', 'Garden Terrace', 'Main Dining', 'Outdoor Patio'].map(zone => (
          <button 
            key={zone}
            className={`zone-pill ${selectedZone === zone ? 'active' : ''}`}
            onClick={() => setSelectedZone(zone)}
          >
            {zone === 'ALL' ? '🏢 All Zones' : zone}
          </button>
        ))}
      </div>

      {/* Tables Grid Layout */}
      <div className="tables-grid">
        {filteredTables.map(table => (
          <div key={table.id} className={`table-card status-${table.status.toLowerCase()}`}>
            <div className="table-card-top">
              <div className="table-number-wrap">
                <span className="table-label">TABLE</span>
                <span className="table-num">#{table.number}</span>
              </div>
              <span className={`table-status-tag ${table.status.toLowerCase()}`}>
                {table.status}
              </span>
            </div>

            <div className="table-card-mid">
              <div className="table-zone">📍 {table.zone}</div>
              <div className="table-seats">👥 {table.seats} Seats Capacity</div>

              {table.status === 'OCCUPIED' && (
                <div className="occupied-info font-sans">
                  <span>Order: <strong>{table.currentOrder}</strong></span>
                  <span>Seated: {table.timeSeated}</span>
                </div>
              )}

              {table.status === 'RESERVED' && (
                <div className="reserved-info font-sans">
                  <span>Reserved: {table.reservedFor}</span>
                </div>
              )}
            </div>

            <div className="table-card-actions">
              <select 
                className="status-select font-sans"
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
              >
                <option value="AVAILABLE">🟢 Set Available</option>
                <option value="OCCUPIED">🔴 Set Occupied</option>
                <option value="RESERVED">🟡 Set Reserved</option>
                <option value="DIRTY">🧹 Needs Cleaning</option>
              </select>

              <button 
                className="qr-code-btn"
                title="View & Print Table QR Code"
                onClick={() => setQrModalTable(table)}
              >
                📱 QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Inspection Modal */}
      {qrModalTable && (
        <div className="table-qr-modal-overlay">
          <div className="table-qr-modal">
            <button className="close-qr-modal" onClick={() => setQrModalTable(null)}>✕</button>
            <h3>Dine-In Table QR Link</h3>
            <p className="qr-sub">Scan to open Fresh Bowl menu automatically linked to Table #{qrModalTable.number}</p>

            <div className="qr-preview-box">
              <div className="qr-simulated-frame">
                <div className="qr-brand-header">🥗 Fresh Bowl</div>
                <div className="qr-code-display">
                  {/* Visual QR SVG representation */}
                  <svg viewBox="0 0 100 100" width="160" height="160" fill="#1A1C1B">
                    <rect x="10" y="10" width="25" height="25" fill="#FF5B00" />
                    <rect x="15" y="15" width="15" height="15" fill="#fff" />
                    <rect x="18" y="18" width="9" height="9" fill="#1A1C1B" />

                    <rect x="65" y="10" width="25" height="25" fill="#FF5B00" />
                    <rect x="70" y="15" width="15" height="15" fill="#fff" />
                    <rect x="73" y="18" width="9" height="9" fill="#1A1C1B" />

                    <rect x="10" y="65" width="25" height="25" fill="#FF5B00" />
                    <rect x="15" y="70" width="15" height="15" fill="#fff" />
                    <rect x="18" y="73" width="9" height="9" fill="#1A1C1B" />

                    <rect x="42" y="42" width="16" height="16" fill="#FF5B00" />
                    <rect x="45" y="15" width="10" height="20" />
                    <rect x="65" y="65" width="20" height="10" />
                    <rect x="40" y="70" width="15" height="15" />
                  </svg>
                </div>
                <div className="qr-table-tag">TABLE #{qrModalTable.number} ({qrModalTable.zone})</div>
              </div>
            </div>

            <div className="qr-url-box">
              <input type="text" readOnly value={getTableQrUrl(qrModalTable)} />
              <button onClick={() => copyQrLink(qrModalTable)}>
                {copiedLink ? '✅ Copied!' : '📋 Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableManagement;
