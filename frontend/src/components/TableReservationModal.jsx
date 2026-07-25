import React, { useState } from 'react';

export default function TableReservationModal({ isOpen, onClose }) {
  const [date, setDate] = useState('2026-07-26');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [zone, setZone] = useState('Garden Terrace');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen) return null;

  const handleBooking = (e) => {
    e.preventDefault();
    const bookingId = 'FB-RES-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedBooking({
      id: bookingId,
      date,
      time,
      guests,
      zone,
      specialRequest
    });
  };

  const handleReset = () => {
    setConfirmedBooking(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        {!confirmedBooking ? (
          <div>
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
                🪑
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.3rem' }}>
                Smart Table Reservation
              </h3>
              <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                Reserve your artisanal dining space at fresh bowl .
              </p>
            </div>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--background)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    Time Slot
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--background)'
                    }}
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:30">1:30 PM (Lunch)</option>
                    <option value="18:00">6:00 PM (Dinner)</option>
                    <option value="19:00">7:00 PM (Dinner)</option>
                    <option value="20:30">8:30 PM (Dinner)</option>
                  </select>
                </div>
              </div>

              {/* Guests & Seating Zone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--background)'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    Seating Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--background)'
                    }}
                  >
                    <option value="Garden Terrace">Garden Terrace 🌿</option>
                    <option value="Main Dining Room">Main Dining Room 🕯️</option>
                    <option value="Chef's Counter">Chef's Counter 👨‍🍳</option>
                    <option value="Patio Bar">Patio Bar 🥂</option>
                  </select>
                </div>
              </div>

              {/* Special Request */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Special Request (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Anniversary, quiet corner, high chair..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1.25rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--outline-variant)',
                    background: 'var(--background)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-pill-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                Confirm Reservation & Get Digital Pass
              </button>
            </form>
          </div>
        ) : (
          /* Confirmed Reservation Pass */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#4CAF50',
              color: '#fff',
              fontSize: '1.5rem',
              marginBottom: '0.75rem'
            }}>
              ✓
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.2rem' }}>
              Reservation Confirmed!
            </h3>
            <p style={{ color: 'var(--secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Your table is reserved. Show this pass upon arrival.
            </p>

            {/* Ticket Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f9f9f7)',
              border: '2px dashed var(--primary)',
              borderRadius: '1.5rem',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>BOOKING PASS</span>
                <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{confirmedBooking.id}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>DATE & TIME</div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{confirmedBooking.date} at {confirmedBooking.time}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>ZONE & GUESTS</div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{confirmedBooking.zone} ({confirmedBooking.guests} Guests)</div>
                </div>
              </div>

              {/* QR Code Pass */}
              <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '1rem', display: 'inline-block', border: '1px solid #eee' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white"/>
                  <rect x="10" y="10" width="25" height="25" fill="#1A1C1B"/>
                  <rect x="14" y="14" width="17" height="17" fill="white"/>
                  <rect x="18" y="18" width="9" height="9" fill="#FF5B00"/>

                  <rect x="65" y="10" width="25" height="25" fill="#1A1C1B"/>
                  <rect x="69" y="14" width="17" height="17" fill="white"/>
                  <rect x="73" y="18" width="9" height="9" fill="#FF5B00"/>

                  <rect x="10" y="65" width="25" height="25" fill="#1A1C1B"/>
                  <rect x="14" y="69" width="17" height="17" fill="white"/>
                  <rect x="18" y="73" width="9" height="9" fill="#FF5B00"/>

                  <rect x="40" y="40" width="20" height="20" fill="#FF5B00" rx="3"/>
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleReset}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '9999px', border: '1px solid var(--outline-variant)', background: 'transparent' }}
              >
                New Booking
              </button>
              <button
                type="button"
                className="btn-pill-primary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
