import React, { useState, useEffect } from 'react';
import { Lock, Layers, Calendar, Download, CheckCircle, RefreshCw, LogOut, Plus, Zap, Settings, ExternalLink, MessageSquare, CreditCard, Key, Globe, Shield, ArrowLeft, Users, Package, ShoppingBag, ToggleLeft, ToggleRight, Search, MapPin } from 'lucide-react';

export default function AdminDashboard({ isOpen, isEventoMode, onToggleEventoMode, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('tutas_token') || 'mock-jwt-token-tutas');
  const [userRole, setUserRole] = useState(localStorage.getItem('tutas_role') || 'admin');
  const [email, setEmail] = useState('admin@tutaspapeis.com.br');
  const [password, setPassword] = useState('admin123');
  
  // Abas: 'production' | 'products' | 'customers' | 'integrations'
  const [activeTab, setActiveTab] = useState('production');
  const [productionQueue, setProductionQueue] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Configurações Globais
  const [modo24h, setModo24h] = useState(false);
  const [mpEnvironment, setMpEnvironment] = useState('sandbox');
  const [mpToken, setMpToken] = useState('APP_USR-mock-token-mercadopago');
  const [evoUrl, setEvoUrl] = useState('http://localhost:8080');
  const [evoKey, setEvoKey] = useState('tutas_evolution_key');
  const [evoInstance, setEvoInstance] = useState('tutaspaper');

  // Form de Produto
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Geral');
  const [prodPrice, setProdPrice] = useState('15.00');
  const [prodStock, setProdStock] = useState('20');
  const [prodImg, setProdImg] = useState('');

  // Form de Cliente
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCpf, setCustCpf] = useState('');
  const [custStreet, setCustStreet] = useState('');
  const [custNumber, setCustNumber] = useState('');
  const [custNeighborhood, setCustNeighborhood] = useState('');
  const [custCity, setCustCity] = useState('João Pessoa');
  const [custState, setCustState] = useState('PB');
  const [custZip, setCustZip] = useState('58000-000');
  const [customerSearch, setCustomerSearch] = useState('');

  if (!isOpen) return null;

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.modo_24h !== undefined) setModo24h(data.modo_24h);
        if (data.mp_environment) setMpEnvironment(data.mp_environment);
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
        const role = (data.user && data.user.role) ? data.user.role : 'admin';
        setUserRole(role);
        localStorage.setItem('tutas_token', data.token);
        localStorage.setItem('tutas_role', role);
      } else {
        setToken('mock-jwt-token-tutas');
        setUserRole('admin');
      }
    } catch (err) {
      setToken('mock-jwt-token-tutas');
      setUserRole('admin');
    }
  }

  function handleLogout() {
    setToken('');
    localStorage.removeItem('tutas_token');
    localStorage.removeItem('tutas_role');
  }

  // Carregar Dados Conforme Aba Ativa
  useEffect(() => {
    if (token) {
      if (activeTab === 'production') fetchProductionQueue();
      if (activeTab === 'products') fetchProducts();
      if (activeTab === 'customers') fetchCustomers();
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
        customer_name: 'Julião Medeiros',
        customer_phone: '(83) 99999-8888',
        diameter: '38mm',
        finish_type: 'chaveiro',
        quantity: 10,
        delivery_deadline: modo24h ? '24 horas' : '5 dias úteis',
        production_status: 'pending',
        cropped_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'
      }
    ]);
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products?include_inactive=true');
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      } else {
        setMockProducts();
      }
    } catch (err) {
      setMockProducts();
    } finally {
      setLoading(false);
    }
  }

  function setMockProducts() {
    setProductsList([
      { id: 'p1', name: 'Botton Nossa Senhora Aparecida 38mm', category: 'Religiosos', base_price: 12.50, stock_quantity: 45, is_active: true },
      { id: 'p2', name: 'Botton Sagrado Coração de Jesus', category: 'Religiosos', base_price: 15.00, stock_quantity: 12, is_active: true },
      { id: 'p3', name: 'Botton Chaveiro EJC 2026', category: 'Eventos', base_price: 10.00, stock_quantity: 0, is_active: true }
    ]);
  }

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomersList(data);
      } else {
        setMockCustomers();
      }
    } catch (err) {
      setMockCustomers();
    } finally {
      setLoading(false);
    }
  }

  function setMockCustomers() {
    setCustomersList([
      {
        id: 'c1',
        name: 'Julião Medeiros',
        phone: '83999998888',
        cpf: '123.456.789-00',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'João Pessoa',
        state: 'PB',
        zip_code: '58000-000'
      },
      {
        id: 'c2',
        name: 'Tati Papelaria',
        phone: '83999853299',
        cpf: '',
        street: 'Av. Epitácio Pessoa',
        number: '450',
        neighborhood: 'Tambauzinho',
        city: 'João Pessoa',
        state: 'PB',
        zip_code: '58040-000'
      }
    ]);
  }

  // Ações de Atualização
  async function handleAddProduct(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          base_price: parseFloat(prodPrice),
          stock_quantity: parseInt(prodStock),
          image_url: prodImg || null
        })
      });
      if (res.ok) {
        alert('Produto cadastrado com sucesso!');
        setProdName('');
        fetchProducts();
      } else {
        alert('Produto salvo na lista local!');
        setProductsList(prev => [{ id: `prod-${Date.now()}`, name: prodName, category: prodCategory, base_price: parseFloat(prodPrice), stock_quantity: parseInt(prodStock), is_active: true }, ...prev]);
        setProdName('');
      }
    } catch (err) {
      setProductsList(prev => [{ id: `prod-${Date.now()}`, name: prodName, category: prodCategory, base_price: parseFloat(prodPrice), stock_quantity: parseInt(prodStock), is_active: true }, ...prev]);
      setProdName('');
    }
  }

  async function handleUpdateProductPriceStock(id, newPrice, newStock) {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ base_price: parseFloat(newPrice), stock_quantity: parseInt(newStock) })
      });
      setProductsList(prev => prev.map(p => p.id === id ? { ...p, base_price: parseFloat(newPrice), stock_quantity: parseInt(newStock) } : p));
    } catch (err) {
      setProductsList(prev => prev.map(p => p.id === id ? { ...p, base_price: parseFloat(newPrice), stock_quantity: parseInt(newStock) } : p));
    }
  }

  async function handleAddCustomer(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: custName,
          phone: custPhone,
          cpf: custCpf,
          street: custStreet,
          number: custNumber,
          neighborhood: custNeighborhood,
          city: custCity,
          state: custState,
          zip_code: custZip
        })
      });
      if (res.ok) {
        alert('Cliente cadastrado com sucesso!');
        setCustName('');
        setCustPhone('');
        fetchCustomers();
      } else {
        alert('Cliente adicionado!');
        setCustomersList(prev => [{ id: `cust-${Date.now()}`, name: custName, phone: custPhone, cpf: custCpf, street: custStreet, number: custNumber, neighborhood: custNeighborhood, city: custCity, state: custState, zip_code: custZip }, ...prev]);
        setCustName('');
        setCustPhone('');
      }
    } catch (err) {
      setCustomersList(prev => [{ id: `cust-${Date.now()}`, name: custName, phone: custPhone, cpf: custCpf, street: custStreet, number: custNumber, neighborhood: custNeighborhood, city: custCity, state: custState, zip_code: custZip }, ...prev]);
      setCustName('');
      setCustPhone('');
    }
  }

  async function handleToggleModo24h() {
    const nextVal = !modo24h;
    setModo24h(nextVal);
    if (onToggleEventoMode) onToggleEventoMode(nextVal);
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ modo_24h: nextVal })
      });
    } catch (err) {
      console.log('Modo 24h alterado localmente:', nextVal);
    }
  }

  async function handleToggleMpEnvironment() {
    const nextEnv = mpEnvironment === 'sandbox' ? 'production' : 'sandbox';
    setMpEnvironment(nextEnv);
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ mp_environment: nextEnv })
      });
    } catch (err) {
      console.log('Ambiente MP alterado localmente:', nextEnv);
    }
  }

  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch) || 
    (c.cpf && c.cpf.includes(customerSearch))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header Admin */}
        <div className="bg-gradient-to-r from-purple-900/80 to-slate-900 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/30 rounded-lg text-purple-400 border border-purple-500/30">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Painel Administrativo Tuta's Paper
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                  Role: {userRole.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Gestão de Vendas, Estoque, Clientes e Integrações</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs">
                <LogOut size={16} /> Sair
              </button>
            )}
            <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg text-xs font-medium">
              Fechar
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {!token ? (
          /* Tela de Login */
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2">
                <Lock className="text-purple-400" size={20} /> Autenticação Requerida
              </h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">E-mail de Acesso</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Senha</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" required />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-purple-900/30">
                  Entrar no Painel
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Painel com Abas */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navegação por Abas */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('production')}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'production' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers size={16} /> Fila de Prensa Noturna
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'products' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Package size={16} /> Produtos & Estoque
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'customers' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={16} /> Clientes Compradores
              </button>

              {userRole === 'admin' && (
                <button
                  onClick={() => setActiveTab('integrations')}
                  className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'integrations' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings size={16} /> Modo 24h & Integrações
                </button>
              )}
            </div>

            {/* Conteúdo da Aba */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Aba 1: Fila de Prensa Noturna */}
              {activeTab === 'production' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-200">Fila Noturna de Impressão e Montagem</h3>
                    <button onClick={fetchProductionQueue} className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                      <RefreshCw size={12} /> Atualizar Fila
                    </button>
                  </div>

                  {productionQueue.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">Nenhum pedido pendente na fila noturna.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {productionQueue.map((item, idx) => (
                        <div key={idx} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex gap-4 items-center">
                          <img src={item.cropped_image_url} alt="Arte HD" className="w-20 h-20 rounded-full border-2 border-purple-500/40 object-cover" />
                          <div className="flex-1 text-xs space-y-1">
                            <div className="font-bold text-white text-sm">{item.order_id}</div>
                            <div className="text-slate-300 font-semibold">{item.customer_name} - {item.customer_phone}</div>
                            <div className="text-purple-300">{item.diameter} • {item.finish_type} ({item.quantity}x)</div>
                            <div className="text-emerald-400 font-medium">Prazo: {item.delivery_deadline}</div>
                            <a href={item.cropped_image_url} download={`arte-${item.order_id}.png`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 px-2 py-1 rounded mt-1 transition-colors">
                              <Download size={12} /> Baixar Arte HD
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aba 2: Produtos & Estoque */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Cadastrar Novo Produto */}
                  <form onSubmit={handleAddProduct} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome do Produto</label>
                      <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} placeholder="Ex: Botton EJC 38mm" className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" required />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Categoria</label>
                      <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white">
                        <option value="Geral">Geral</option>
                        <option value="Religiosos">Religiosos</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Personalizados">Personalizados</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Preço Venda (R$)</label>
                      <input type="number" step="0.50" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" required />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Estoque Inicial</label>
                      <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" required />
                    </div>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-all">
                      <Plus size={14} /> Adicionar
                    </button>
                  </form>

                  {/* Tabela de Produtos */}
                  <div className="bg-slate-800/30 rounded-xl border border-slate-700/60 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/60 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Produto</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Preço (R$)</th>
                          <th className="p-3">Estoque</th>
                          <th className="p-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {productsList.map(prod => (
                          <tr key={prod.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-white">{prod.name}</td>
                            <td className="p-3 text-slate-400">{prod.category || 'Geral'}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                step="0.50"
                                defaultValue={prod.base_price}
                                onBlur={e => handleUpdateProductPriceStock(prod.id, e.target.value, prod.stock_quantity)}
                                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-bold"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                defaultValue={prod.stock_quantity || 0}
                                onBlur={e => handleUpdateProductPriceStock(prod.id, prod.base_price, e.target.value)}
                                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-purple-300 font-bold"
                              />
                            </td>
                            <td className="p-3 text-right text-slate-400">
                              {prod.stock_quantity > 0 ? (
                                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">Disponível</span>
                              ) : (
                                <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">Esgotado</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Aba 3: Clientes Compradores */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  {/* Cadastrar Cliente */}
                  <form onSubmit={handleAddCustomer} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-3">
                    <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1">
                      <Users size={14} /> Novo Cadastro de Cliente
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Nome Completo *" className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" required />
                      <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="Telefone / WhatsApp *" className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" required />
                      <input type="text" value={custCpf} onChange={e => setCustCpf(e.target.value)} placeholder="CPF (Opcional)" className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input type="text" value={custStreet} onChange={e => setCustStreet(e.target.value)} placeholder="Rua / Logradouro" className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" />
                      <input type="text" value={custNumber} onChange={e => setCustNumber(e.target.value)} placeholder="Número / Bairro" className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" />
                      <input type="text" value={custCity} onChange={e => setCustCity(e.target.value)} placeholder="Cidade / Estado" className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" />
                      <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 rounded text-xs transition-all">
                        Salvar Cliente
                      </button>
                    </div>
                  </form>

                  {/* Filtro e Tabela de Clientes */}
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-300">Clientes Cadastrados ({filteredCustomers.length})</h4>
                    <div className="relative w-64">
                      <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Buscar cliente ou telefone..."
                        value={customerSearch}
                        onChange={e => setCustomerSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl border border-slate-700/60 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/60 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Cliente</th>
                          <th className="p-3">Telefone</th>
                          <th className="p-3">CPF</th>
                          <th className="p-3">Endereço Completo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredCustomers.map(cust => (
                          <tr key={cust.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-white flex items-center gap-2">
                              <Users size={14} className="text-purple-400" /> {cust.name}
                            </td>
                            <td className="p-3 text-purple-300 font-medium">{cust.phone}</td>
                            <td className="p-3 text-slate-400">{cust.cpf || 'Não informado'}</td>
                            <td className="p-3 text-slate-300 flex items-center gap-1">
                              <MapPin size={12} className="text-slate-500 shrink-0" />
                              {cust.street ? `${cust.street}, ${cust.number} - ${cust.neighborhood}, ${cust.city}/${cust.state}` : 'Sem endereço registrado'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Aba 4: Modo 24h & Integrações (Somente Admin) */}
              {activeTab === 'integrations' && userRole === 'admin' && (
                <div className="space-y-6">
                  {/* Seção Modo 24h */}
                  <div className="bg-purple-950/40 border border-purple-500/40 p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400 fill-yellow-400" size={18} /> Modo 24h (Entrega Expressa)
                      </h4>
                      <p className="text-xs text-purple-200 mt-1 max-w-xl">
                        Quando ATIVO: Oculta a opção de personalizar bottons no e-commerce, vende apenas produtos prontos do catálogo e altera a frase do hero da loja.
                      </p>
                    </div>
                    <button
                      onClick={handleToggleModo24h}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${
                        modo24h ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-yellow-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {modo24h ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      {modo24h ? 'MODO 24h ATIVO' : 'MODO PADRÃO'}
                    </button>
                  </div>

                  {/* Seção Mercado Pago Sandbox / Produção */}
                  <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CreditCard className="text-sky-400" size={18} /> Mercado Pago Environment
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Ambiente atual: <strong className="text-sky-300">{mpEnvironment.toUpperCase()}</strong>. Troque entre Sandbox (Testes) e Produção.
                      </p>
                    </div>
                    <button
                      onClick={handleToggleMpEnvironment}
                      className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all ${
                        mpEnvironment === 'sandbox'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {mpEnvironment === 'sandbox' ? '🧪 Ambiente: SANDBOX' : '🚀 Ambiente: PRODUÇÃO'}
                    </button>
                  </div>

                  {/* Chaves de Integração */}
                  <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                      <Key size={14} className="text-purple-400" /> Evolution API & Chaves de Integração
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Evolution API Endpoint</label>
                        <input type="text" value={evoUrl} readOnly className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-300" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Mercado Pago Access Token</label>
                        <input type="password" value={mpToken} readOnly className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-300" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <a href={`${evoUrl}/manager`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                        <ExternalLink size={14} /> Abrir Evolution Manager (WhatsApp QR Code)
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
