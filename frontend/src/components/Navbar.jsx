import React from 'react';
import { ShoppingBag, Lock } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, openCart, onAdminClick }) {
  return (
    <header className="glass-header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('catalog')}>
          <img 
            src="/logo.png" 
            alt="Tuta's Paper Logo" 
            style={{
              height: '46px',
              width: 'auto',
              borderRadius: '10px',
              boxShadow: '0 3px 10px rgba(23,52,64,0.18)',
              objectFit: 'contain',
              background: '#9fe3eb',
              flexShrink: 0
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: '1.2', color: 'var(--primary)', fontWeight: '800', letterSpacing: '-0.3px' }}>
              Tuta's Paper
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Papelaria • Religiosos • Bottons
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-outline" 
            onClick={openCart} 
            style={{ position: 'relative', borderRadius: '50%', width: '44px', height: '44px', padding: 0 }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <button className="btn btn-outline" onClick={onAdminClick} title="Acesso Admin" style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0 }}>
            <Lock size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
