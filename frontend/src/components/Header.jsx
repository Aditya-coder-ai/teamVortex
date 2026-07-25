import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';

export default function Header({
  activeSection,
  onNavigate,
  onOpenLogin,
  cartCount = 0,
  lang = 'EN',
  onLangChange,
  currentTable,
  onOpenQrModal,
  onOpenReservation,
  onOpenQueue,
  onOpenAiAssistant,
  onOpenOrderStatus,
  activeOrder,
  queueState,
  currentUser
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header" data-purpose="site-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => handleNavClick('hero')}
          style={{ cursor: 'pointer' }}
        >
          {t.brandName} <span>.</span>
        </div>

        {/* Clean Original Desktop Navigation */}
        <nav className="desktop-nav">
          <button 
            type="button"
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => handleNavClick('hero')}
          >
            {t.navHero}
          </button>
          <button 
            type="button"
            className={`nav-link ${activeSection === 'menu' ? 'active' : ''}`}
            onClick={() => handleNavClick('menu')}
          >
            {t.navMenu}
          </button>
          <button 
            type="button"
            className={`nav-link ${activeSection === 'recipes' ? 'active' : ''}`}
            onClick={() => handleNavClick('recipes')}
          >
            {t.navRecipes}
          </button>

          {/* Features Dropdown Menu */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="nav-link feature-dropdown-btn"
              onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--primary)',
                fontWeight: '700'
              }}
            >
              Smart Dining ✨ ▾
            </button>

            {featuresDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  left: '0',
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: '1.25rem',
                  padding: '0.75rem',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  minWidth: '220px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => { onOpenReservation(); setFeaturesDropdownOpen(false); }}
                  className="dropdown-item-btn"
                >
                  🪑 Smart Table Reservation
                </button>
                <button
                  type="button"
                  onClick={() => { onOpenQueue(); setFeaturesDropdownOpen(false); }}
                  className="dropdown-item-btn"
                >
                  🚶‍♂️ Virtual Queue Tracker {queueState && <span className="header-badge">#{queueState.position}</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { onOpenAiAssistant(); setFeaturesDropdownOpen(false); }}
                  className="dropdown-item-btn"
                >
                  🤖 AI Taste Sommelier
                </button>
                <button
                  type="button"
                  onClick={() => { onOpenQrModal(); setFeaturesDropdownOpen(false); }}
                  className="dropdown-item-btn"
                >
                  📱 Dine-In Table QR Scanner
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Table QR Active Badge */}
          {currentTable && (
            <button
              type="button"
              onClick={onOpenQrModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                border: '2px solid var(--primary)',
                background: 'rgba(255, 91, 0, 0.08)',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--primary)',
                cursor: 'pointer'
              }}
            >
              📱 Table #{currentTable.tableNumber}
            </button>
          )}

          {/* Active Order Tracker Pill */}
          {activeOrder && (
            <button
              type="button"
              onClick={onOpenOrderStatus}
              className="pulse-badge"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🛎️ Order Live
            </button>
          )}

          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            style={{
              padding: '0.4rem 0.65rem',
              borderRadius: '9999px',
              border: '1px solid var(--outline-variant)',
              background: 'var(--surface-container-lowest)',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--on-surface)',
              cursor: 'pointer'
            }}
          >
            <option value="EN">🇺🇸 EN</option>
            <option value="ES">🇪🇸 ES</option>
            <option value="FR">🇫🇷 FR</option>
            <option value="JA">🇯🇵 JA</option>
            <option value="ZH">🇨🇳 ZH</option>
            <option value="HI">🇮🇳 HI</option>
          </select>

          {/* Cart Icon */}
          <button 
            type="button"
            className="cart-button"
            onClick={() => handleNavClick('menu')}
            aria-label="View Order Cart"
          >
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Account / Login Button */}
          <button 
            type="button"
            className="btn-pill-primary"
            onClick={onOpenLogin}
          >
            {currentUser ? `👤 ${currentUser.fullName || currentUser.name || 'Member'}` : t.signIn}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <button type="button" onClick={() => handleNavClick('hero')}>{t.navHero}</button>
          <button type="button" onClick={() => handleNavClick('menu')}>{t.navMenu}</button>
          <button type="button" onClick={() => handleNavClick('recipes')}>{t.navRecipes}</button>
          <button type="button" onClick={() => { onOpenReservation(); setMobileMenuOpen(false); }}>🪑 {t.navReserve}</button>
          <button type="button" onClick={() => { onOpenQueue(); setMobileMenuOpen(false); }}>🚶‍♂️ {t.navQueue}</button>
          <button type="button" onClick={() => { onOpenAiAssistant(); setMobileMenuOpen(false); }}>✨ {t.navAiAssistant}</button>
          <button type="button" onClick={() => { onOpenQrModal(); setMobileMenuOpen(false); }}>📱 Table QR Scanner</button>
        </div>
      )}
    </header>
  );
}
