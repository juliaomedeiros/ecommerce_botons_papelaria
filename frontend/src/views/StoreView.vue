<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Banner Modo Evento 24h -->
    <div v-if="modo24h || modoEvento24h" class="bg-gradient-to-r from-tutas-primary to-tutas-secondary text-white py-2.5 px-4 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md">
      <Zap class="w-4 h-4 text-amber-300" />
      <span>⚡ MODO ENTREGA RÁPIDA 24h ATIVO: Produção Noturna & Postagem em até 24 Horas!</span>
    </div>

    <!-- Header Navbar Tailwind -->
    <header class="bg-tutas-primary text-white sticky top-0 z-40 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="goHome">
          <img src="/logo.png" alt="Tuta's Paper" class="h-10 w-auto rounded-md shadow" />
          <div>
            <h1 class="font-extrabold text-lg leading-tight">Tuta's Paper</h1>
            <p class="text-xs text-tutas-secondary font-medium">Papelaria • Religiosos • Bottons</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button @click="showCartModal = true" class="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5 text-xs font-semibold">
            <ShoppingBag class="w-4 h-4 text-tutas-secondary" />
            <span class="hidden sm:inline">Carrinho</span>
            <span v-if="cart.length > 0" class="bg-amber-400 text-tutas-dark text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
              {{ cart.reduce((a, b) => a + b.quantity, 0) }}
            </span>
          </button>

          <button @click="openAdmin" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5 text-xs font-semibold">
            <Lock class="w-4 h-4 text-tutas-secondary" />
            <span class="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-tutas-dark to-tutas-primary text-white py-10 px-4 relative overflow-hidden">
      <div class="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles class="w-3.5 h-3.5" /> Catálogo & Linha Personalizada
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold leading-tight mb-3">
            {{ heroPhrase }}
          </h2>
          <p class="text-slate-300 text-xs sm:text-sm mb-4">
            Disponível nos diâmetros de <strong class="text-white">25mm</strong> e <strong class="text-white">38mm</strong> com acabamentos em <strong class="text-white">Alfinete, Chaveiro</strong> e <strong class="text-white">Ímã</strong>.
          </p>

          <button @click="showSizeGuide = true" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/30 flex items-center gap-1">
            <Ruler class="w-4 h-4" /> 📐 Guia de Tamanhos (25mm x 38mm)
          </button>
        </div>
      </div>
    </section>

    <!-- Catálogo de Produtos -->
    <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 class="text-2xl font-extrabold text-tutas-primary">Catálogo de Produtos</h3>
          <p class="text-xs sm:text-sm text-slate-500">Escolha o produto desejado e selecione tamanho e acabamento.</p>
        </div>

        <!-- Filtros de Categorias -->
        <div class="flex gap-2 overflow-x-auto w-full sm:w-auto">
          <button @click="selectedCategory = 'all'" :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap', selectedCategory === 'all' ? 'bg-tutas-primary text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100']">
            Todos
          </button>
          <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id" :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap', selectedCategory === cat.id ? 'bg-tutas-primary text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100']">
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Grid de Produtos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="prod in filteredProducts" :key="prod.id" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col">
          <div class="h-48 bg-slate-100 flex items-center justify-center p-4 relative cursor-pointer" @click="openProductModal(prod)">
            <img :src="prod.image_url || '/logo.png'" :alt="prod.name" class="max-h-full object-contain" />
            <span v-if="prod.is_limited_edition" class="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Edição Limitada
            </span>
          </div>

          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-slate-800 mb-1 line-clamp-1 cursor-pointer" @click="openProductModal(prod)">{{ prod.name }}</h4>
              <p class="text-xs text-slate-500 mb-3 line-clamp-2">{{ prod.description || 'Produto de alta qualidade Tuta\'s Paper.' }}</p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="text-lg font-extrabold text-tutas-primary">R$ {{ Number(prod.base_price || 15).toFixed(2) }}</span>
              <button @click="openProductModal(prod)" class="bg-tutas-secondary hover:bg-tutas-secondary/90 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition">
                <ShoppingBag class="w-3.5 h-3.5" /> Opções & Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detalhes do Produto + Mockup Frente/Verso -->
    <div v-if="selectedProd" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 text-left relative overflow-hidden">
        <button @click="selectedProd = null" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold">✕</button>

        <h3 class="text-lg font-extrabold text-tutas-primary leading-tight">{{ selectedProd.name }}</h3>

        <!-- Mockup Visual Frente / Verso -->
        <div class="bg-slate-100 p-6 rounded-xl flex flex-col items-center justify-center relative">
          <div class="relative w-40 h-40 rounded-full shadow-xl border-4 border-slate-300 overflow-hidden flex items-center justify-center bg-white transition-all transform duration-300">
            <!-- Visão da Frente -->
            <img v-if="mockupSide === 'frente'" :src="selectedProd.image_url || '/logo.png'" class="w-full h-full object-cover" />
            
            <!-- Visão do Verso Metálico -->
            <div v-else class="w-full h-full bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 flex flex-col items-center justify-center p-2 text-center text-slate-700">
              <div class="text-[10px] font-extrabold uppercase mb-1">Verso Metálico</div>
              <div v-if="selectedFinish === 'alfinete'" class="text-xs font-bold bg-slate-200 px-2 py-1 rounded border border-slate-400">🧷 Alfinete de Segurança</div>
              <div v-else-if="selectedFinish === 'chaveiro'" class="text-xs font-bold bg-slate-200 px-2 py-1 rounded border border-slate-400">🔑 Chaveiro 2 Faces</div>
              <div v-else-if="selectedFinish === 'ima'" class="text-xs font-bold bg-slate-200 px-2 py-1 rounded border border-slate-400">🧲 Ímã de Geladeira</div>
            </div>
          </div>

          <!-- Botões Alternar Frente / Verso -->
          <div class="flex gap-2 mt-4">
            <button @click="mockupSide = 'frente'" :class="['px-3 py-1 rounded-lg text-xs font-bold', mockupSide === 'frente' ? 'bg-tutas-primary text-white' : 'bg-white border text-slate-600']">
              Frente (Estampa)
            </button>
            <button @click="mockupSide = 'verso'" :class="['px-3 py-1 rounded-lg text-xs font-bold', mockupSide === 'verso' ? 'bg-tutas-primary text-white' : 'bg-white border text-slate-600']">
              Verso (Acabamento)
            </button>
          </div>
        </div>

        <!-- Seleção de Tamanho -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Escolha o Diâmetro:</label>
          <div class="grid grid-cols-2 gap-2">
            <button @click="selectedDiameter = '25mm'" :class="['p-2 rounded-lg text-xs font-bold border transition', selectedDiameter === '25mm' ? 'border-tutas-secondary bg-cyan-50 text-tutas-primary' : 'border-slate-300 text-slate-600']">
              25mm (Pequeno)
            </button>
            <button @click="selectedDiameter = '38mm'" :class="['p-2 rounded-lg text-xs font-bold border transition', selectedDiameter === '38mm' ? 'border-tutas-secondary bg-cyan-50 text-tutas-primary' : 'border-slate-300 text-slate-600']">
              38mm (Médio / Padrão)
            </button>
          </div>
        </div>

        <!-- Seleção de Acabamento -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Escolha o Acabamento Trazeiro:</label>
          <div class="grid grid-cols-3 gap-2">
            <button @click="selectedFinish = 'alfinete'" :class="['p-2 rounded-lg text-[11px] font-bold border transition', selectedFinish === 'alfinete' ? 'border-tutas-secondary bg-cyan-50 text-tutas-primary' : 'border-slate-300 text-slate-600']">
              🧷 Alfinete
            </button>
            <button @click="selectedFinish = 'chaveiro'" :class="['p-2 rounded-lg text-[11px] font-bold border transition', selectedFinish === 'chaveiro' ? 'border-tutas-secondary bg-cyan-50 text-tutas-primary' : 'border-slate-300 text-slate-600']">
              🔑 Chaveiro
            </button>
            <button @click="selectedFinish = 'ima'" :class="['p-2 rounded-lg text-[11px] font-bold border transition', selectedFinish === 'ima' ? 'border-tutas-secondary bg-cyan-50 text-tutas-primary' : 'border-slate-300 text-slate-600']">
              🧲 Ímã
            </button>
          </div>
        </div>

        <!-- Adicionar -->
        <div class="pt-2 flex items-center justify-between border-t">
          <div>
            <span class="text-xs text-slate-500 block">Preço Final:</span>
            <span class="text-xl font-extrabold text-tutas-primary">R$ {{ Number(selectedProd.base_price || 15).toFixed(2) }}</span>
          </div>

          <button @click="confirmAddToCart" class="bg-tutas-secondary hover:bg-tutas-secondary/90 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1 shadow">
            <ShoppingBag class="w-4 h-4" /> Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Guia de Tamanhos -->
    <div v-if="showSizeGuide" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl text-center space-y-4 relative">
        <button @click="showSizeGuide = false" class="absolute top-4 right-4 text-slate-400 font-bold">✕</button>

        <h3 class="text-lg font-extrabold text-tutas-primary flex items-center justify-center gap-2">
          <Ruler class="w-5 h-5 text-tutas-secondary" /> Guia Comparativo de Tamanhos
        </h3>

        <div class="grid grid-cols-2 gap-4 py-4 border-y">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full border-2 border-tutas-primary flex items-center justify-center font-bold text-xs bg-cyan-50 text-tutas-primary">
              25mm
            </div>
            <span class="text-xs font-bold mt-2">2.5 cm (Moeda de R$ 0,50)</span>
            <span class="text-[10px] text-slate-500">Ideal para mochilas e crachás</span>
          </div>

          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full border-2 border-tutas-primary flex items-center justify-center font-bold text-sm bg-cyan-50 text-tutas-primary">
              38mm
            </div>
            <span class="text-xs font-bold mt-2">3.8 cm (Padrão Eventos)</span>
            <span class="text-[10px] text-slate-500">Ideal para destaque e eventos</span>
          </div>
        </div>

        <button @click="showSizeGuide = false" class="w-full bg-tutas-primary text-white font-bold py-2 rounded-lg text-xs">
          Entendi, Fechar Guia
        </button>
      </div>
    </div>

    <!-- Modal Carrinho & Checkout com Busca por WhatsApp -->
    <div v-if="showCartModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl text-left space-y-4 relative">
        <button @click="showCartModal = false" class="absolute top-4 right-4 text-slate-400 font-bold">✕</button>

        <h3 class="text-lg font-extrabold text-tutas-primary flex items-center gap-2">
          <ShoppingBag class="w-5 h-5 text-tutas-secondary" /> Meu Carrinho de Compras
        </h3>

        <!-- Lista de Itens -->
        <div v-if="cart.length === 0" class="text-center py-6 text-slate-400 text-xs font-bold">
          Seu carrinho está vazio.
        </div>

        <div v-else class="space-y-3 max-h-48 overflow-y-auto pr-1">
          <div v-for="(item, idx) in cart" :key="idx" class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <h4 class="font-bold text-slate-800">{{ item.product_name }}</h4>
              <span class="text-[10px] text-slate-500">{{ item.diameter }} - {{ item.finish }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold text-tutas-primary">R$ {{ Number(item.unit_price * item.quantity).toFixed(2) }}</span>
              <button @click="cart.splice(idx, 1)" class="text-rose-500 font-bold">✕</button>
            </div>
          </div>
        </div>

        <!-- Checkout Autopreenchimento WhatsApp -->
        <div v-if="cart.length > 0" class="pt-4 border-t space-y-3">
          <h4 class="font-bold text-xs text-tutas-primary flex items-center gap-1">
            <Search class="w-3.5 h-3.5 text-tutas-secondary" /> Autopreenchimento Rápido por WhatsApp
          </h4>

          <div class="flex gap-2">
            <input type="text" v-model="searchPhone" placeholder="Digite seu WhatsApp (Ex: 11999999999)" class="flex-1 px-3 py-1.5 text-xs border rounded-lg" />
            <button @click="handleSearchCustomer" class="bg-tutas-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              Buscar Dados
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <div>
              <label class="block text-[10px] font-bold text-slate-600">Seu Nome Completo</label>
              <input type="text" v-model="customerForm.name" required class="w-full px-2 py-1 text-xs border rounded" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-600">Seu WhatsApp</label>
              <input type="text" v-model="customerForm.phone" required class="w-full px-2 py-1 text-xs border rounded" />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t">
            <span class="text-sm font-extrabold text-tutas-primary">
              Total: R$ {{ cart.reduce((a, b) => a + (b.unit_price * b.quantity), 0).toFixed(2) }}
            </span>
            <button @click="handleCheckout" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow">
              Finalizar Pedido com Pix
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, Zap, Sparkles, ShoppingBag, Ruler, Search } from 'lucide-vue-next';

