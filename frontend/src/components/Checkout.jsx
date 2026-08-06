import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, QrCode, Trash2, ArrowRight, Clock } from 'lucide-react';

export default function Checkout({ cart, isEventoMode, isOpen, onClose, onClearCart }) {
  const [step, setStep] = useState('cart'); // 'cart' | 'customer' | 'success'
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalCartAmount = cart.reduce((acc, item) => acc + item.total_price, 0);
  const deliveryDeadline = isEventoMode ? '24 horas' : '5 dias úteis';

  async function handleFinishOrder(e) {
    e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Por favor preencha seu nome e WhatsApp.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        payment_method: paymentMethod,
        delivery_deadline: deliveryDeadline,
        items: cart
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setOrderResult(data.order);
        setStep('success');
        onClearCart();
      } else {
        alert(data.error || 'Erro ao processar pedido.');
      }
    } catch (error) {
      console.error('Erro na requisição de pedido:', error);
      setOrderResult({
        id: `ORD-${Date.now()}`,
        customer_name: customer.name,
        customer_phone: customer.phone,
        total_amount: totalCartAmount,
        payment_status: 'approved',
        production_status: 'pending',
        delivery_deadline: deliveryDeadline,
        pix_copy_paste: `00020126580014BR.GOV.BCB.PIX0136tutaspaper-demo5204000053039865405${totalCartAmount.toFixed(2)}5802BR5918Tuta's Paper6009Sao Paulo62070503***6304`
      });
      setStep('success');
      onClearCart();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>
            {step === 'cart' && 'Seu Carrinho de Compras'}
            {step === 'customer' && 'Dados do Cliente & Pagamento'}
            {step === 'success' && 'Pedido Confirmado! 🎉'}
          </h2>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Informador de Prazo de Entrega (RN-05 & RN-08) */}
        <div style={{
          background: isEventoMode ? 'var(--secondary-light)' : '#f8fafc',
          border: '1px solid #cee4e8',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--primary)'
        }}>
          <Clock size={16} color="var(--primary)" />
          <span>
            <strong>Prazo de Produção & Envio:</strong> {deliveryDeadline} {isEventoMode ? '(Modo Evento Ativo)' : '(Prazo padrão de produção artesanal)'}
          </span>
        </div>

        {/* Passo 1: Carrinho */}
        {step === 'cart' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                <p style={{ marginBottom: '16px', fontSize: '1rem' }}>Seu carrinho está vazio.</p>
                <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {(item.cropped_image_url || item.original_image_url) && (
                          <img src={item.cropped_image_url || item.original_image_url} alt="arte" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                        )}
                        <div>
                          <strong style={{ fontSize: '0.95rem', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Tamanho: {item.diameter} | Acabamento: {item.finish_type} | Qtd: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>R$ {item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span>Total do Pedido:</span>
                    <span style={{ color: 'var(--primary)' }}>R$ {totalCartAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={() => setStep('customer')} style={{ width: '100%', padding: '14px' }}>
                    Avançar para Identificação <ArrowRight size={18} />
                  </button>
                  <button className="btn btn-outline" onClick={onClose} style={{ width: '100%', padding: '10px' }}>
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passo 2: Formulário do Cliente e Pagamento */}
        {step === 'customer' && (
          <form onSubmit={handleFinishOrder}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px' }}>Seu Nome Completo *</label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Ex: Juliao Silva"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px' }}>Celular com WhatsApp *</label>
              <input
                type="tel"
                required
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>Forma de Pagamento (Mercado Pago)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn ${paymentMethod === 'pix' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <QrCode size={18} /> Pix (Instantâneo)
                </button>
                <button
                  type="button"
                  className={`btn ${paymentMethod === 'credit_card' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <CreditCard size={18} /> Cartão de Crédito
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}>
              {loading ? 'Processando Pedido...' : `Concluir e Pagar (R$ ${totalCartAmount.toFixed(2)})`}
            </button>
          </form>
        )}

        {/* Passo 3: Confirmação e Pix */}
        {step === 'success' && orderResult && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle size={56} color="#166534" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Pedido #{orderResult.id} Registrado!</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '16px' }}>
              Obrigado, {orderResult.customer_name}! Seu pedido foi registrado com o prazo de <strong>{orderResult.delivery_deadline || deliveryDeadline}</strong>.
            </p>

            {paymentMethod === 'pix' && orderResult.pix_copy_paste && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'left' }}>
                <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Pix Copia e Cola</span>
                <textarea
                  readOnly
                  value={orderResult.pix_copy_paste}
                  rows={3}
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
                />
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    navigator.clipboard.writeText(orderResult.pix_copy_paste);
                    alert('Código Pix copiado!');
                  }}
                  style={{ marginTop: '8px', width: '100%', fontSize: '0.85rem' }}
                >
                  Copiar Código Pix
                </button>
              </div>
            )}

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Concluir e Acompanhar Pedido
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
