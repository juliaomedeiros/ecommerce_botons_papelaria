import React, { useState } from 'react';
import { X, ShoppingCart, Sparkles, Check, Info } from 'lucide-react';
import BottonMockupDisplay from './BottonMockupDisplay';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onCustomizeClick, isModo24h }) {
  if (!isOpen || !product) return null;

  const [diameter, setDiameter] = useState('38mm');
  const [finishType, setFinishType] = useState('alfinete');
  const [quantity, setQuantity] = useState(1);

  // Localizar a variação exata correspondente (Diâmetro x Acabamento)
  const matchedVar = Array.isArray(product.variations) ? product.variations.find(
    v => v.diameter === diameter && v.finish_type === finishType
  ) : null;

  const unitPrice = matchedVar && matchedVar.price_override ? parseFloat(matchedVar.price_override) : parseFloat(product.base_price || 5.00);
  const totalPrice = unitPrice * quantity;
  const currentStock = matchedVar !== null && matchedVar !== undefined ? parseInt(matchedVar.stock_quantity) : parseInt(product.stock_quantity || 0);

  function handleAdd() {
    onAddToCart({
      product_id: product.id,
      variation_id: matchedVar ? matchedVar.id : null,
      name: product.name,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      diameter,
      finish_type: finishType,
      image_url: product.image_url
    });
    onClose();
  }

  const isBottonCategory = product.category_id === 'cat-bottons-001' || 
    (product.name && product.name.toLowerCase().includes('botton') && !product.is_customizable) || 
    (product.category_name && product.category_name.toLowerCase().includes('botton') && !product.is_customizable);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        {/* Header do Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>
            {product.is_customizable ? 'Modelo Personalizável' : 'Pronta Entrega'}
          </span>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          {/* Imagem Ampliada / Mockup 3D do Produto */}
          <div>
            {isBottonCategory ? (
              <div style={{ marginBottom: '12px' }}>
                <BottonMockupDisplay
                  imageUrl={product.image_url}
                  productName={product.name}
                  finishType={finishType}
                  size="modal"
                  showToggle={true}
                />
              </div>
            ) : (
              <div style={{
                height: '260px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#f1f5f9',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px'
              }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'; }}
                />
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
              <Info size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Prensa de metal com película protetora de acetato brilhante de alta durabilidade.
            </p>
          </div>

          {/* Detalhes & Configurações */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px', lineHeight: '1.3' }}>
                {product.name}
              </h2>

              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '16px' }}>
                {product.description}
              </p>

              {/* Opções de Diâmetro */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Diâmetro do Botton:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['25mm', '38mm'].map(size => (
                    <button
                      key={size}
                      type="button"
                      className={`btn ${diameter === size ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setDiameter(size)}
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      {diameter === size && <Check size={14} />} {size} {size === '25mm' ? '(Pequeno)' : '(Padrão)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opções de Acabamento */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Acabamento Verso:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'alfinete', label: 'Alfinete' },
                    { id: 'chaveiro', label: 'Chaveiro' },
                    { id: 'ima', label: 'Ímã de Geladeira' }
                  ].map(finish => (
                    <button
                      key={finish.id}
                      type="button"
                      className={`btn ${finishType === finish.id ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setFinishType(finish.id)}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      {finishType === finish.id && <Check size={12} />} {finish.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Quantidade */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    Quantidade:
                  </label>
                  {product.max_limit_per_order && (
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      (Máx. {product.max_limit_per_order} un. por compra)
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '4px 12px', fontSize: '1.1rem' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      const maxLimit = product.max_limit_per_order || 100;
                      if (quantity < maxLimit) setQuantity(quantity + 1);
                    }}
                    style={{ padding: '4px 12px', fontSize: '1.1rem' }}
                    disabled={product.max_limit_per_order ? quantity >= product.max_limit_per_order : false}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total e Ações */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Preço Total:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.is_customizable && !isModo24h ? (
                  <button className="btn btn-primary" onClick={onCustomizeClick} style={{ width: '100%' }}>
                    <Sparkles size={16} /> Personalize com uma imagem
                  </button>
                ) : (currentStock <= 0 || currentStock <= parseInt(product.max_limit_per_order || 0)) ? (
                  <button className="btn btn-outline" disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed', background: '#fee2e2', color: '#991b1b', fontWeight: 'bold' }}>
                    🚫 Combinação Esgotada no Momento
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleAdd} style={{ width: '100%' }}>
                    <ShoppingCart size={18} /> Adicionar ao Carrinho
                  </button>
                )}

                <button className="btn btn-outline" onClick={onClose} style={{ width: '100%' }}>
                  Continuar Comprando
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