const router = useRouter();
const modo24h = ref(false);
const modoEvento24h = ref(false);
const heroPhrase = ref('Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem.');

const categories = ref([]);
const products = ref([]);
const rawStock = ref([]);
const selectedCategory = ref('all');

const selectedProd = ref(null);
const mockupSide = ref('frente');
const selectedDiameter = ref('38mm');
const selectedFinish = ref('alfinete');

const showSizeGuide = ref(false);
const showCartModal = ref(false);
const cart = ref([]);

const searchPhone = ref('');
const customerForm = ref({ name: '', phone: '', cpf: '' });

function goHome() { router.push('/'); }
function openAdmin() { router.push('/admin'); }

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') return products.value;
  return products.value.filter(p => p.category_id === selectedCategory.value);
});

function openProductModal(prod) {
  selectedProd.value = prod;
  mockupSide.value = 'frente';
  selectedDiameter.value = '38mm';
  selectedFinish.value = 'alfinete';
}

function confirmAddToCart() {
  if (!selectedProd.value) return;
  cart.value.push({
    product_id: selectedProd.value.id,
    product_name: selectedProd.value.name,
    diameter: selectedDiameter.value,
    finish: selectedFinish.value,
    quantity: 1,
    unit_price: selectedProd.value.base_price || 15.00
  });
  selectedProd.value = null;
  showCartModal.value = true;
}

