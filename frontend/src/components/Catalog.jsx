import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag, Filter, Sparkles, AlertCircle, Eye } from 'lucide-react';
import BottonMockupDisplay from './BottonMockupDisplay';

export default function Catalog({ isEventoMode, isModo24h, onAddToCart, onCustomizeClick, onSelectProduct }) {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFinishFilter, setSelectedFinishFilter] = useState('all');

  useEffect(() => {
    // Buscar Categorias dinâmicas da API
    fetch('/api/categories')
      .then(res => res.json())
      .then(catData => {
        if (Array.isArray(catData) && catData.length > 0) {
          const formattedCats = [
            { id: 'all', name: 'Todos os Produtos' },
            ...catData.map(c => ({ id: c.id || c.name, name: c.name }))
          ];
          setCategories(formattedCats);
        } else {
          setCategories([
            { id: 'all', name: 'Todos os Produtos' },
            { id: 'cat-bottons-001', name: 'Bottons, Chaveiros & Ímãs' },
            { id: 'cat-religiosos-002', name: 'Artigos Religiosos' },
            { id: 'cat-papelaria-003', name: 'Materiais de Papelaria' }
          ]);
        }
      })
      .catch(() => {
        setCategories([
          { id: 'all', name: 'Todos os Produtos' },
          { id: 'cat-bottons-001', name: 'Bottons, Chaveiros & Ímãs' },
          { id: 'cat-religiosos-002', name: 'Artigos Religiosos' },
          { id: 'cat-papelaria-003', name: 'Materiais de Papelaria' }
        ]);
      });

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Quando Modo 24h está ATIVADO, remover produtos customizáveis e botões de personalização
  const visibleProducts = products.filter(p => {
    if (isModo24h && p.is_customizable) return false;
    if (selectedCat !== 'all' && p.category_id !== selectedCat) return false;
    if (selectedFinishFilter !== 'all' && p.finish_type !== selectedFinishFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Aviso Modo 24h quando ativo */}
      {isModo24h && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl mb-4 text-xs text-yellow-300 flex items-center gap-2">
          <AlertCircle size={16} className="text-yellow-400 shrink-0" />
          <span><strong>Modo Entrega Rápida 24h Ativo:</strong> Exibindo apenas produtos prontos do catálogo para postagem expressa em até 24h.</span>
        </div>
      )}

      {/* Navegação por Categorias */}
      <div className="tabs-nav">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${selectedCat === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filtros Rápidos por Acabamento */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>Acabamento de Verso:</span>
        {[
          { id: 'all', label: 'Todos' },
          { id: 'alfinete', label: '🧷 Alfinete' },
          { id: 'chaveiro', label: '🔑 Chaveiro 2 Faces' },
          { id: 'ima', label: '🧲 Ímã de Geladeira' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFinishFilter(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              border: selectedFinishFilter === f.id ? '2px solid var(--primary)' : '1px solid #cbd5e1',
              background: selectedFinishFilter === f.id ? 'var(--primary-light)' : '#ffffff',
              color: selectedFinishFilter === f.id ? 'var(--primary)' : '#475569',
              fontWeight: selectedFinishFilter === f.id ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid de Produtos */}
      <div className="grid-3">
        {visibleProducts.map(prod => {
          // Apenas produtos prontos do catálogo da categoria Bottons (não-personalizáveis) usam a exibição 3D de rotação frente/verso
          const isCatalogBotton3D = !prod.is_customizable && (
            prod.category_id === 'cat-bottons-001' || 
            (prod.name && prod.name.toLowerCase().includes('botton') && prod.category_id !== 'cat-custom-002')
          );

          return (
            <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Renderização de Imagem ou Mockup de Botton (Frente/Verso para Catálogo Pronto) */}
                <div 
                  onClick={() => {
                    if (prod.is_customizable && !isModo24h) {
                      onCustomizeClick && onCustomizeClick(prod);
                    } else if (onSelectProduct) {
                      onSelectProduct(prod);
                    }
                  }}
                  style={{ cursor: 'pointer', marginBottom: '16px' }}
                  title={prod.is_customizable ? "Clique para personalizar com sua foto" : "Clique para escolher tamanho e acabamento"}
                >
                  {isCatalogBotton3D ? (
                    <BottonMockupDisplay 
                      imageUrl={prod.image_url} 
                      productName={prod.name} 
                      finishType={prod.finish_type || 'alfinete'}
                      size="card" 
                      showToggle={true} 
                    />
                  ) : (
                    <div style={{
                      height: '200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'%3ESem Imagem%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}
                </div>

                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                  {prod.is_customizable ? 'Modelo Personalizável' : 'Pronta Entrega'}
                </span>

                <h3 
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0f172a', cursor: 'pointer' }}
                  title="Clique para escolher tamanho e acabamento"
                >
                  {prod.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {prod.description}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '14px' }}>
                  R$ {parseFloat(prod.base_price).toFixed(2)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {prod.is_customizable && !isModo24h ? (
                    <button className="btn btn-primary" onClick={() => onCustomizeClick && onCustomizeClick(prod)} style={{ width: '100%' }}>
                      <Sparkles size={16} /> Personalize com uma imagem
                    </button>
                  ) : (prod.stock_quantity !== undefined && prod.stock_quantity !== null && (parseInt(prod.stock_quantity) <= 0 || parseInt(prod.stock_quantity) <= parseInt(prod.max_limit_per_order || 0))) ? (
                    <button
                      className="btn btn-outline"
                      disabled
                      style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed', background: '#f1f5f9', color: '#94a3b8' }}
                    >
                      Indisponível no momento
                    </button>
                  ) : isCatalogBotton3D ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => onSelectProduct && onSelectProduct(prod)}
                      style={{ width: '100%' }}
                    >
                      <ShoppingCart size={18} /> Escolher Tamanho & Opções
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline"
                      onClick={() => onAddToCart({
                        product_id: prod.id,
                        name: prod.name,
                        quantity: 1,
                        unit_price: parseFloat(prod.base_price),
                        total_price: parseFloat(prod.base_price),
                        diameter: '38mm',
                        finish_type: 'alfinete'
                      })}
                      style={{ width: '100%' }}
                    >
                      <ShoppingCart size={18} /> Adicionar ao Carrinho
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

