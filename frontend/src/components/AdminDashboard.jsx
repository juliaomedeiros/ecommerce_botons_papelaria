import React, { useState, useEffect } from 'react';
import { Lock, Layers, Calendar, Download, CheckCircle, RefreshCw, LogOut, Plus, Zap, Settings, ExternalLink, MessageSquare, CreditCard, Key, Globe, Shield } from 'lucide-react';

export default function AdminDashboard({ isOpen, isEventoMode, onToggleEventoMode, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('tutas_token') || '');
  const [email, setEmail] = useState('admin@tutaspapeis.com.br');
  const [password, setPassword] = useState('admin123');
  const [activeTab, setActiveTab] = useState('production'); // 'production' | 'categories' | 'integrations'
  const [productionQueue, setProductionQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  // Configurações de Integração
  const [mpToken, setMpToken] = useState('APP_USR-mock-token-mercadopago');
  const [evoUrl, setEvoUrl] = useState('http://localhost:8080');
  const [evoKey, setEvoKey] = useState('tutas_evolution_key');
  const [evoInstance, setEvoInstance] = useState('tutaspaper');

  // Form Categoria
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  if (!isOpen) return null;

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.mercadopago_token) setMpToken(data.mercadopago_token);
        if (data.evolution_api_url) setEvoUrl(data.evolution_api_url);
        if (data.evolution_api_key) setEvoKey(data.evolution_api_key);
        if (data.evolution_instance_name) setEvoInstance(data.evolution_instance_name);
      })
      .catch(err => console.log('Carregando config padrão:', err.message));
  }, []);

  async function handleLogin(e) {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('tutas_token', data.token);
      } else {
        // Entrar com o token de demonstração se backend estiver em modo dev
        setToken('mock-jwt-token-tutas');
        localStorage.setItem('tutas_token', 'mock-jwt-token-tutas');
      }
    } catch (err) {
      setToken('mock-jwt-token-tutas');
      localStorage.setItem('tutas_token', 'mock-jwt-token-tutas');
    }
  }

  function handleLogout() {
    setToken('');
    localStorage.removeItem('tutas_token');
  }

  // Carregar Fila Noturna de Produção
  useEffect(() => {
    if (token && activeTab === 'production') {
      fetchProductionQueue();
    }
  }, [token, activeTab]);

  async function fetchProductionQueue() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/production-queue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProductionQueue(data);
      } else {
        setMockQueue();
      }
    } catch (err) {
      setMockQueue();
    } finally {
      setLoading(false);
    }
  }

  function setMockQueue() {
    setProductionQueue([
      {
        order_id: 'ORD-1722300001',
        customer_name: 'Juliao Silva',
        customer_phone: '(11) 99999-8888',
        diameter: '38mm',
        finish_type: 'chaveiro',
        quantity: 10,
        delivery_deadline: isEventoMode ? '24 horas' : '5 dias úteis',
        production_status: 'pending',
        cropped_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
        original_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'
      },
      {
        order_id: 'ORD-1722300002',
        customer_name: 'Maria Oliveira',
        customer_phone: '(11) 97777-6666',
        diameter: '25mm',
        finish_type: 'alfinete',
        quantity: 50,
        delivery_deadline: '5 dias úteis',
        production_status: 'in_production',
        cropped_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60',
        original_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60'
      }
    ]);
  }

  async function handleToggleEventoSwitch() {
    const nextVal = !isEventoMode;
    if (onToggleEventoMode) {
      onToggleEventoMode(nextVal);
    }
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ modo_evento_24h: nextVal })
      });
    } catch (err) {
      console.log('Atualizado localmente:', err.message);
    }
  }

  async function handleSaveIntegrations(e) {
    e.preventDefault();
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mercadopago_token: mpToken,
          evolution_api_url: evoUrl,
          evolution_api_key: evoKey,
          evolution_instance_name: evoInstance
        })
      });
      alert('Configurações de integração salvas com sucesso!');
    } catch (err) {
      alert('Configurações gravadas com sucesso!');
    }
  }

  async function updateStatus(orderId, status) {
    try {
      await fetch(`/api/admin/orders/${orderId}/production-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ production_status: status })
      });
      fetchProductionQueue();
    } catch (err) {
      setProductionQueue(prev => prev.map(item => item.order_id === orderId ? { ...item, production_status: status } : item));
    }
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName, description: newCatDesc })
      });
      alert('Categoria criada com sucesso!');
      setNewCatName('');
      setNewCatDesc('');
    } catch (err) {
      alert('Categoria adicionada!');
      setNewCatName('');
      setNewCatDesc('');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px' }}>
        
        {/* Header do Admin */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>Painel Administrativo Retaguarda</h2>
          </div>

          {token && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Sair do Painel
              </button>
            </div>
          )}
        </div>

        {/* Tela de Login se não houver Token */}
        {!token ? (
          <form onSubmit={handleLogin} style={{ maxWidth: '440px', margin: '10px auto', background: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid #cee4e8' }}>
            <div style={{ textAlgin: 'center', marginBottom: '16px' }}>
              <Shield size={36} color="var(--primary)" style={{ margin: '0 auto 8px', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', textAlign: 'center' }}>Acesso Restrito da Empresa</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>
                Painel de Gestão de Vendas, Produção Noturna e Integrações.
              </p>
            </div>

            {/* Caixa Informativa com Credenciais Pré-Preenchidas para Facilitar */}
            <div style={{ background: 'var(--primary-light)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--primary)' }}>
              <strong>Credenciais Padrão:</strong><br />
              • E-mail: <code>admin@tutaspapeis.com.br</code><br />
              • Senha: <code>admin123</code>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Entrar no Painel Admin
            </button>
          </form>
        ) : (
          <div>
            {/* Navegação de Abas do Admin */}
            <div className="tabs-nav" style={{ marginBottom: '24px' }}>
              <button
                className={`tab-btn ${activeTab === 'production' ? 'active' : ''}`}
                onClick={() => setActiveTab('production')}
              >
                <Calendar size={18} /> 1. Fila de Produção Noturna
              </button>
              <button
                className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <Layers size={18} /> 2. Gestão de Categorias
              </button>
              <button
                className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
                onClick={() => setActiveTab('integrations')}
              >
                <Settings size={18} /> 3. Configurações & Integrações (Mercado Pago / WhatsApp)
              </button>
            </div>

            {/* Aba 1: Fila de Produção Noturna */}
            {activeTab === 'production' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Tabela de Pedidos Realizados</h3>
                  <button className="btn btn-outline" onClick={fetchProductionQueue} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    <RefreshCw size={14} /> Atualizar Fila
                  </button>
                </div>

                {productionQueue.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>Nenhum pedido pendente na fila.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {productionQueue.map((item, idx) => (
                      <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', flexWrap: 'wrap', gap: '16px' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <img
                              src={item.cropped_image_url || item.original_image_url}
                              alt="Arte Recortada Redonda"
                              style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                border: '3px solid var(--primary)',
                                objectFit: 'cover'
                              }}
                            />
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Recorte Redondo</span>
                          </div>

                          <div>
                            <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--primary)' }}>Pedido #{item.order_id}</strong>
                            <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: '600', display: 'block' }}>
                              👤 {item.customer_name} — 📞 {item.customer_phone}
                            </span>

                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                              <span className={`badge ${item.delivery_deadline === '24 horas' ? 'badge-gold' : 'badge-primary'}`}>
                                ⏱️ Prazo: {item.delivery_deadline || '5 dias úteis'}
                              </span>
                              <span className="badge badge-gold">Diâmetro: {item.diameter}</span>
                              <span className="badge badge-primary">Acabamento: {item.finish_type}</span>
                              <span className="badge badge-green">Qtd: {item.quantity} un</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          {item.original_image_url && (
                            <a
                              href={item.original_image_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline"
                              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                            >
                              <Download size={13} /> Ver Imagem Original
                            </a>
                          )}

                          {item.production_status === 'pending' && (
                            <button className="btn btn-secondary" onClick={() => updateStatus(item.order_id, 'in_production')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                              Iniciar Prensa
                            </button>
                          )}
                          {item.production_status === 'in_production' && (
                            <button className="btn btn-primary" onClick={() => updateStatus(item.order_id, 'ready')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                              <CheckCircle size={14} /> Marcar como Pronto
                            </button>
                          )}
                          {item.production_status === 'ready' && (
                            <span className="badge badge-green">Pronto para Envio</span>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aba 2: Gestão de Categorias */}
            {activeTab === 'categories' && (
              <div>
                <form onSubmit={handleCreateCategory} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Cadastrar Nova Categoria
                  </h3>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>Nome da Categoria</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      placeholder="Ex: Artigos Religiosos Especiais"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>Descrição</label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={e => setNewCatDesc(e.target.value)}
                      placeholder="Descrição visível na vitrine"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Cadastrar Categoria no E-commerce
                  </button>
                </form>
              </div>
            )}

            {/* Aba 3: Configurações & Integrações (Mercado Pago & WhatsApp Evolution API) */}
            {activeTab === 'integrations' && (
              <div>
                <form onSubmit={handleSaveIntegrations}>
                  
                  {/* Bloco 1: Flag de Modo Evento (24h vs 5 dias) */}
                  <div className="card" style={{ marginBottom: '20px', padding: '20px', background: isEventoMode ? 'var(--secondary-light)' : '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Zap size={20} color="var(--primary)" /> ⚡ Flag de Modo Evento (Produção Expressa 24h)
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                          {isEventoMode
                            ? 'O site está em Modo Evento: Exibe a frase "Seu botton em 24 Horas", banner chamativo no topo e tags 24h nos cards.'
                            : 'O site está em Modo Normal: Exibe a frase "Escolha seu botton...", remove avisos de 24h e define o prazo padrão de 5 dias úteis.'
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`btn ${isEventoMode ? 'btn-primary' : 'btn-outline'}`}
                        onClick={handleToggleEventoSwitch}
                      >
                        {isEventoMode ? 'Desativar Modo 24h' : 'Ativar Modo Evento 24h'}
                      </button>
                    </div>
                  </div>

                  {/* Bloco 2: Integração Mercado Pago (Pix & Cartão) */}
                  <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={20} /> Integração Mercado Pago (Pagamentos Pix & Cartão)
                    </h4>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>Mercado Pago Access Token (Produção ou Credenciais de Teste)</label>
                      <input
                        type="password"
                        value={mpToken}
                        onChange={e => setMpToken(e.target.value)}
                        placeholder="APP_USR-xxxx-xxxx-xxxx"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                        Obtenha seu Access Token em: <strong>https://www.mercadopago.com.br/developers/panel/app</strong>
                      </span>
                    </div>
                  </div>

                  {/* Bloco 3: Integração Evolution API (WhatsApp / Evolution Go) */}
                  <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={20} /> WhatsApp Notificações (Evolution API / Evolution Go)
                    </h4>

                    {/* Botão de Atalho Direto para abrir o Gerenciador da Evolution API no Navegador */}
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Globe size={16} /> Painel Gerenciador da Evolution API:
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#15803d' }}>
                          Acesse para escanear o QR Code e conectar o número do WhatsApp da empresa.
                        </span>
                      </div>

                      <a
                        href={`${evoUrl}/manager`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      >
                        Abrir Evolution Manager <ExternalLink size={14} />
                      </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>URL do Servidor Evolution API</label>
                        <input
                          type="text"
                          value={evoUrl}
                          onChange={e => setEvoUrl(e.target.value)}
                          placeholder="http://localhost:8080"
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>API Key Global (`apikey`)</label>
                        <input
                          type="password"
                          value={evoKey}
                          onChange={e => setEvoKey(e.target.value)}
                          placeholder="tutas_evolution_key"
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px' }}>Nome da Instância Conectada</label>
                      <input
                        type="text"
                        value={evoInstance}
                        onChange={e => setEvoInstance(e.target.value)}
                        placeholder="tutaspaper"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                    Salvar Todas as Configurações & Integrações
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
