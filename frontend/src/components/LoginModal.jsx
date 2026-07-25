import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMsg('');
    setInfoMsg('');
    setPreviewUrl('');
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresVerification) {
          if (data.devOtp) {
            setOtp(data.devOtp);
          }
          if (data.previewUrl) {
            setPreviewUrl(data.previewUrl);
          }
          setInfoMsg('Email requires verification. A code has been sent to your email.');
          setTab('otp');
        } else {
          setErrorMsg(data.message || 'Login failed. Please check your credentials.');
        }
        return;
      }

      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      onLoginSuccess(data.user || { email, name: email.split('@')[0] });
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role: 'customer' })
      });

      const data = await response.json();

      if (!response.ok) {
        const detailErr = data.errors && data.errors.length > 0 ? data.errors.map(e => e.message).join('. ') : data.message;
        setErrorMsg(detailErr || 'Registration failed.');
        return;
      }

      if (data.devOtp) {
        setOtp(data.devOtp);
        setInfoMsg(`Account created! [Dev Mode OTP: ${data.devOtp}] (Auto-filled below)`);
      } else {
        setInfoMsg('Account created! Please enter the 6-digit OTP sent to your email.');
      }
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
      setTab('otp');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg('Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification Submit
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Invalid or expired OTP code.');
        return;
      }

      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      onLoginSuccess(data.user || { email, fullName: fullName || email.split('@')[0] });
      onClose();
    } catch (err) {
      console.error('OTP error:', err);
      setErrorMsg('Unable to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Modal Brand Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            fresh bowl <span style={{ color: 'var(--primary)' }}>.</span>
          </h3>
          <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Artisanal Dining & Member Privileges
          </p>
        </div>

        {/* Tabs Switcher */}
        {tab !== 'otp' && (
          <div style={{
            display: 'flex',
            background: 'var(--surface-container-low)',
            padding: '0.3rem',
            borderRadius: '9999px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setTab('login'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: tab === 'login' ? 'var(--surface-container-lowest)' : 'transparent',
                color: tab === 'login' ? 'var(--primary)' : 'var(--secondary)',
                boxShadow: tab === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: tab === 'register' ? 'var(--surface-container-lowest)' : 'transparent',
                color: tab === 'register' ? 'var(--primary)' : 'var(--secondary)',
                boxShadow: tab === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Status Messages */}
        {errorMsg && (
          <div style={{
            background: 'rgba(186, 26, 26, 0.08)',
            border: '1px solid var(--error, #ba1a1a)',
            color: '#ba1a1a',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div style={{
            background: 'rgba(255, 91, 0, 0.08)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-dark)',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {infoMsg}
          </div>
        )}

        {/* Tab 1: Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-pill-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Tab 2: Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Alice Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Password (min 6 characters)
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--background)',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-pill-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Tab 3: Verify OTP Form */}
        {tab === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                Verification code sent to <strong>{email}</strong>
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem', textAlign: 'center' }}>
                Enter 6-Digit OTP Code
              </label>
              <input 
                type="text" 
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '9999px',
                  border: '2px solid var(--primary)',
                  background: 'var(--background)',
                  outline: 'none',
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  letterSpacing: '0.4em',
                  fontWeight: '700'
                }}
              />
            </div>

            {previewUrl && (
              <div style={{
                textAlign: 'center',
                background: 'rgba(76, 175, 80, 0.08)',
                border: '1px solid #4CAF50',
                borderRadius: '1rem',
                padding: '0.75rem 1rem',
                fontSize: '0.825rem'
              }}>
                📧 <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50', fontWeight: 600 }}>
                  View your OTP email here (Ethereal inbox)
                </a>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-pill-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Verifying...' : 'Verify OTP & Complete Sign In'}
            </button>

            <button 
              type="button" 
              onClick={() => { setTab('login'); resetMessages(); }}
              style={{ fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'underline', marginTop: '0.5rem' }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
