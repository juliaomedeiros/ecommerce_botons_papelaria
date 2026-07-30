import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import BottonPreviewCanvas from './components/BottonPreviewCanvas';
import SizeGuideModal from './components/SizeGuideModal';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import { Sparkles, ShieldCheck, Clock, Award, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'fastfood'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEventoMode, setIsEventoMode] = useState(false);
  const [guideProceedTarget, setGuideProceedTarget] = useState(null); // 'fastfood' | 'cart' | null

  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
      setIsAdminOpen(true);
    }

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.modo_evento_24h === 'boolean') {
          setIsEventoMode(data.modo_evento_24h);
        }
      })
      .catch(err => console.log('Usando modo padrão 5 dias (api/config indisponível no momento):', err.message));
  }, []);

  function handleAddToCart(item) {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  }

  function handleAddToCartFromCatalog(item) {
    setCart(prev => [...prev, item]);
    // Abrir o guia de tamanhos como confirmação visual antes do carrinho
    setGuideProceedTarget('cart');
    setIsSizeGuideOpen(true);
  }

  function handleOpenCustomizerFlow() {
    // Abrir o guia de tamanhos primeiro no fluxo de personalizador
    setGuideProceedTarget('fastfood');
    setIsSizeGuideOpen(true);
  }

   function handleConfirmSizeGuide() {
    setIsSizeGuideOpen(false);
    if (guideProceedTarget === 'fastfood') {
      setActiveTab('fastfood');
    } else if (guideProceedTarget === 'cart') {
      setIsCartOpen(true);
    }
    setGuideProceedTarget(null);
  }

  function handleClearCart() {
    setCart([]);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Banner de Aviso Chamativo - Apenas quando a Flag Modo Evento estiver Ativa */}
      {isEventoMode && (
        <div style={{
          background: 'linear-gradient(90deg, #173440, #3fb9c8)',
          color: '#ffffff',
          padding: '10px 16px',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(23,52,64,0.2)'
        }}>
          <Zap size={18} color="#fff7eb" />
          <span>⚡ MODO EVENTO ATIVO: Produção Noturna Expressa & Envio em 24h!</span>
        </div>
      )}

      {/* Header institucional */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.length}
        openCart={() => setIsCartOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onCustomizeClick={handleOpenCustomizerFlow}
        onOpenSizeGuide={() => { setGuideProceedTarget(null); setIsSizeGuideOpen(true); }}
      />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0c1a20 0%, #173440 100%)',
        color: '#ffffff',
        padding: '50px 0 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '14px', letterSpacing: '0.5px' }}>
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Papelaria • Religiosos • Bottons
            </span>

            {/* Frase dinâmica do Hero baseada no Modo Evento (RN-05) */}
            <h1 style={{ fontSize: '2.5rem', lineHeight: '1.25', color: '#ffffff', marginBottom: '16px' }}>
              {isEventoMode ? (
                <>Seu botton em <span style={{ color: 'var(--secondary)' }}>24 Horas</span> com opção de personalizar.</>
              ) : (
                <>Escolha seu botton, chaveiro ou ímã com as imagens abaixo ou personalize com uma imagem sua.</>
              )}
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#cbe4e8', marginBottom: '28px' }}>
              Disponível nos diâmetros de <strong>25mm</strong> (discreto) e <strong>38mm</strong> (padrão). Escolha o acabamento ideal de <strong>Alfinete</strong>, <strong>Chaveiro</strong> ou <strong>Ímã de Geladeira</strong>.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleOpenCustomizerFlow}>
                <Sparkles size={18} /> Personalize com uma imagem
              </button>
              <button className="btn btn-outline" onClick={() => { setGuideProceedTarget(null); setIsSizeGuideOpen(true); }} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                Consultar Guia de Tamanhos
              </button>
            </div>
          </div>
        </div>

        {/* Círculos decorativos no Hero */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63,185,200,0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />
      </section>

      {/* Destaques de Confiança */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #cee4e8', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--primary)" />
            {isEventoMode ? 'Produção Noturna & Envio em 24h' : 'Produção Artesanal & Envio em até 5 Dias Úteis'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--primary)" /> Pagamento Seguro Mercado Pago
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="var(--primary)" /> Tamanhos 25mm e 38mm com Prensa HD
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container" style={{ flex: 1, padding: '40px 20px' }}>
        
        {/* Seção Personalizador de Imagem */}
        {activeTab === 'fastfood' && (
          <div style={{ marginBottom: '50px' }}>
            <BottonPreviewCanvas
              onAddToCart={handleAddToCart}
              onOpenSizeGuide={() => { setGuideProceedTarget(null); setIsSizeGuideOpen(true); }}
            />
          </div>
        )}

        {/* Seção Catálogo Geral por Categorias (Foco Principal da Loja) */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '4px' }}>
                Catálogo de Modelos Prontos
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Escolha a imagem desejada e selecione o diâmetro (25mm/38mm) e o acabamento.
              </p>
            </div>

            <button className="btn btn-outline" onClick={handleOpenCustomizerFlow} style={{ fontSize: '0.9rem' }}>
              <Sparkles size={16} color="var(--primary)" /> Personalize com uma imagem
            </button>
          </div>

          <Catalog
            isEventoMode={isEventoMode}
            onAddToCart={handleAddToCartFromCatalog}
            onCustomizeClick={handleOpenCustomizerFlow}
          />
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--dark)', color: '#94a3b8', padding: '40px 0 20px', borderTop: '1px solid #142832' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '8px' }}>Tuta's Paper</h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '350px' }}>
              Papelaria, Artigos Religiosos e Bottons Personalizados. Qualidade de impressão HD e acabamento profissional.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '8px' }}>Categorias</h4>
            <p style={{ fontSize: '0.85rem' }}>• Bottons, Chaveiros & Ímãs (25mm/38mm)</p>
            <p style={{ fontSize: '0.85rem' }}>• Artigos Religiosos</p>
            <p style={{ fontSize: '0.85rem' }}>• Materiais de Papelaria</p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '8px' }}>Atendimento</h4>
            <p style={{ fontSize: '0.85rem' }}>WhatsApp Notificações: Evolution API</p>
            <p style={{ fontSize: '0.85rem' }}>Pagamentos: Mercado Pago Pix & Cartão</p>
          </div>
        </div>

        <div className="container" style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '20px', fontSize: '0.8rem' }}>
          © 2026 Tuta's Paper. Aplicação Conteinerizada via Docker. Todos os direitos reservados.
        </div>
      </footer>

      {/* Modais da Aplicação */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => { setIsSizeGuideOpen(false); setGuideProceedTarget(null); }}
        onConfirm={handleConfirmSizeGuide}
        isFlowTarget={!!guideProceedTarget}
      />

      <Checkout
        cart={cart}
        isEventoMode={isEventoMode}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onClearCart={handleClearCart}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        isEventoMode={isEventoMode}
        onToggleEventoMode={(newVal) => setIsEventoMode(newVal)}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}