async function handleSearchCustomer() {
  if (!searchPhone.value) return;
  try {
    const res = await fetch('/api/admin/customers');
    if (res.ok) {
      const customers = await res.json();
      const match = customers.find(c => c.phone.includes(searchPhone.value));
      if (match) {
        customerForm.value.name = match.name;
        customerForm.value.phone = match.phone;
        customerForm.value.cpf = match.cpf || '';
      } else {
        alert('Nenhum cadastro encontrado para este número. Preencha os dados abaixo.');
      }
    }
  } catch (err) { console.log(err); }
}

async function handleCheckout() {
  if (!customerForm.value.name || !customerForm.value.phone) {
    alert('Preencha seu Nome e Telefone para finalizar.');
    return;
  }

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: customerForm.value.name,
        customer_phone: customerForm.value.phone,
        customer_cpf: customerForm.value.cpf,
        items: cart.value
      })
    });
    if (res.ok) {
      alert('Pedido gerado com sucesso! Chave Pix Copia e Cola gerada.');
      cart.value = [];
      showCartModal.value = false;
    }
  } catch (err) { console.log(err); }
}

onMounted(async () => {
  try {
    const configRes = await fetch('/api/config');
    if (configRes.ok) {
      const configData = await configRes.json();
      modo24h.value = configData.modo_24h || false;
      modoEvento24h.value = configData.modo_evento_24h || false;
      if (configData.hero_phrase) heroPhrase.value = configData.hero_phrase;
    }

    const catRes = await fetch('/api/categories');
    if (catRes.ok) categories.value = await catRes.json();

    const prodRes = await fetch('/api/products');
    if (prodRes.ok) products.value = await prodRes.json();
  } catch (err) { console.log(err.message); }
});
</script>
