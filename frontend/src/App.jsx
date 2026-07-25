import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import StayConnectedSection from './components/StayConnectedSection';
import Footer from './components/Footer';
import DishModal from './components/DishModal';
import LoginModal from './components/LoginModal';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [cart, setCart] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Auto clear toast notification
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Check stored authentication token on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        } else {
          // Invalid or expired token
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        console.error('Failed to restore user session:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (dishItem) => {
    setCart(prevCart => [...prevCart, dishItem]);
    setToastMessage(`Added ${dishItem.quantity}x ${dishItem.name} to your order!`);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setToastMessage(`Welcome back, ${userData.fullName || userData.name || userData.email.split('@')[0]}!`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout request error:', err);
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    setToastMessage('You have been logged out.');
  };

  return (
    <div className="app-container texture-overlay">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 200,
          background: 'var(--on-surface)',
          color: '#fff',
          padding: '0.85rem 1.75rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          borderLeft: '4px solid var(--primary)',
          animation: 'slideUp 0.3s ease'
        }}>
          <span>✨</span>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage('')}
            style={{ color: '#aaa', marginLeft: '0.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Navigation */}
      <Header 
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection 
          onExploreClick={() => handleNavigate('menu')}
        />

        <MenuSection 
          onSelectDish={(dish) => setSelectedDish(dish)}
        />

        <StayConnectedSection 
          onToast={(msg) => setToastMessage(msg)}
        />
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
      />

      {/* Interactive Modals */}
      {selectedDish && (
        <DishModal 
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
