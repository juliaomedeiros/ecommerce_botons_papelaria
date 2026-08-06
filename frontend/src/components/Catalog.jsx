import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag, Filter, Sparkles, AlertCircle, Eye } from 'lucide-react';

export default function Catalog({ isEventoMode, isModo24h, onAddToCart, onCustomizeClick, onSelectProduct }) {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Grid de Produtos */}
      <div className="grid-3">
        {visibleProducts.map(prod => (
          <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div 
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                style={{
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Clique para ver detalhes do produto"
              >
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'; }}
                />
              </div>

              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                {prod.is_customizable ? 'Modelo Personalizável' : 'Pronta Entrega'}
              </span>

              <h3 
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0f172a', cursor: 'pointer' }}
                title="Clique para ver detalhes do produto"
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
                  <button className="btn btn-primary" onClick={onCustomizeClick} style={{ width: '100%' }}>
                    <Sparkles size={16} /> Personalize com uma imagem
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

                <button
                  className="btn btn-outline"
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                >
                  <Eye size={16} /> Ver Detalhes & Opções
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

