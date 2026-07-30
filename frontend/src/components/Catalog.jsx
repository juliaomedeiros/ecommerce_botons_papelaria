import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag, Filter, Sparkles } from 'lucide-react';

export default function Catalog({ isEventoMode, onAddToCart, onCustomizeClick }) {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialCategories = [
      { id: 'all', name: 'Todos os Produtos' },
      { id: 'cat-bottons-001', name: 'Bottons, Chaveiros & Ímãs' },
      { id: 'cat-religiosos-002', name: 'Artigos Religiosos' },
      { id: 'cat-papelaria-003', name: 'Materiais de Papelaria' }
    ];
    setCategories(initialCategories);

    const initialProducts = [
      {
        id: 'prod-fastfood-001',
        category_id: 'cat-bottons-001',
        name: 'Botton / Chaveiro / Ímã Personalizado com sua Foto',
        description: 'Monte com sua própria foto ou arte com prévia circular ao vivo nos diâmetros 25mm e 38mm.',
        base_price: 5.00,
        is_customizable: true,
        image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'
      },
      {
        id: 'prod-terco-002',
        category_id: 'cat-religiosos-002',
        name: 'Terço de Madeira Nobre com Crucifixo',
        description: 'Terço artesanal feito em madeira nobre com acabamento reforçado.',
        base_price: 25.00,
        is_customizable: false,
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60'
      },
      {
        id: 'prod-caderno-003',
        category_id: 'cat-papelaria-003',
        name: 'Caderno Espiral A5 Capa Dura Tuta\'s Paper',
        description: 'Caderno universitário 100 folhas pautadas com papel de alta gramatura.',
        base_price: 18.90,
        is_customizable: false,
        image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60'
      }
    ];

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(initialProducts);
        }
      })
      .catch(() => setProducts(initialProducts))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = selectedCat === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCat);

  return (
    <div>
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
        {filteredProducts.map(prod => (
          <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                height: '200px',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'; }}
                />
              </div>

              {/* Tag condicional baseada na Flag Modo Evento (RN-05) */}
              {isEventoMode && prod.is_customizable ? (
                <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
                  ⚡ Personalizável em 24h
                </span>
              ) : (
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                  {prod.is_customizable ? 'Modelo Personalizável' : 'Pronta Entrega'}
                </span>
              )}

              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0f172a' }}>
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

              {prod.is_customizable ? (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
