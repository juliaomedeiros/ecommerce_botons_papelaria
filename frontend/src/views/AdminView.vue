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
          <p class="text-xs text-slate-300">Gestão de Vendas, Insumos Físicos, Livro Razão e Notificações</p>
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

    <!-- Painel com Abas se token -->
    <main v-else class="flex-1 flex flex-col">
      <!-- Sub-Barra de Abas -->
      <div class="bg-white border-b border-slate-200 shadow-sm px-6">
        <div class="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          <button @click="activeTab = 'dashboard'" :class="['px-4 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition', activeTab === 'dashboard' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <LayoutDashboard class="w-4 h-4" /> Dashboard Financeiro
          </button>
          <button @click="activeTab = 'stock'" :class="['px-4 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition', activeTab === 'stock' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Package class="w-4 h-4" /> Insumos Físicos
          </button>
          <button @click="activeTab = 'stock_history'" :class="['px-4 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition', activeTab === 'stock_history' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <History class="w-4 h-4" /> Histórico & Razão de Estoque
          </button>
          <button @click="activeTab = 'production'" :class="['px-4 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition', activeTab === 'production' ? 'border-tutas-secondary text-tutas-primary' : 'border-transparent text-slate-500 hover:text-slate-800']">
            <Layers class="w-4 h-4" /> Fila Noturna de Produção
          </button>
        </div>
      </div>

      <!-- Conteúdo da Aba Ativa -->
      <div class="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <!-- Dashboard -->
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

        <!-- Insumos Físicos -->
        <div v-else-if="activeTab === 'stock'" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-extrabold text-tutas-primary mb-4">Estoque Centralizado por Insumo Físico (25mm / 38mm)</h3>
          
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

        <!-- Histórico e Razão -->
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

        <!-- Fila de Produção -->
        <div v-else-if="activeTab === 'production'" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-extrabold text-tutas-primary mb-4">📅 Fila Noturna de Produção</h3>
          <p class="text-xs text-slate-500 mb-4">Visualização das artes já recortadas e formatadas 300DPI prontas para prensa.</p>
          <div v-if="productionQueue.length === 0" class="text-slate-400 text-sm py-8 text-center font-medium">Nenhum pedido pendente na fila de produção.</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, LogOut, LayoutDashboard, Package, History, Layers, DollarSign, TrendingUp, Award, AlertTriangle } from 'lucide-vue-next';

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

function goHome() {
  router.push('/');
}

function handleLogout() {
  token.value = '';
  localStorage.removeItem('tutas_token');
}

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
  } catch (err) {
    loginError.value = 'Erro de conexão ao autenticar.';
  }
}

async function loadTabData() {
  if (!token.value) return;

  try {
    if (activeTab.value === 'dashboard') {
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) stats.value = await res.json();
    } else if (activeTab.value === 'stock') {
      const res = await fetch('/api/admin/raw-materials-stock');
      if (res.ok) rawStock.value = await res.json();
    } else if (activeTab.value === 'stock_history') {
      const res = await fetch('/api/admin/raw-materials-stock/movements');
      if (res.ok) stockMovements.value = await res.json();
    } else if (activeTab.value === 'production') {
      const res = await fetch('/api/admin/production-queue');
      if (res.ok) productionQueue.value = await res.json();
    }
  } catch (err) {
    console.log('Erro ao carregar dados da aba:', err.message);
  }
}

watch(activeTab, () => {
  loadTabData();
});

onMounted(() => {
  if (token.value) loadTabData();
});
</script>
