import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isStaffAccount, setIsStaffAccount] = useState(false);
  const [staffPasscode, setStaffPasscode] = useState('');

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMsg('');
    setInfoMsg('');
  };

  /**
   * After Firebase auth succeeds, sync the user to MongoDB backend.
   * If backend is offline or 404s, falls back gracefully to client-side Firebase user data.
   */
  const syncUserToBackend = async (firebaseUser, options = {}) => {
    const idToken = await firebaseUser.getIdToken();
    
    try {
      const response = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: firebaseUser.displayName || options.displayName || '',
          role: options.role || 'customer',
          staffPasscode: options.staffPasscode || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { ...data, token: idToken };
      }
    } catch (err) {
      console.warn('[AUTH] Backend sync API unreachable, fallback to Firebase profile:', err);
    }

    // Fallback user object if backend sync API fails or is not deployed
    const isStaffEmail = firebaseUser.email && firebaseUser.email.toLowerCase().endsWith('@freshbowl.com');
    const fallbackUser = {
      id: firebaseUser.uid,
      fullName: options.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
      email: firebaseUser.email,
      role: options.role || (isStaffEmail ? 'staff' : 'customer'),
      isVerified: firebaseUser.emailVerified
    };
    return { user: fallbackUser, token: idToken };
  };

  /**
   * Map Firebase error codes to user-friendly messages
   */
  const getFirebaseErrorMessage = (errorCode) => {
    const errorMap = {
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
      'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups for this site.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/unauthorized-domain': 'Firebase Domain Error: Please add team-vortex-hq8d-orcin.vercel.app under Firebase Console -> Auth -> Settings -> Authorized Domains.',
    };
    return errorMap[errorCode] || `Authentication failed (${errorCode}). Please try again.`;
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Sync with backend (or use fallback)
      const data = await syncUserToBackend(firebaseUser);

      localStorage.setItem('auth_token', data.token);
      onLoginSuccess(data.user || { email, fullName: firebaseUser.displayName || email.split('@')[0] });
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      if (err.code) {
        setErrorMsg(getFirebaseErrorMessage(err.code));
      } else {
        setErrorMsg(err.message || 'Unable to connect to authentication server.');
      }
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
      const isStaffRequest = isStaffAccount || email.toLowerCase().trim().endsWith('@freshbowl.com');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Set display name on Firebase profile
      await updateProfile(firebaseUser, { displayName: fullName }).catch(e => console.warn('updateProfile notice:', e));

      // Attempt to send email verification (non-blocking if email service unconfigured)
      await sendEmailVerification(firebaseUser).catch(e => console.warn('Verification email notice:', e));

      // Sync with backend (or fallback)
      const data = await syncUserToBackend(firebaseUser, {
        displayName: fullName,
        role: isStaffRequest ? 'staff' : 'customer',
        staffPasscode: isStaffAccount ? staffPasscode : '',
      });

      localStorage.setItem('auth_token', data.token);
      onLoginSuccess(data.user || { email, fullName });
      setInfoMsg('Account created successfully!');
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code) {
        setErrorMsg(getFirebaseErrorMessage(err.code));
      } else {
        setErrorMsg(err.message || 'Unable to connect to authentication server.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    resetMessages();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Sync with backend
      const data = await syncUserToBackend(firebaseUser, {
        displayName: firebaseUser.displayName,
      });

      const idToken = await firebaseUser.getIdToken();
      localStorage.setItem('auth_token', idToken);
      onLoginSuccess(data.user || {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        fullName: firebaseUser.displayName,
      });
      onClose();
    } catch (err) {
      console.error('Google sign-in error:', err);
      if (err.code) {
        setErrorMsg(getFirebaseErrorMessage(err.code));
      } else {
        setErrorMsg(err.message || 'Google sign-in failed.');
      }
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
          <form className="tab-slide-enter" onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
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

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '500' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '9999px',
                border: '1.5px solid var(--outline-variant)',
                background: 'var(--surface-container-lowest)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--on-surface)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        )}

        {/* Tab 2: Register Form */}
        {tab === 'register' && (
          <form className="tab-slide-enter" onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
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

            {/* Staff Account Access Option */}
            <div style={{
              background: 'var(--surface-container-low)',
              padding: '0.85rem 1.1rem',
              borderRadius: '1.1rem',
              border: '1px solid var(--outline-variant)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={isStaffAccount} 
                  onChange={(e) => setIsStaffAccount(e.target.checked)} 
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <span>Register as Restaurant Staff / Manager Account</span>
              </label>

              {isStaffAccount && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', marginBottom: '0.35rem', color: 'var(--primary)' }}>
                    Staff Security Passcode
                  </label>
                  <input 
                    type="password" 
                    placeholder="Enter Staff Passcode (e.g. STAFF2026)"
                    value={staffPasscode}
                    onChange={(e) => setStaffPasscode(e.target.value)}
                    required={isStaffAccount}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '9999px',
                      border: '1.5px solid var(--primary)',
                      background: 'var(--background)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--secondary)', marginTop: '0.35rem' }}>
                    * Staff access requires an authorized @freshbowl.com email or valid security passcode.
                  </span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-pill-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '500' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '9999px',
                border: '1.5px solid var(--outline-variant)',
                background: 'var(--surface-container-lowest)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--on-surface)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
