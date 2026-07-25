import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import StayConnectedSection from './components/StayConnectedSection';
import Footer from './components/Footer';
import DishModal from './components/DishModal';
import LoginModal from './components/LoginModal';

// Feature Modals
import QrMenuModal from './components/QrMenuModal';
import AiTasteAssistantModal from './components/AiTasteAssistantModal';
import TableReservationModal from './components/TableReservationModal';
import QueueTrackerModal from './components/QueueTrackerModal';
import OrderStatusModal from './components/OrderStatusModal';
import AiChatConcierge from './components/AiChatConcierge';

import { INITIAL_MENU_ITEMS } from './data/menuData';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [cart, setCart] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Feature Modal States
  const [lang, setLang] = useState('EN');
  const [currentTable, setCurrentTable] = useState(null); // { tableNumber, zone }
  const [queueState, setQueueState] = useState(null); // { ticketNo, position, estWaitMins }
  const [activeOrder, setActiveOrder] = useState(null); // { orderId, items, total, step, tableNumber }

  // Modal Open Controls
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);

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
    const qty = dishItem.quantity || 1;
    setCart(prevCart => [...prevCart, dishItem]);

    // Create live order for status tracking simulation
    const newTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) + (dishItem.price * qty);
    const updatedItems = [...cart, dishItem];

    setActiveOrder({
      orderId: 'FB-' + Math.floor(1000 + Math.random() * 9000),
      items: updatedItems,
      total: newTotal,
      step: 2, // Kitchen Prep stage
      tableNumber: currentTable ? currentTable.tableNumber : 'Takeout'
    });

    setToastMessage(`Added ${qty}x ${dishItem.name} to your order! Live order tracking active.`);
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
            style={{ color: '#aaa', marginLeft: '0.5rem', cursor: 'pointer', background: 'none', border: 'none' }}
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
        currentUser={user}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        lang={lang}
        onLangChange={(newLang) => { setLang(newLang); setToastMessage(`Language changed to ${newLang}`); }}
        currentTable={currentTable}
        onOpenQrModal={() => setIsQrOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onOpenOrderStatus={() => setIsOrderStatusOpen(true)}
        activeOrder={activeOrder}
        queueState={queueState}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection 
          onExploreClick={() => handleNavigate('menu')}
          onReserveClick={() => setIsReservationOpen(true)}
        />

        <MenuSection 
          menuItems={menuItems}
          onSelectDish={(dish) => setSelectedDish(dish)}
          onAddToCart={handleAddToCart}
          lang={lang}
          onOpenAiAssistant={() => setIsAiOpen(true)}
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

      {/* 1. QR Table Menu Modal */}
      <QrMenuModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        currentTable={currentTable?.tableNumber}
        onSelectTable={(tableInfo) => {
          setCurrentTable(tableInfo);
          setToastMessage(`Dine-in Table #${tableInfo.tableNumber} (${tableInfo.zone}) Activated!`);
        }}
      />

      {/* 2. AI Taste Assistant Modal */}
      <AiTasteAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        menuItems={menuItems}
        onSelectDish={(dish) => {
          setSelectedDish(dish);
          setIsAiOpen(false);
        }}
      />

      {/* 3. Table Reservation Modal */}
      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* 4. Virtual Queue Tracker Modal */}
      <QueueTrackerModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queueState={queueState}
        onJoinQueue={(qData) => {
          setQueueState(qData);
          setToastMessage(`Joined virtual queue! Ticket #${qData.ticketNo}`);
        }}
        onLeaveQueue={() => {
          setQueueState(null);
          setToastMessage('You left the virtual queue.');
        }}
      />

      {/* 5. Live Order Status Modal */}
      <OrderStatusModal
        isOpen={isOrderStatusOpen}
        onClose={() => setIsOrderStatusOpen(false)}
        activeOrder={activeOrder}
      />

      {/* Floating AI Concierge Live Chat Widget */}
      <AiChatConcierge
        menuItems={menuItems}
        onAddToCart={handleAddToCart}
        onOpenReservation={() => setIsReservationOpen(true)}
      />
    </div>
  );
}

export default App;
