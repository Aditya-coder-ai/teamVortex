import React, { useState, useRef, useEffect } from 'react';

const QUICK_PROMPTS = [
  "🍵 What is your signature dish?",
  "🌿 Show me vegan & gluten-free options",
  "🪑 How do table reservations work?",
  "🍷 What botanical drinks do you recommend?"
];

export default function AiChatConcierge({ menuItems, onAddToCart, onOpenReservation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Welcome to fresh bowl .! I am your AI Concierge. How can I assist your dining experience today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('signature') || text.includes('popular') || text.includes('best') || text.includes('recommend')) {
      const signature = menuItems.find(i => i.id === 'signature-fresh-bowl') || menuItems[0];
      return {
        text: `Our absolute customer favorite is **${signature.name}** ($${signature.price.toFixed(2)})! It features organic jasmine grains, fresh avocado, edamame, pickled lotus root, and our house sesame-chili drizzle.`,
        recommendedDish: signature
      };
    }

    if (text.includes('vegan') || text.includes('gluten') || text.includes('diet') || text.includes('allergy')) {
      const veganDishes = menuItems.filter(i => i.aiTags?.includes('Vegan') || i.allergens?.length === 0);
      return {
        text: `We take dietary mindfulness very seriously! We have ${veganDishes.length} organic vegan & allergen-conscious options, including **${veganDishes[0]?.name || 'Signature Fresh Bowl'}** and **Wok-Charred Truffle Edamame**. You can also use our menu allergen filter above!`,
        recommendedDish: veganDishes[0]
      };
    }

    if (text.includes('reserve') || text.includes('table') || text.includes('book') || text.includes('seat')) {
      return {
        text: "You can book a table in seconds using our Smart Reservation system! Choose between our Garden Terrace, Main Dining Room, or Chef's Counter.",
        action: 'reserve'
      };
    }

    if (text.includes('drink') || text.includes('matcha') || text.includes('wine') || text.includes('beverage')) {
      const drink = menuItems.find(i => i.category === 'Beverage') || menuItems[5];
      return {
        text: `I highly recommend our **${drink?.name || 'Ceremonial Matcha Cloud Latte'}** ($${drink?.price.toFixed(2)}) made with first-harvest Uji matcha and oat milk foam!`,
        recommendedDish: drink
      };
    }

    if (text.includes('hour') || text.includes('open') || text.includes('time') || text.includes('location')) {
      return {
        text: "We are open daily for Lunch & Dinner from 11:30 AM to 10:00 PM. Located at 124 Organic Epicurean Way."
      };
    }

    return {
      text: "Thank you for asking! We specialize in fresh seasonal harvest bowls, hand-folded dumplings, and botanical elixirs. Would you like a menu recommendation or assistance with a table reservation?"
    };
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = generateResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: resp.text,
        recommendedDish: resp.recommendedDish,
        action: resp.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 150,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(255, 91, 0, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'transform 0.3s ease'
        }}
        aria-label="Toggle AI Concierge Chat"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#4CAF50',
            border: '2px solid #fff'
          }} />
        )}
      </button>

      {/* Chat Concierge Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          zIndex: 150,
          width: 'min(380px, 90vw)',
          height: '520px',
          background: 'var(--surface-container-lowest)',
          borderRadius: '1.5rem',
          border: '1px solid var(--outline-variant)',
          boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--on-surface)',
            color: '#fff',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}>
                🤖
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                  fresh bowl concierge
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#4CAF50', fontWeight: '600' }}>
                  ● Online • AI Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            background: 'var(--background)'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '1.25rem 1.25rem 0.2rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.2rem',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-container-low)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--on-surface)',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--outline-variant)'
                }}>
                  {msg.text}

                  {/* Recommendation Dish Action Card inside message */}
                  {msg.recommendedDish && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.6rem',
                      borderRadius: '0.75rem',
                      background: '#ffffff',
                      border: '1px solid var(--outline-variant)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}>
                      <img
                        src={msg.recommendedDish.image}
                        alt={msg.recommendedDish.name}
                        style={{ width: '45px', height: '45px', borderRadius: '0.5rem', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#1a1c1b' }}>
                          {msg.recommendedDish.name}
                        </div>
                        <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem' }}>
                          ${msg.recommendedDish.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddToCart({ ...msg.recommendedDish, quantity: 1 })}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '9999px',
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  )}

                  {/* Reservation Action Button */}
                  {msg.action === 'reserve' && (
                    <button
                      type="button"
                      onClick={() => { onOpenReservation(); setIsOpen(false); }}
                      style={{
                        marginTop: '0.75rem',
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '9999px',
                        background: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      🪑 Open Smart Reservation →
                    </button>
                  )}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--secondary)',
                  marginTop: '0.25rem',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}>
                  {msg.time}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--surface-container-low)', padding: '0.6rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                🤖 AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--surface-container-low)',
            borderTop: '1px solid var(--outline-variant)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--outline-variant)',
                  background: '#ffffff',
                  fontSize: '0.725rem',
                  fontWeight: '600',
                  color: 'var(--on-surface)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '0.75rem 1rem',
              background: '#ffffff',
              borderTop: '1px solid var(--outline-variant)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Ask about dishes, vegan options, reservations..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: '9999px',
                border: '1px solid var(--outline-variant)',
                background: 'var(--background)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}
