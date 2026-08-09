import React, { useState, useEffect } from 'react';
import { Lock, Layers, Calendar, Download, CheckCircle, RefreshCw, LogOut, Plus, Zap, Settings, ExternalLink, MessageSquare, CreditCard, Key, Globe, Shield, ArrowLeft, Users, Package, ShoppingBag, ToggleLeft, ToggleRight, Search, MapPin, Trash2, UserPlus, ShieldAlert, Check, AlertTriangle, Eye, EyeOff, LayoutDashboard, DollarSign, TrendingUp, Upload, Image as ImageIcon, Send, PhoneCall, Edit2, Save, XCircle } from 'lucide-react';

export default function AdminDashboard({ isOpen, isEventoMode, onToggleEventoMode, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('tutas_token') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('tutas_role') || 'admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Abas: 'dashboard' | 'production' | 'products' | 'customers' | 'users' | 'integrations'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    total_sales: 0,
    monthly_sales: 0,
    total_orders: 0,
    pending_orders: 0,
    total_products: 0,
    stock_monetary_value: 0,
    stock_total_items: 0,
    low_stock: 0,
    total_customers: 0
  });
  const [productionQueue, setProductionQueue] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [adminUsersList, setAdminUsersList] = useState([]);

  // Configurações Globais Mercado Pago & Evolution API
  const [modo24h, setModo24h] = useState(false);
  const [mpEnvironment, setMpEnvironment] = useState('sandbox');
  const [mpPublicKey, setMpPublicKey] = useState('');
  const [mpAccessToken, setMpAccessToken] = useState('');
  const [mpWebhookSecret, setMpWebhookSecret] = useState('');
  const [evoUrl, setEvoUrl] = useState('http://localhost:8080');
  const [evoKey, setEvoKey] = useState('tutas_evolution_key');
  const [evoInstance, setEvoInstance] = useState('tutaspaper');
  const [adminPhone, setAdminPhone] = useState('');

  // Form de Produto
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Geral');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [prodPrice, setProdPrice] = useState('15.00');
  const [prodStock, setProdStock] = useState('20');
  const [prodMaxLimit, setProdMaxLimit] = useState('100');
  const [prodImg, setProdImg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para edição via Lápis na tabela
  const [editingProdId, setEditingProdId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editMaxLimit, setEditMaxLimit] = useState('');

  // Matriz de Variações (25mm e 38mm x Alfinete, Chaveiro, Ímã)
  const [varMatrix, setVarMatrix] = useState({
    '25mm_alfinete': { price: '5.00', stock: '500', maxLimit: '50' },
    '25mm_chaveiro': { price: '7.00', stock: '300', maxLimit: '30' },
    '25mm_ima': { price: '6.50', stock: '250', maxLimit: '25' },
    '38mm_alfinete': { price: '6.00', stock: '600', maxLimit: '100' },
    '38mm_chaveiro': { price: '8.50', stock: '400', maxLimit: '50' },
    '38mm_ima': { price: '8.00', stock: '350', maxLimit: '35' }
  });

  // Form de Cliente
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCpf, setCustCpf] = useState('');
  const [custStreet, setCustStreet] = useState('');
  const [custNumber, setCustNumber] = useState('');
  const [custCity, setCustCity] = useState('João Pessoa');
  const [customerSearch, setCustomerSearch] = useState('');

  // Form de Novo Usuário do Admin
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('funcionario');

  if (!isOpen) return null;

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.modo_24h !== undefined) setModo24h(data.modo_24h);
        if (data.mp_environment) setMpEnvironment(data.mp_environment);
        if (data.mp_public_key) setMpPublicKey(data.mp_public_key);
        if (data.mercadopago_token) setMpAccessToken(data.mercadopago_token);
        if (data.mp_webhook_secret) setMpWebhookSecret(data.mp_webhook_secret);
        if (data.evolution_api_url) setEvoUrl(data.evolution_api_url);
        if (data.evolution_api_key) setEvoKey(data.evolution_api_key);
        if (data.evolution_instance_name) setEvoInstance(data.evolution_instance_name);
        if (data.admin_phone) setAdminPhone(data.admin_phone);
      })
      .catch(err => console.log('Carregando config padrão:', err.message));
  }, []);

  // Autenticação Rígida
  async function handleLogin(e) {
    if (e) e.preventDefault();
    setLoginError('');
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
        setLoginError(data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err) {
      setLoginError('Erro de conexão ao autenticar. Tente novamente.');
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
      if (activeTab === 'dashboard') fetchDashboardStats();
      if (activeTab === 'production') fetchProductionQueue();
      if (activeTab === 'products') {
        fetchCategories();
        fetchProducts();
      }
      if (activeTab === 'customers') fetchCustomers();
      if (activeTab === 'users' && userRole === 'admin') fetchAdminUsers();
    }
  }, [token, activeTab]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategoriesList(data);
        if (data.length > 0 && !prodCategoryId) {
          setProdCategoryId(data[0].id);
        }
      }
    } catch (err) {
      console.log('Erro ao carregar categorias:', err.message);
    }
  }

  async function fetchDashboardStats() {
    try {
      const res = await fetch('/api/admin/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch (err) {
      console.log('Erro ao carregar estatísticas:', err.message);
    }
  }

  async function fetchProductionQueue() {
    try {
      const res = await fetch('/api/admin/production-queue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProductionQueue(data);
      } else {
        setProductionQueue([]);
      }
    } catch (err) {
      setProductionQueue([]);
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.log('Erro ao carregar produtos:', err.message);
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomersList(data);
      }
    } catch (err) {
      console.log('Erro ao carregar clientes:', err.message);
    }
  }

  async function fetchAdminUsers() {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsersList(data);
      }
    } catch (err) {
      console.log('Erro ao carregar usuários admin:', err.message);
    }
  }

  // Upload de Imagem de Produto (Arquivo Físico)
  async function handleProductFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/admin/upload-product-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setProdImg(data.imageUrl);
      } else {
        alert(data.error || 'Erro ao enviar imagem.');
      }
    } catch (err) {
      alert('Erro ao realizar upload da imagem.');
    } finally {
      setUploadingImage(false);
    }
  }

  // Finalizar Pedido & Notificar WhatsApp do Comprador
  async function handleCompleteOrder(orderId, customerName) {
    if (!window.confirm(`Deseja marcar o Pedido #${orderId} como CONCLUÍDO e notificar ${customerName} no WhatsApp?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/production-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ production_status: 'completed' })
      });

      if (res.ok) {
        alert(`Pedido #${orderId} finalizado com sucesso! Mensagem de notificação enviada ao comprador no WhatsApp.`);
        fetchProductionQueue();
      } else {
        alert('Erro ao finalizar pedido.');
      }
    } catch (err) {
      alert('Erro de conexão ao atualizar status do pedido.');
    }
  }

  // Cadastrar Usuário do Admin
  async function handleAddAdminUser(e) {
    e.preventDefault();
    try {
      const payload = {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole
      };

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Usuário administrativo cadastrado com sucesso!');
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
        fetchAdminUsers();
      } else {
        alert(data.error || 'Erro ao cadastrar usuário administrativo.');
      }
    } catch (err) {
      alert('Erro de conexão ao cadastrar usuário.');
    }
  }

  async function handleDeleteAdminUser(id, name) {
    if (!window.confirm(`Tem certeza que deseja excluir o acesso administrativo de ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Usuário removido!');
        fetchAdminUsers();
      } else {
        alert(data.error || 'Erro ao excluir usuário.');
      }
    } catch (err) {
      alert('Erro de conexão ao excluir usuário.');
    }
  }

  // Excluir Cliente Comprador
  async function handleDeleteCustomer(id, name) {
    if (!window.confirm(`Tem certeza que deseja excluir o cadastro do cliente ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Cliente removido com sucesso!');
        fetchCustomers();
      } else {
        alert('Erro ao excluir cliente.');
      }
    } catch (err) {
      alert('Erro de conexão ao excluir cliente.');
    }
  }

  // Cadastrar Produto com Imagem e Limite Máximo por Compra
  async function handleAddProduct(e) {
    e.preventDefault();

    const selectedCategoryObj = categoriesList.find(c => c.id === prodCategoryId);
    const isBottonCat = prodCategoryId === 'cat-bottons-001' || (selectedCategoryObj && selectedCategoryObj.slug === 'bottons');

    let finalStockVal = parseInt(prodStock) || 0;
    let finalMaxLimitVal = parseInt(prodMaxLimit) || 0;
    let variationsArray = [];

    if (isBottonCat) {
      variationsArray = [
        { diameter: '25mm', finish_type: 'alfinete', price_override: parseFloat(varMatrix['25mm_alfinete'].price), stock_quantity: parseInt(varMatrix['25mm_alfinete'].stock) || 0, max_limit_per_order: parseInt(varMatrix['25mm_alfinete'].maxLimit) || 50 },
        { diameter: '25mm', finish_type: 'chaveiro', price_override: parseFloat(varMatrix['25mm_chaveiro'].price), stock_quantity: parseInt(varMatrix['25mm_chaveiro'].stock) || 0, max_limit_per_order: parseInt(varMatrix['25mm_chaveiro'].maxLimit) || 30 },
        { diameter: '25mm', finish_type: 'ima', price_override: parseFloat(varMatrix['25mm_ima'].price), stock_quantity: parseInt(varMatrix['25mm_ima'].stock) || 0, max_limit_per_order: parseInt(varMatrix['25mm_ima'].maxLimit) || 25 },
        { diameter: '38mm', finish_type: 'alfinete', price_override: parseFloat(varMatrix['38mm_alfinete'].price), stock_quantity: parseInt(varMatrix['38mm_alfinete'].stock) || 0, max_limit_per_order: parseInt(varMatrix['38mm_alfinete'].maxLimit) || 100 },
        { diameter: '38mm', finish_type: 'chaveiro', price_override: parseFloat(varMatrix['38mm_chaveiro'].price), stock_quantity: parseInt(varMatrix['38mm_chaveiro'].stock) || 0, max_limit_per_order: parseInt(varMatrix['38mm_chaveiro'].maxLimit) || 50 },
        { diameter: '38mm', finish_type: 'ima', price_override: parseFloat(varMatrix['38mm_ima'].price), stock_quantity: parseInt(varMatrix['38mm_ima'].stock) || 0, max_limit_per_order: parseInt(varMatrix['38mm_ima'].maxLimit) || 35 }
      ];

      // Validar cada variação
      for (const v of variationsArray) {
        if (v.max_limit_per_order > v.stock_quantity && v.stock_quantity > 0) {
          alert(`Erro de Validação na Variação (${v.diameter} - ${v.finish_type}): O limite por compra (${v.max_limit_per_order}) não pode ser maior que o estoque (${v.stock_quantity}).`);
          return;
        }
      }

      finalStockVal = variationsArray.reduce((acc, v) => acc + v.stock_quantity, 0);
    } else {
      if (finalMaxLimitVal > finalStockVal && finalStockVal > 0) {
        alert(`Erro de Validação: O limite máximo por compra (${finalMaxLimitVal}) não pode ser maior do que o estoque total disponível (${finalStockVal}).`);
        return;
      }
    }

    try {
      const payload = {
        name: prodName,
        category_id: prodCategoryId || null,
        base_price: parseFloat(prodPrice || 5.00),
        stock_quantity: finalStockVal,
        max_limit_per_order: finalMaxLimitVal || 100,
        image_url: prodImg || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
        variations: isBottonCat ? variationsArray : []
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Produto cadastrado com matriz de variações com sucesso!');
        setProdName('');
        setProdImg('');
        fetchProducts();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Erro ao cadastrar produto.');
      }
    } catch (err) {
      alert('Erro na requisição de cadastro.');
    }
  }

  function startEditingProduct(prod) {
    setEditingProdId(prod.id);
    setEditPrice(prod.base_price);
    setEditStock(prod.stock_quantity || 0);
    setEditMaxLimit(prod.max_limit_per_order || 100);
  }

  function cancelEditingProduct() {
    setEditingProdId(null);
  }

  async function saveProductRow(prodId) {
    const stockVal = parseInt(editStock) || 0;
    const maxLimitVal = parseInt(editMaxLimit) || 0;

    if (maxLimitVal > stockVal) {
      alert(`Erro de Validação: O limite máximo por compra (${maxLimitVal}) não pode ser maior do que o estoque total disponível (${stockVal}).`);
      return;
    }

    await handleUpdateProductPriceStock(prodId, editPrice, editStock, editMaxLimit);
    setEditingProdId(null);
  }

  async function handleUpdateProductPriceStock(id, newPrice, newStock, newMaxLimit) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          base_price: parseFloat(newPrice),
          stock_quantity: parseInt(newStock),
          max_limit_per_order: parseInt(newMaxLimit)
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Erro ao atualizar produto.');
      }
      fetchProducts();
    } catch (err) {
      console.log('Erro ao atualizar produto:', err.message);
    }
  }

  // Excluir Produto do Catálogo
  async function handleDeleteProduct(id, name) {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${name}" do catálogo?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Produto removido do catálogo com sucesso!');
        fetchProducts();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Erro ao excluir produto.');
      }
    } catch (err) {
      alert('Erro de conexão ao excluir produto.');
    }
  }

  // Cadastrar Cliente Comprador
  async function handleAddCustomer(e) {
    e.preventDefault();
    try {
      const payload = {
        name: custName,
        phone: custPhone,
        cpf: custCpf,
        street: custStreet,
        number: custNumber,
        city: custCity
      };

      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Cliente cadastrado com sucesso!');
        setCustName('');
        setCustPhone('');
        fetchCustomers();
      } else {
        alert('Erro ao cadastrar cliente.');
      }
    } catch (err) {
      alert('Erro de conexão ao cadastrar cliente.');
    }
  }

  // Salvar Integrações Mercado Pago & Evolution API
  async function handleSaveIntegrations(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mp_environment: mpEnvironment,
          mp_public_key: mpPublicKey,
          mercadopago_token: mpAccessToken,
          mp_webhook_secret: mpWebhookSecret,
          evolution_api_url: evoUrl,
          evolution_api_key: evoKey,
          evolution_instance_name: evoInstance,
          admin_phone: adminPhone
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Configurações de Mercado Pago, Evolution API e WhatsApp do Admin salvas com sucesso!');
      } else {
        alert('Erro ao salvar configurações.');
      }
    } catch (err) {
      alert('Erro de conexão ao salvar integrações.');
    }
  }

  // Alternar Modo 24h
  async function handleToggleModo24h() {
    const nextVal = !modo24h;
    setModo24h(nextVal);
    if (onToggleEventoMode) onToggleEventoMode(nextVal);

    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ modo_24h: nextVal })
      });
    } catch (err) {
      console.log('Modo 24h alterado:', nextVal);
    }
  }

  // Limpar Dados de Exemplo
  async function handleResetDemoData() {
    if (!window.confirm('ATENÇÃO: Deseja apagar todas as ordens, fila noturna e clientes de teste para iniciar testes reais?')) return;
    try {
      const res = await fetch('/api/admin/reset-demo-data', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Dados de teste removidos! Banco pronto para testes reais.');
        setProductionQueue([]);
        setCustomersList([]);
      } else {
        alert('Erro ao resetar dados.');
      }
    } catch (err) {
      alert('Erro de conexão ao solicitar reset.');
    }
  }

  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch) || 
    (c.cpf && c.cpf.includes(customerSearch))
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--light-bg)' }}>
      
      {/* Header Institucional da Página Admin (Full-Page) */}
      <header style={{
        background: 'linear-gradient(135deg, #0c1a20 0%, #173440 100%)',
        color: '#ffffff',
        padding: '16px 0',
        borderBottom: '3px solid var(--secondary)',
        boxShadow: '0 4px 14px rgba(23,52,64,0.18)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/logo.png" 
              alt="Tuta's Paper Logo" 
              style={{
                height: '48px',
                width: 'auto',
                borderRadius: '10px',
                boxShadow: '0 3px 10px rgba(23,52,64,0.18)',
                objectFit: 'contain',
                background: '#9fe3eb'
              }}
            />
            <div>
              <h1 style={{ fontSize: '1.35rem', color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                Painel Administrativo Tuta's Paper
                {token && (
                  <span className="badge badge-gold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Role: {userRole}
                  </span>
                )}
              </h1>
              <p style={{ fontSize: '0.82rem', color: '#cbe4e8' }}>
                Gestão de Vendas, Estoque, Clientes e Integrações de Retaguarda
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {token && (
              <button className="btn btn-outline" onClick={handleLogout} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', padding: '8px 16px', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Sair
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Voltar ao E-commerce
            </button>
          </div>
        </div>
      </header>

      {/* Tela de Login Protegida */}
      {!token ? (
        <main className="container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--primary-light)', borderRadius: '50%', marginBottom: '14px' }}>
                <Lock size={32} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '800' }}>Acesso Restrito ao Admin</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Digite o e-mail e senha cadastrados para acessar o painel</p>
            </div>

            {loginError && (
              <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@tutaspapeis.com.br"
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '13px', width: '100%', fontSize: '1.05rem', marginTop: '8px' }}>
                Entrar no Painel
              </button>
            </form>
          </div>
        </main>
      ) : (
        /* Painel com Abas Full-Page */
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Barra de Abas Responsiva */}
          <div style={{ background: '#ffffff', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="container" style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              
              <button
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
                style={{ padding: '16px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>

              <button
                className={`tab-btn ${activeTab === 'production' ? 'active' : ''}`}
                onClick={() => setActiveTab('production')}
                style={{ padding: '16px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Layers size={18} /> Fila Noturna
              </button>

              <button
                className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
                style={{ padding: '16px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Package size={18} /> Produtos & Estoque
              </button>

              <button
                className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
                style={{ padding: '16px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={18} /> Clientes Compradores
              </button>

              {userRole === 'admin' && (
                <button
                  className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                  style={{ padding: '16px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <UserPlus size={18} /> Usuários do Admin
                </button>
              )}

              {userRole === 'admin' && (
                <button
                  className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('integrations')}
                  style={{ padding: '16px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Settings size={18} /> Modo 24h & Integrações
                </button>
              )}
            </div>
          </div>

          {/* Conteúdo Principal Responsivo */}
          <div className="container" style={{ flex: 1, padding: '30px 20px' }}>
            
            {/* 📊 Aba 0: Dashboard Geral com Faturamento Total, Mês e Valor em Estoque */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '4px' }}>Visão Geral Financeira & Estoque</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Métricas consolidadas de faturamento total, mês atual e inventário armazenado.</p>
                  </div>
                  <button className="btn btn-outline" onClick={fetchDashboardStats} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <RefreshCw size={16} /> Atualizar Métricas
                  </button>
                </div>

                {/* 4 Cards de Métricas Principais (Faturamento Total, Faturamento Mês, Valor em Estoque, Clientes) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px' }}>
                    <div style={{ padding: '14px', background: '#dcfce7', borderRadius: '12px', color: '#166534' }}>
                      <DollarSign size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Faturamento Acumulado</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                        R$ {dashboardStats.total_sales.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 'bold' }}>
                        {dashboardStats.total_orders} pedido(s) pagos
                      </span>
                    </div>
                  </div>

                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px' }}>
                    <div style={{ padding: '14px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                      <TrendingUp size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Faturamento Mês Atual</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                        R$ {dashboardStats.monthly_sales.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Mês vigente
                      </span>
                    </div>
                  </div>

                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px' }}>
                    <div style={{ padding: '14px', background: 'var(--secondary-light)', borderRadius: '12px', color: '#0e5864' }}>
                      <Package size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Valor Total em Estoque</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                        R$ {dashboardStats.stock_monetary_value.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#0e5864', fontWeight: 'bold' }}>
                        {dashboardStats.stock_total_items} unidades para venda
                      </span>
                    </div>
                  </div>

                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px' }}>
                    <div style={{ padding: '14px', background: '#e1f7f9', borderRadius: '12px', color: '#0e5864' }}>
                      <Users size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Base de Clientes</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                        {dashboardStats.total_customers}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Compradores registrados</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Aba 1: Fila de Prensa Noturna (Central Única de Pedidos & WhatsApp) */}
            {activeTab === 'production' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '4px' }}>Fila Noturna de Impressão e Prensa</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Baixe a imagem formatada e ao concluir o pedido, notifique o comprador no WhatsApp.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={fetchProductionQueue} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                      <RefreshCw size={16} /> Atualizar Fila
                    </button>
                  </div>
                </div>

                {productionQueue.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                    Nenhum pedido pendente na fila noturna de impressão.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {productionQueue.map((item, idx) => (
                      <div key={idx} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px' }}>
                        <img
                          src={item.cropped_image_url}
                          alt="Arte HD"
                          style={{ width: '92px', height: '92px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--secondary)', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, fontSize: '0.88rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary)' }}>{item.order_id}</span>
                            <span className={`badge ${item.production_status === 'completed' ? 'badge-green' : 'badge-gold'}`}>
                              {item.production_status === 'completed' ? 'Concluído' : 'Pendente'}
                            </span>
                          </div>

                          <div style={{ fontWeight: '600', color: '#334155', margin: '2px 0' }}>
                            {item.customer_name} • <a href={`https://wa.me/55${item.customer_phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#0e5864', fontWeight: 'bold' }}>{item.customer_phone}</a>
                          </div>

                          <div style={{ color: '#0e5864', fontWeight: '700', margin: '6px 0' }}>
                            {item.diameter} • {item.finish_type} ({item.quantity}x)
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                            <a
                              href={item.cropped_image_url}
                              download={`arte-${item.order_id}.png`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline"
                              style={{ display: 'inline-flex', padding: '6px 10px', fontSize: '0.78rem' }}
                            >
                              <Download size={14} /> Baixar Arte
                            </a>

                            {item.production_status !== 'completed' && (
                              <button
                                className="btn btn-primary"
                                onClick={() => handleCompleteOrder(item.order_id, item.customer_name)}
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              >
                                <Send size={14} /> Concluir & Avisar WhatsApp
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 🖼️ Aba 2: Produtos & Estoque com Limite Máximo por Compra */}
            {activeTab === 'products' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Cadastrar Novo Produto */}
                <form onSubmit={handleAddProduct} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '800' }}>Cadastrar Novo Produto</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Nome do Produto *</label>
                      <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} placeholder="Ex: Botton EJC 38mm" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Categoria no E-Commerce *</label>
                      <select value={prodCategoryId} onChange={e => setProdCategoryId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required>
                        <option value="">Selecione uma categoria...</option>
                        {categoriesList.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Se a categoria selecionada for 'Bottons', exibir a matriz de 6 variações com preço, estoque e limite por compra */}
                  {(prodCategoryId === 'cat-bottons-001' || categoriesList.find(c => c.id === prodCategoryId)?.slug === 'bottons') ? (
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary)', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          🎛️ Matriz de Variações (Tamanho x Acabamento Verso)
                        </h4>
                        <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          Estoque Total Calculado: {
                            Object.values(varMatrix).reduce((acc, curr) => acc + (parseInt(curr.stock) || 0), 0)
                          } un.
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        Configure o preço, estoque total e limite por compra para cada combinação disponível:
                      </p>

                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#e2e8f0', color: 'var(--primary)', textAlign: 'left' }}>
                              <th style={{ padding: '8px 10px', borderRadius: '6px 0 0 6px' }}>Tamanho</th>
                              <th style={{ padding: '8px 10px' }}>Acabamento Verso</th>
                              <th style={{ padding: '8px 10px' }}>Preço Venda (R$)</th>
                              <th style={{ padding: '8px 10px' }}>Estoque Total (un.)</th>
                              <th style={{ padding: '8px 10px', borderRadius: '0 6px 6px 0' }}>Limite Máx. por Compra</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { key: '25mm_alfinete', size: '25mm (Pequeno)', finish: '🧷 Alfinete de Metal' },
                              { key: '25mm_chaveiro', size: '25mm (Pequeno)', finish: '🔑 Chaveiro 2 Faces' },
                              { key: '25mm_ima', size: '25mm (Pequeno)', finish: '🧲 Ímã de Geladeira' },
                              { key: '38mm_alfinete', size: '38mm (Padrão)', finish: '🧷 Alfinete de Metal' },
                              { key: '38mm_chaveiro', size: '38mm (Padrão)', finish: '🔑 Chaveiro 2 Faces' },
                              { key: '38mm_ima', size: '38mm (Padrão)', finish: '🧲 Ímã de Geladeira' }
                            ].map(row => (
                              <tr key={row.key} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '8px 10px', fontWeight: 'bold' }}>{row.size}</td>
                                <td style={{ padding: '8px 10px' }}>{row.finish}</td>
                                <td style={{ padding: '8px 10px' }}>
                                  <input
                                    type="number"
                                    step="0.50"
                                    value={varMatrix[row.key]?.price || ''}
                                    onChange={e => setVarMatrix({ ...varMatrix, [row.key]: { ...varMatrix[row.key], price: e.target.value } })}
                                    style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                  />
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <input
                                    type="number"
                                    value={varMatrix[row.key]?.stock || ''}
                                    onChange={e => setVarMatrix({ ...varMatrix, [row.key]: { ...varMatrix[row.key], stock: e.target.value } })}
                                    style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                  />
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <input
                                    type="number"
                                    value={varMatrix[row.key]?.maxLimit || ''}
                                    onChange={e => setVarMatrix({ ...varMatrix, [row.key]: { ...varMatrix[row.key], maxLimit: e.target.value } })}
                                    style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Preço Venda (R$)</label>
                        <input type="number" step="0.50" value={prodPrice} onChange={e => setProdPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Estoque Total</label>
                        <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Limite Máx. por Compra</label>
                        <input type="number" value={prodMaxLimit} onChange={e => setProdMaxLimit(e.target.value)} placeholder="Ex: 50" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                      </div>
                    </div>
                  )}

                  {/* Upload de Imagem Físico + URL */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                      Foto do Produto (Upload de Arquivo ou URL)
                    </label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '10px 16px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Upload size={16} /> {uploadingImage ? 'Enviando Foto...' : 'Upload de Arquivo de Foto'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductFileUpload}
                          style={{ display: 'none' }}
                          disabled={uploadingImage}
                        />
                      </label>

                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>ou cole a URL:</span>

                      <input
                        type="url"
                        value={prodImg}
                        onChange={e => setProdImg(e.target.value)}
                        placeholder="https://exemplo.com/imagem-produto.jpg"
                        style={{ flex: 1, minWidth: '220px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />

                      {prodImg && (
                        <img
                          src={prodImg}
                          alt="Prévia"
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--secondary)' }}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                      <Plus size={18} /> Adicionar Produto ao Catálogo
                    </button>
                  </div>
                </form>

                 {/* Tabela de Produtos Responsiva com Edição por Lápis e Avisos de Estoque */}
                <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                      <tr>
                        <th style={{ padding: '14px 20px' }}>Foto</th>
                        <th style={{ padding: '14px 20px' }}>Produto</th>
                        <th style={{ padding: '14px 20px' }}>Categoria</th>
                        <th style={{ padding: '14px 20px' }}>Preço Venda</th>
                        <th style={{ padding: '14px 20px' }}>Estoque Total</th>
                        <th style={{ padding: '14px 20px' }}>Máx / Compra</th>
                        <th style={{ padding: '14px 20px' }}>Status de Estoque</th>
                        <th style={{ padding: '14px 20px', textAlign: 'center' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map(prod => {
                        const isEditing = editingProdId === prod.id;
                        const stockNum = parseInt(prod.stock_quantity || 0);
                        const limitNum = parseInt(prod.max_limit_per_order || 1);
                        const renewalThreshold = Math.ceil(limitNum * 1.2);

                        return (
                          <tr key={prod.id} style={{ borderBottom: '1px solid #e2e8f0', background: isEditing ? '#f8fafc' : 'transparent' }}>
                            <td style={{ padding: '10px 20px' }}>
                              <img
                                src={prod.image_url}
                                alt={prod.name}
                                style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'; }}
                              />
                            </td>
                            <td style={{ padding: '14px 20px', fontWeight: '700', color: '#0f172a' }}>{prod.name}</td>
                            <td style={{ padding: '14px 20px', color: '#64748b', fontWeight: '600' }}>{prod.category_name || prod.category || 'Geral'}</td>
                            
                            {/* Preço (Bloqueado por Padrão / Editável via Lápis) */}
                            <td style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--primary)' }}>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.50"
                                  value={editPrice}
                                  onChange={e => setEditPrice(e.target.value)}
                                  style={{ width: '85px', padding: '6px 8px', borderRadius: '6px', border: '2px solid var(--secondary)', fontWeight: 'bold' }}
                                />
                              ) : (
                                `R$ ${parseFloat(prod.base_price).toFixed(2)}`
                              )}
                            </td>

                            {/* Estoque Total (Bloqueado por Padrão / Editável via Lápis) */}
                            <td style={{ padding: '14px 20px', fontWeight: '700' }}>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editStock}
                                  onChange={e => setEditStock(e.target.value)}
                                  style={{ width: '75px', padding: '6px 8px', borderRadius: '6px', border: '2px solid var(--secondary)', fontWeight: 'bold' }}
                                />
                              ) : (
                                `${stockNum} un.`
                              )}
                            </td>

                            {/* Limite Máx por Compra (Bloqueado por Padrão / Editável via Lápis) */}
                            <td style={{ padding: '14px 20px', fontWeight: '700' }}>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editMaxLimit}
                                  onChange={e => setEditMaxLimit(e.target.value)}
                                  style={{ width: '75px', padding: '6px 8px', borderRadius: '6px', border: '2px solid var(--secondary)', fontWeight: 'bold' }}
                                />
                              ) : (
                                `${limitNum} un.`
                              )}
                            </td>

                            {/* Status de Estoque com Badges de Alerta */}
                            <td style={{ padding: '14px 20px' }}>
                              {stockNum <= 0 || stockNum <= limitNum ? (
                                <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <AlertTriangle size={13} /> 🚫 Indisponível (Estoque Crítico)
                                </span>
                              ) : stockNum <= renewalThreshold ? (
                                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <AlertTriangle size={13} /> ⚠️ Renovar Estoque
                                </span>
                              ) : (
                                <span className="badge badge-green">Disponível</span>
                              )}
                            </td>

                            {/* Botão de Ação: Lápis para Editar / Confirmar */}
                            <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => saveProductRow(prod.id)}
                                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                    title="Salvar Alterações"
                                  >
                                    <Save size={14} /> Salvar
                                  </button>
                                  <button
                                    className="btn btn-outline"
                                    onClick={cancelEditingProduct}
                                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                    title="Cancelar"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    className="btn btn-outline"
                                    onClick={() => startEditingProduct(prod)}
                                    style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    title="Editar Produto"
                                  >
                                    <Edit2 size={14} /> Editar
                                  </button>
                                  <button
                                    className="btn btn-outline"
                                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                    style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#ef4444', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    title="Excluir Produto"
                                  >
                                    <Trash2 size={14} /> Excluir
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba 3: Clientes Compradores */}
            {activeTab === 'customers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Cadastrar Cliente */}
                <form onSubmit={handleAddCustomer} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} /> Novo Cadastro de Cliente Comprador
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Nome Completo *" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                    <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="Telefone / WhatsApp *" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                    <input type="text" value={custCpf} onChange={e => setCustCpf(e.target.value)} placeholder="CPF (Opcional)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <input type="text" value={custStreet} onChange={e => setCustStreet(e.target.value)} placeholder="Rua / Logradouro" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                    <input type="text" value={custNumber} onChange={e => setCustNumber(e.target.value)} placeholder="Número / Bairro" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                    <input type="text" value={custCity} onChange={e => setCustCity(e.target.value)} placeholder="Cidade / Estado" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                      Salvar Cliente
                    </button>
                  </div>
                </form>

                {/* Tabela de Clientes Responsiva com Botão Excluir */}
                <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)', flexWrap: 'wrap', gap: '12px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)' }}>
                      Clientes Cadastrados ({filteredCustomers.length})
                    </h4>
                    <input
                      type="text"
                      placeholder="Buscar cliente ou telefone..."
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                      style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', fontSize: '0.88rem', width: '250px' }}
                    />
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '14px 20px' }}>Cliente</th>
                        <th style={{ padding: '14px 20px' }}>Telefone / WhatsApp</th>
                        <th style={{ padding: '14px 20px' }}>CPF</th>
                        <th style={{ padding: '14px 20px' }}>Endereço Completo</th>
                        <th style={{ padding: '14px 20px', textAlign: 'right' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(cust => (
                        <tr key={cust.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--primary)' }}>{cust.name}</td>
                          <td style={{ padding: '14px 20px', color: '#0e5864', fontWeight: '600' }}>{cust.phone}</td>
                          <td style={{ padding: '14px 20px', color: '#64748b' }}>{cust.cpf || 'Não informado'}</td>
                          <td style={{ padding: '14px 20px', color: '#334155' }}>
                            {cust.street ? `${cust.street}, ${cust.number} - ${cust.city}` : 'Sem endereço registrado'}
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <button
                              className="btn btn-outline"
                              onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                              style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '6px 12px', fontSize: '0.8rem' }}
                              title="Excluir Cliente"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba 4: Gestão de Usuários do Admin (Admin Master) */}
            {activeTab === 'users' && userRole === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Form de Cadastro de Usuário do Admin */}
                <form onSubmit={handleAddAdminUser} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserPlus size={20} color="var(--primary)" /> Cadastrar Usuário do Admin
                    </h3>
                    <span className="badge badge-gold">Admin Master</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Nome Completo *</label>
                      <input type="text" value={newAdminName} onChange={e => setNewAdminName(e.target.value)} placeholder="Ex: Maria Atendente" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>E-mail de Login *</label>
                      <input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="atendente@tutaspapeis.com.br" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Senha *</label>
                      <input type="password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Nível de Permissão</label>
                      <select value={newAdminRole} onChange={e => setNewAdminRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}>
                        <option value="funcionario">Funcionário (Fila & Pedidos)</option>
                        <option value="admin">Administrador Master (Acesso Total)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                      <UserPlus size={16} /> Criar Usuário do Admin
                    </button>
                  </div>
                </form>

                {/* Tabela de Usuários Administrativos */}
                <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', background: 'var(--primary-light)' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)' }}>
                      Usuários do Sistema ({adminUsersList.length})
                    </h4>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '14px 20px' }}>Usuário</th>
                        <th style={{ padding: '14px 20px' }}>E-mail</th>
                        <th style={{ padding: '14px 20px' }}>Perfil</th>
                        <th style={{ padding: '14px 20px' }}>Status</th>
                        <th style={{ padding: '14px 20px', textAlign: 'right' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsersList.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--primary)' }}>{u.name}</td>
                          <td style={{ padding: '14px 20px', color: '#475569' }}>{u.email}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-primary'}`} style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                              {u.role === 'admin' ? 'ADMIN MASTER' : 'FUNCIONÁRIO'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span className="badge badge-green">Ativo</span>
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <button
                              className="btn btn-outline"
                              onClick={() => handleDeleteAdminUser(u.id, u.name)}
                              style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '6px 12px', fontSize: '0.8rem' }}
                              title="Excluir Usuário"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba 5: Integrações Separadas (Mercado Pago & Evolution API) & WhatsApp Admin */}
            {activeTab === 'integrations' && userRole === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <form onSubmit={handleSaveIntegrations} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Seção A: Mercado Pago (Homologação & Produção) */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #bcecf0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CreditCard size={22} color="var(--primary)" /> Integração Mercado Pago (Pix & Cartão)
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
                          Defina as chaves da sua conta Mercado Pago para ativação do Checkout Transparente Pix.
                        </p>
                      </div>

                      {/* Alternador Sandbox / Produção */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: mpEnvironment === 'sandbox' ? '#0e5864' : '#166534' }}>
                          Modo: {mpEnvironment === 'sandbox' ? '🧪 HOMOLOGAÇÃO (SANDBOX)' : '🚀 PRODUÇÃO (REAL)'}
                        </span>
                        <button
                          type="button"
                          className={`btn ${mpEnvironment === 'sandbox' ? 'btn-outline' : 'btn-secondary'}`}
                          onClick={() => setMpEnvironment(mpEnvironment === 'sandbox' ? 'production' : 'sandbox')}
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Alternar para {mpEnvironment === 'sandbox' ? 'PRODUÇÃO' : 'SANDBOX'}
                        </button>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155' }}>
                      💡 <strong>Como vincular o Mercado Pago:</strong> Acesse seu painel no <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Mercado Pago Developers</a> e copie as chaves da sua aplicação.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                          Mercado Pago Access Token *
                        </label>
                        <input
                          type="password"
                          value={mpAccessToken}
                          onChange={e => setMpAccessToken(e.target.value)}
                          placeholder="APP_USR-xxxxxxxxx..."
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                          Mercado Pago Public Key
                        </label>
                        <input
                          type="text"
                          value={mpPublicKey}
                          onChange={e => setMpPublicKey(e.target.value)}
                          placeholder="APP_USR-xxxxxxxxx..."
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                          Mercado Pago Webhook Secret (Notificação Pix)
                        </label>
                        <input
                          type="password"
                          value={mpWebhookSecret}
                          onChange={e => setMpWebhookSecret(e.target.value)}
                          placeholder="Secret do Webhook de confirmação Pix"
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção B: Evolution API (WhatsApp Notifications) */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MessageSquare size={22} color="var(--primary)" /> Integração Evolution API & Alertas WhatsApp
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                      Envio de comprovantes PDF e avisos automáticos de produção via WhatsApp.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>API Endpoint URL</label>
                        <input type="text" value={evoUrl} onChange={e => setEvoUrl(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>API Key</label>
                        <input type="password" value={evoKey} onChange={e => setEvoKey(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>Nome da Instância</label>
                        <input type="text" value={evoInstance} onChange={e => setEvoInstance(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>WhatsApp do Admin/Produção (para Alerta de Novos Pedidos)</label>
                        <input type="text" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} placeholder="Ex: 83999887766" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
                      </div>
                    </div>

                    <div>
                      <a href={`${evoUrl}/manager`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', fontSize: '0.88rem' }}>
                        <ExternalLink size={16} /> Abrir Evolution Manager (Conectar QR Code WhatsApp)
                      </a>
                    </div>
                  </div>

                  {/* Seção C: Modo 24h & Operação */}
                  <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--secondary-light)', border: '1px solid #bcecf0', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#0e5864', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} color="var(--primary)" /> Modo 24h (Entrega Expressa Noturna)
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: '#173440', marginTop: '4px', maxWidth: '650px' }}>
                        Quando ATIVO: Oculta personalização no e-commerce e foca apenas nos produtos prontos do catálogo para postagem expressa.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleModo24h}
                      className={`btn ${modo24h ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      {modo24h ? '⚡ MODO 24h ATIVO' : 'MODO PADRÃO'}
                    </button>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                      Salvar Todas as Configurações de Integração
                    </button>
                  </div>
                </form>

                {/* Seção de Limpeza / Reset para Teste Real */}
                <div className="card" style={{ border: '1px solid #fca5a5', background: '#fff5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#991b1b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trash2 size={18} color="#991b1b" /> Limpar Dados de Exemplo (Reset de Teste Real)
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#7f1d1d', marginTop: '4px' }}>
                      Remove pedidos, clientes e ordens de teste para que você possa cadastrar dados reais e testar a integração completa.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleResetDemoData}
                    style={{ background: '#dc2626', color: '#ffffff', padding: '10px 18px', fontSize: '0.88rem' }}
                  >
                    Limpar Dados de Teste
                  </button>
                </div>

              </div>
            )}

          </div>
        </main>
      )}

      {/* Footer da Página Admin */}
      <footer style={{ background: 'var(--dark)', color: '#94a3b8', padding: '30px 0 20px', borderTop: '1px solid #142832', marginTop: 'auto' }}>
        <div className="container" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
          © 2026 Tuta's Paper. Painel Administrativo de Retaguarda • Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}
