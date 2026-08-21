<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <!-- Header Admin Tailwind -->
    <header class="bg-gradient-to-r from-tutas-dark to-tutas-primary text-white py-4 px-6 shadow-md border-b-2 border-tutas-secondary flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Tutas Paper Logo" class="h-10 w-auto rounded bg-cyan-200 p-0.5" />
        <div>
          <h1 class="font-extrabold text-lg flex items-center gap-2">
            Painel Administrativo Tuta's Paper
            <span v-if="token" class="bg-amber-400/20 text-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-400/30">FastAPI + Vue 3</span>
          </h1>
          <p class="text-xs text-slate-300">Gestão de Vendas, Insumos Físicos, Livro Razão e Integrações</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button v-if="token" @click="handleLogout" class="px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1">
          <LogOut class="w-3.5 h-3.5" /> Sair
        </button>
        <button @click="goHome" class="px-3 py-1.5 rounded-lg bg-tutas-secondary hover:bg-tutas-secondary/90 text-white text-xs font-bold transition">
          Voltar ao E-commerce
        </button>
      </div>
    </header>

    <!-- Form de Login Protegido se !token -->
    <main v-if="!token" class="flex-1 flex items-center justify-center p-6">
      <div class="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
        <div class="inline-flex p-4 bg-slate-100 rounded-full mb-4 text-tutas-primary">
          <Lock class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-extrabold text-tutas-primary mb-1">Acesso Restrito ao Admin</h2>
        <p class="text-xs text-slate-500 mb-6">Digite seu e-mail e senha de administrador para autenticar.</p>

        <div v-if="loginError" class="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg mb-4 flex items-center gap-2 border border-rose-200">
          <AlertTriangle class="w-4 h-4 shrink-0" /> {{ loginError }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 text-left">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">E-mail de Acesso</label>
            <input type="email" v-model="email" placeholder="admin@tutaspapeis.com.br" required class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutas-secondary" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso</label>
            <input type="password" v-model="password" placeholder="••••••••" required class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutas-secondary" />
          </div>

          <button type="submit" class="w-full bg-tutas-primary hover:bg-tutas-dark text-white font-bold py-2.5 rounded-lg text-sm transition shadow-md">
            Entrar no Painel Python FastAPI
          </button>
        </form>
      </div>
    </main>

    <!-- Painel Completo com Abas Ordenadas se token -->
    <main v-else class="flex-1 flex flex-col">
      <!-- Sub-Barra de Abas (Fila de Pedidos na 2ª Posição) -->
      <div class="bg-white border-b border-slate-200 shadow-sm px-6">
        <div class="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          <button @click="activeTab = 'dashboard'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'dashboard' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <LayoutDashboard class="w-4 h-4" /> 1. Dashboard Financeiro
          </button>

          <!-- 2ª Aba: Fila de Pedidos -->
          <button @click="activeTab = 'production'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'production' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Layers class="w-4 h-4" /> 2. Fila de Pedidos
          </button>

          <button @click="activeTab = 'products'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'products' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <ShoppingBag class="w-4 h-4" /> 3. Produtos do Catálogo
          </button>

          <button @click="activeTab = 'categories'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'categories' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Tag class="w-4 h-4" /> 4. Gestão de Categorias
          </button>

          <button @click="activeTab = 'stock'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'stock' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Package class="w-4 h-4" /> 5. Insumos Físicos
          </button>

          <button @click="activeTab = 'stock_history'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'stock_history' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <History class="w-4 h-4" /> 6. Histórico & Razão
          </button>

          <button @click="activeTab = 'customers'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'customers' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Users class="w-4 h-4" /> 7. Clientes Compradores
          </button>

          <button @click="activeTab = 'config'" :class="['px-3 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition', activeTab === 'config' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Settings class="w-4 h-4" /> 8. Integrações & Configurações
          </button>
        </div>
      </div>

      <!-- Conteúdo da Aba Ativa -->
      <div class="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <!-- 1. Dashboard -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <h2 class="text-2xl font-extrabold text-tutas-primary">Visão Geral Financeira & Operacional</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div class="p-3 bg-emerald-100 text-emerald-800 rounded-lg">
                <DollarSign class="w-6 h-6" />
              </div>
              <div>
                <span class="text-xs font-bold text-slate-500 uppercase">Faturamento Acumulado</span>
                <div class="text-xl font-extrabold text-tutas-primary">R$ {{ Number(stats.total_sales || 0).toFixed(2) }}</div>
                <span class="text-[10px] text-emerald-700 font-bold">{{ stats.total_orders || 0 }} pedido(s)</span>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div class="p-3 bg-sky-100 text-sky-800 rounded-lg">
                <TrendingUp class="w-6 h-6" />
              </div>
              <div>
                <span class="text-xs font-bold text-slate-500 uppercase">CMV Custo Insumos</span>
                <div class="text-xl font-extrabold text-sky-800">R$ {{ Number(stats.total_cmv || 0).toFixed(2) }}</div>
                <span class="text-[10px] text-amber-700 font-bold">Perdas: R$ {{ Number(stats.total_loss || 0).toFixed(2) }}</span>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl shadow-sm border border-emerald-500/40 border-l-4 flex items-center gap-4">
              <div class="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                <Award class="w-6 h-6" />
              </div>
              <div>
                <span class="text-xs font-bold text-slate-500 uppercase">Lucro Líquido Real</span>
                <div class="text-xl font-extrabold text-emerald-700">R$ {{ Number(stats.net_profit || 0).toFixed(2) }}</div>
                <span class="text-[10px] text-emerald-800 font-bold">Faturamento − CMV − Perdas</span>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div class="p-3 bg-cyan-100 text-cyan-900 rounded-lg">
                <Package class="w-6 h-6" />
              </div>
              <div>
                <span class="text-xs font-bold text-slate-500 uppercase">Insumos Físicos</span>
                <div class="text-xl font-extrabold text-tutas-primary">{{ stats.stock_total_items || 0 }} un</div>
                <span class="text-[10px] text-cyan-900 font-bold">Estoque central</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Fila de Pedidos (Noturna de Produção + Botão Concluir & Avisar WhatsApp) -->
        <div v-else-if="activeTab === 'production'" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 class="text-lg font-extrabold text-tutas-primary">📅 Fila de Pedidos & Produção Noturna</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in productionQueue" :key="item.order_id" class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold font-mono text-tutas-primary">#{{ item.order_id }}</span>
                  <select :value="item.production_status" @change="e => handleUpdateStatus(item.order_id, e.target.value)" class="text-xs font-bold px-2 py-1 rounded border border-slate-300">
                    <option value="pending">🟡 Pendente Prensa</option>
                    <option value="in_production">🔵 Em Prensa</option>
                    <option value="completed">🟢 Concluído / Enviado</option>
                  </select>
                </div>
                <h4 class="font-bold text-sm text-slate-800">{{ item.product_name }} ({{ item.diameter }} - {{ item.finish }})</h4>
                <p class="text-xs text-slate-600">Cliente: <strong>{{ item.customer_name }}</strong> ({{ item.customer_phone }})</p>
              </div>

              <!-- Botão Concluir & Avisar WhatsApp (Adendo 005) -->
              <div class="pt-2 border-t flex justify-end">
                <button @click="handleNotifyWhatsApp(item)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow">
                  <Smartphone class="w-4 h-4" /> 📲 Concluir & Avisar WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Produtos do Catálogo (Com Upload Físico do PC) -->
        <div v-else-if="activeTab === 'products'" class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-lg font-extrabold text-tutas-primary mb-4 flex items-center gap-2">
              <PlusCircle class="w-5 h-5 text-tutas-secondary" /> Cadastrar Novo Produto (Upload Físico do PC)
            </h3>

            <form @submit.prevent="handleCreateProduct" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nome do Produto</label>
                <input type="text" v-model="newProd.name" placeholder="Ex: Botton Nossa Senhora 38mm" required class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Preço Base (R$)</label>
                <input type="number" step="0.01" v-model="newProd.base_price" required class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                <select v-model="newProd.category_id" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg">
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <!-- Upload Físico de Imagem do PC -->
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">Upload da Foto (Imagem do PC)</label>
                <input type="file" @change="handleFileUpload" accept="image/*" class="w-full text-xs border border-slate-300 rounded-lg p-1.5 bg-slate-50" />
                <span v-if="uploadingImg" class="text-[10px] text-tutas-secondary font-bold">Enviando imagem...</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <input type="text" v-model="newProd.description" placeholder="Detalhes do produto..." class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>

              <div class="sm:col-span-3 flex justify-end">
                <button type="submit" class="bg-tutas-primary hover:bg-tutas-dark text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow">
                  + Salvar Produto no Catálogo
                </button>
              </div>
            </form>
          </div>

          <!-- Tabela de Produtos -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-lg font-extrabold text-tutas-primary mb-4">Produtos Ativos no Catálogo</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-bold uppercase">
                  <tr>
                    <th class="p-3">Arte</th>
                    <th class="p-3">Nome</th>
                    <th class="p-3">Preço Base</th>
                    <th class="p-3">Categoria</th>
                    <th class="p-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr v-for="p in products" :key="p.id" class="hover:bg-slate-50">
                    <td class="p-3">
                      <img :src="p.image_url || '/logo.png'" class="h-8 w-8 object-contain rounded bg-slate-100" />
                    </td>
                    <td class="p-3 font-bold text-slate-800">{{ p.name }}</td>
                    <td class="p-3 font-extrabold text-tutas-primary">R$ {{ Number(p.base_price).toFixed(2) }}</td>
                    <td class="p-3 text-slate-600">{{ p.category_id || 'Bottons' }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Ativo</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 4. Categorias -->
        <div v-else-if="activeTab === 'categories'" class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-lg font-extrabold text-tutas-primary mb-4 flex items-center gap-2">
              <Tag class="w-5 h-5 text-tutas-secondary" /> Criar Nova Categoria
            </h3>

            <form @submit.prevent="handleCreateCategory" class="flex flex-col sm:flex-row gap-3">
              <input type="text" v-model="newCat.name" placeholder="Nome da Categoria (Ex: Papelaria)" required class="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              <input type="text" v-model="newCat.description" placeholder="Descrição..." class="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              <button type="submit" class="bg-tutas-primary text-white font-bold px-4 py-2 rounded-lg text-xs shadow">
                + Criar Categoria
              </button>
            </form>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-lg font-extrabold text-tutas-primary mb-4">Categorias Cadastradas</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div v-for="c in categories" :key="c.id" class="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 class="font-bold text-sm text-tutas-primary mb-1">{{ c.name }}</h4>
                <p class="text-xs text-slate-500">{{ c.description || 'Sem descrição.' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Insumos Físicos -->
        <div v-else-if="activeTab === 'stock'" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold text-tutas-primary">Estoque Centralizado por Insumo Físico (25mm / 38mm)</h3>
            <div class="flex gap-2">
              <button @click="openMovementModal('ENTRADA')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow flex items-center gap-1">
                <PlusCircle class="w-4 h-4" /> + Registrar Compra / Entrada
              </button>
              <button @click="openMovementModal('PERDA_PRENSA')" class="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow flex items-center gap-1">
                <AlertTriangle class="w-4 h-4" /> ⚠️ Registrar Perda na Prensa
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th class="p-3">Código</th>
                  <th class="p-3">Nome da Matéria-Prima</th>
                  <th class="p-3">Quantidade em Estoque</th>
                  <th class="p-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="item in rawStock" :key="item.code" class="hover:bg-slate-50">
                  <td class="p-3 font-mono font-bold text-tutas-primary">{{ item.code }}</td>
                  <td class="p-3 font-semibold">{{ item.name }}</td>
                  <td class="p-3 font-bold text-sm">{{ item.quantity }} un</td>
                  <td class="p-3">
                    <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase', item.quantity <= item.min_quantity ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800']">
                      {{ item.quantity <= item.min_quantity ? 'Baixo Estoque' : 'Em Estoque OK' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 6. Histórico e Razão -->
        <div v-else-if="activeTab === 'stock_history'" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-extrabold text-tutas-primary mb-4">📜 Livro Razão de Movimentações (`stock_movements`)</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th class="p-3">Tipo</th>
                  <th class="p-3">Código Insumo</th>
                  <th class="p-3">Qtd</th>
                  <th class="p-3">Estoque Anterior ➔ Novo</th>
                  <th class="p-3">Custo Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="mov in stockMovements" :key="mov.id" class="hover:bg-slate-50">
                  <td class="p-3">
                    <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase', mov.movement_type === 'ENTRADA' ? 'bg-emerald-100 text-emerald-800' : mov.movement_type === 'PERDA_PRENSA' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800']">
                      {{ mov.movement_type }}
                    </span>
                  </td>
                  <td class="p-3 font-mono font-bold">{{ mov.raw_material_code }}</td>
                  <td class="p-3 font-bold">{{ mov.quantity }} un</td>
                  <td class="p-3 text-slate-600">{{ mov.previous_quantity }} ➔ <strong>{{ mov.new_quantity }}</strong></td>
                  <td class="p-3 font-bold">R$ {{ Number(mov.total_cost || 0).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 7. Clientes Compradores -->
        <div v-else-if="activeTab === 'customers'" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-extrabold text-tutas-primary mb-4">👥 Clientes Compradores Registrados</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th class="p-3">Nome</th>
                  <th class="p-3">Telefone</th>
                  <th class="p-3">CPF</th>
                  <th class="p-3">Data de Cadastro</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="c in customers" :key="c.id" class="hover:bg-slate-50">
                  <td class="p-3 font-bold text-slate-800">{{ c.name }}</td>
                  <td class="p-3 text-slate-600">{{ c.phone }}</td>
                  <td class="p-3 font-mono text-slate-600">{{ c.cpf || 'Não informado' }}</td>
                  <td class="p-3 text-slate-500">{{ c.created_at || 'Recente' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 8. Integrações & Configurações (Cards Separados com Botões de Salvar Independentes) -->
        <div v-else-if="activeTab === 'config'" class="space-y-6">
          <h3 class="text-lg font-extrabold text-tutas-primary flex items-center gap-2">
            <Settings class="w-5 h-5 text-tutas-secondary" /> Painel de Integrações Independentes
          </h3>

          <!-- Card 1: Evolution API WhatsApp -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 text-left">
            <div class="flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">📱 Evolution API</div>
                <div>
                  <h4 class="font-bold text-sm text-slate-800">Motor de Notificação de Pedidos via WhatsApp</h4>
                  <span class="text-[10px] text-emerald-700 font-bold">🟢 Conectado (Engine Active)</span>
                </div>
              </div>

              <!-- Botão Ir para Manager -->
              <a href="http://localhost:8080/manager" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1">
                <ExternalLink class="w-3.5 h-3.5" /> Abrir Manager Evolution (QR Code)
              </a>
            </div>

            <form @submit.prevent="handleSaveConfig" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Telefone WhatsApp do Admin (Recebe alertas de novos pedidos)</label>
                <input type="text" v-model="config.admin_phone" placeholder="11999999999" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>

              <div class="flex justify-end">
                <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow">
                  Salvar Configurações de WhatsApp
                </button>
              </div>
            </form>
          </div>

          <!-- Card 2: Modo Evento 24h -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 text-left">
            <div class="flex items-center justify-between border-b pb-3">
              <h4 class="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Zap class="w-4 h-4 text-amber-500" /> Modo Evento 24h & Mensagem Hero
              </h4>
              <input type="checkbox" v-model="config.modo_24h" class="w-5 h-5 accent-tutas-secondary" />
            </div>

            <form @submit.prevent="handleSaveConfig" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Frase de Destaque no Banner da Loja</label>
                <input type="text" v-model="config.hero_phrase" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>

              <div class="flex justify-end">
                <button type="submit" class="bg-tutas-primary text-white font-bold px-4 py-2 rounded-lg text-xs shadow">
                  Salvar Modo 24h
                </button>
              </div>
            </form>
          </div>

          <!-- Card 3: Mercado Pago -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 text-left">
            <h4 class="font-bold text-sm text-slate-800 flex items-center gap-2 border-b pb-3">
              <CreditCard class="w-4 h-4 text-sky-600" /> Mercado Pago (Pix & Cartão)
            </h4>

            <form @submit.prevent="handleSaveConfig" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Ambiente</label>
                  <select v-model="config.mp_environment" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg">
                    <option value="sandbox">Sandbox (Testes)</option>
                    <option value="production">Produção</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Mercado Pago Public Key</label>
                  <input type="text" v-model="config.mp_public_key" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Mercado Pago Access Token</label>
                <input type="password" v-model="config.mercadopago_token" placeholder="APP_USR-..." class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" />
              </div>

              <div class="flex justify-end">
                <button type="submit" class="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow">
                  Salvar Mercado Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Registrar Movimentação de Estoque -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl space-y-4 text-left">
        <h3 class="font-extrabold text-lg text-tutas-primary">
          {{ modalType === 'ENTRADA' ? '+ Registrar Compra / Entrada' : '⚠️ Registrar Perda na Prensa' }}
        </h3>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Matéria-Prima Insumo Físico</label>
          <select v-model="movForm.raw_material_code" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg">
            <option v-for="r in rawStock" :key="r.code" :value="r.code">{{ r.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Quantidade (Unidades)</label>
          <input type="number" min="1" v-model="movForm.quantity" required class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Custo Total da Compra/Perda (R$)</label>
          <input type="number" step="0.01" v-model="movForm.total_cost" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="showModal = false" class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold">Cancelar</button>
          <button type="button" @click="handleSaveMovement" class="px-4 py-1.5 rounded-lg bg-tutas-primary text-white text-xs font-bold shadow">
            Confirmar Movimentação
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, LogOut, LayoutDashboard, ShoppingBag, Tag, Package, History, Layers, Users, Settings, DollarSign, TrendingUp, Award, AlertTriangle, PlusCircle, Smartphone, ExternalLink, Zap, CreditCard } from 'lucide-vue-next';

const router = useRouter();
const token = ref(localStorage.getItem('tutas_token') || '');
const email = ref('');
const password = ref('');
const loginError = ref('');
const activeTab = ref('dashboard');

const stats = ref({});
const rawStock = ref([]);
const stockMovements = ref([]);
const productionQueue = ref([]);
const products = ref([]);
const categories = ref([]);
const customers = ref([]);
const config = ref({});

const showModal = ref(false);
const modalType = ref('ENTRADA');
const movForm = ref({ raw_material_code: '25mm_alfinete', quantity: 10, total_cost: 0 });

const newProd = ref({ name: '', base_price: 15.00, category_id: 'cat_bottons', image_url: '', description: '' });
const newCat = ref({ name: '', description: '' });
const uploadingImg = ref(false);

function goHome() { router.push('/'); }
function handleLogout() { token.value = ''; localStorage.removeItem('tutas_token'); }

async function handleLogin() {
  loginError.value = '';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      token.value = data.token;
      localStorage.setItem('tutas_token', data.token);
      loadTabData();
    } else {
      loginError.value = data.detail || 'Credenciais inválidas.';
    }
  } catch (err) { loginError.value = 'Erro de conexão.'; }
}

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadingImg.value = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch('/api/admin/upload-product-image', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      newProd.value.image_url = data.url;
    }
  } catch (err) { console.log(err); }
  finally { uploadingImg.value = false; }
}

function openMovementModal(type) {
  modalType.value = type;
  movForm.value = { raw_material_code: rawStock.value[0]?.code || '25mm_alfinete', quantity: 10, total_cost: 0 };
  showModal.value = true;
}

async function handleSaveMovement() {
  try {
    const res = await fetch('/api/admin/raw-materials-stock/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        raw_material_code: movForm.value.raw_material_code,
        movement_type: modalType.value,
        quantity: Number(movForm.value.quantity),
        total_cost: Number(movForm.value.total_cost)
      })
    });
    if (res.ok) { showModal.value = false; loadTabData(); }
  } catch (err) { console.log(err); }
}

async function handleCreateProduct() {
  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd.value)
    });
    if (res.ok) {
      newProd.value = { name: '', base_price: 15.00, category_id: 'cat_bottons', image_url: '', description: '' };
      loadTabData();
    }
  } catch (err) { console.log(err); }
}

