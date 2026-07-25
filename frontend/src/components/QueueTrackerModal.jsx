import React, { useState, useEffect } from 'react';

export default function QueueTrackerModal({ isOpen, onClose, queueState, onJoinQueue, onLeaveQueue }) {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e) => {
    e.preventDefault();
    onJoinQueue({
      ticketNo: 'Q-' + Math.floor(100 + Math.random() * 900),
      name: name || 'Guest',
      partySize,
      position: 3,
      estWaitMins: 14,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
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
            🚶‍♂️
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.3rem' }}>
            Virtual Queue Tracker
          </h3>
          <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Join our walk-in waitlist from anywhere and get live updates
          </p>
        </div>

        {queueState ? (
          /* Active Queue Ticket Display */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,91,0,0.08), rgba(255,255,255,0.9))',
              border: '2px solid var(--primary)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                Live Queue Ticket
              </span>

              <div style={{
                fontSize: '3rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: '800',
                color: 'var(--primary)',
                margin: '0.5rem 0'
              }}>
                {queueState.ticketNo}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', textAlign: 'left' }}>
                <div style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid var(--outline-variant)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>POSITION IN LINE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    #{queueState.position} <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>parties ahead</span>
                  </div>
                </div>

                <div style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid var(--outline-variant)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>ESTIMATED WAIT</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                    ~{queueState.estWaitMins} mins
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                Party of <strong>{queueState.partySize}</strong> • Joined at {queueState.joinedAt}
              </div>
            </div>

            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              color: '#2e7d32',
              padding: '0.75rem',
              borderRadius: '1rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.25rem'
            }}>
              📲 We'll send an SMS notification when your table is 2 minutes away!
            </div>

            <button
              type="button"
              onClick={onLeaveQueue}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '9999px',
                border: '1px solid var(--error, #ba1a1a)',
                color: '#ba1a1a',
                background: 'transparent',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Leave Queue
            </button>
          </div>
        ) : (
          /* Join Queue Form */
          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--outline-variant)',
                    background: 'var(--background)'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 8].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Mobile Phone (SMS alerts)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--outline-variant)',
                    background: 'var(--background)'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pill-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            >
              Join Walk-In Queue Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