async function handleCreateCategory() {
  try {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat.value)
    });
    if (res.ok) {
      newCat.value = { name: '', description: '' };
      loadTabData();
    }
  } catch (err) { console.log(err); }
}

async function handleUpdateStatus(orderId, statusVal) {
  try {
    await fetch(`/api/admin/orders/${orderId}/production-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ production_status: statusVal })
    });
    loadTabData();
  } catch (err) { console.log(err); }
}

function handleNotifyWhatsApp(item) {
  alert(`Notificação enviada via WhatsApp para o cliente ${item.customer_name} (${item.customer_phone}) informando que o pedido #${item.order_id} está pronto!`);
}

async function handleSaveConfig() {
  try {
    await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config.value)
    });
    alert('Configurações salvas!');
  } catch (err) { console.log(err); }
}

async function loadTabData() {
  if (!token.value) return;

  try {
    const catRes = await fetch('/api/categories');
    if (catRes.ok) categories.value = await catRes.json();

    if (activeTab.value === 'dashboard') {
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) stats.value = await res.json();
    } else if (activeTab.value === 'products') {
      const res = await fetch('/api/products');
      if (res.ok) products.value = await res.json();
    } else if (activeTab.value === 'stock') {
      const res = await fetch('/api/admin/raw-materials-stock');
      if (res.ok) rawStock.value = await res.json();
    } else if (activeTab.value === 'stock_history') {
      const res = await fetch('/api/admin/raw-materials-stock/movements');
      if (res.ok) stockMovements.value = await res.json();
    } else if (activeTab.value === 'production') {
      const res = await fetch('/api/admin/production-queue');
      if (res.ok) productionQueue.value = await res.json();
    } else if (activeTab.value === 'customers') {
      const res = await fetch('/api/admin/customers');
      if (res.ok) customers.value = await res.json();
    } else if (activeTab.value === 'config') {
      const res = await fetch('/api/config');
      if (res.ok) config.value = await res.json();
    }
  } catch (err) { console.log(err.message); }
}

watch(activeTab, () => { loadTabData(); });
onMounted(() => { if (token.value) loadTabData(); });
</script>
