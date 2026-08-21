<template>
  <div class="min-h-screen flex flex-col">
    <!-- Banner Modo Evento 24h -->
    <div v-if="modo24h || modoEvento24h" class="bg-gradient-to-r from-tutas-primary to-tutas-secondary text-white py-2.5 px-4 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md">
      <Zap class="w-4 h-4 text-amber-300" />
      <span>⚡ MODO ENTREGA RÁPIDA 24h ATIVO: Produção Noturna & Postagem em até 24 Horas!</span>
    </div>

    <!-- Header Navbar Tailwind -->
    <header class="bg-tutas-primary text-white sticky top-0 z-40 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="goHome">
          <img src="/logo.png" alt="Tutas Paper" class="h-10 w-auto rounded-md shadow" />
          <div>
            <h1 class="font-extrabold text-lg leading-tight">Tuta's Paper</h1>
            <p class="text-xs text-tutas-secondary font-medium">Papelaria • Religiosos • Bottons</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button @click="openAdmin" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5 text-xs font-semibold">
            <Lock class="w-4 h-4 text-tutas-secondary" />
            <span class="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-tutas-dark to-tutas-primary text-white py-12 px-4 relative overflow-hidden">
      <div class="max-w-5xl mx-auto relative z-10">
        <span class="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full mb-4">
          <Sparkles class="w-3.5 h-3.5" />
          Catálogo & Linha Personalizada
        </span>

        <h2 class="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
          {{ heroPhrase }}
        </h2>

        <p class="text-slate-300 text-sm sm:text-base mb-6 max-w-2xl">
          Disponível nos diâmetros de <strong class="text-white">25mm</strong> e <strong class="text-white">38mm</strong> com acabamentos em <strong class="text-white">Alfinete, Chaveiro</strong> e <strong class="text-white">Ímã</strong>.
        </p>
      </div>
    </section>

    <!-- Catálogo de Produtos -->
    <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-extrabold text-tutas-primary">Catálogo de Produtos</h3>
          <p class="text-xs sm:text-sm text-slate-500">Escolha o produto desejado e finalize com pagamento transparente.</p>
        </div>
      </div>

      <!-- Grid de Produtos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="prod in products" :key="prod.id" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col">
          <div class="h-48 bg-slate-100 flex items-center justify-center p-4 relative">
            <img :src="prod.image_url || '/logo.png'" :alt="prod.name" class="max-h-full object-contain" />
            <span v-if="prod.is_limited_edition" class="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Edição Limitada ({{ prod.max_limit }} un)
            </span>
          </div>

          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-slate-800 mb-1 line-clamp-1">{{ prod.name }}</h4>
              <p class="text-xs text-slate-500 mb-3 line-clamp-2">{{ prod.description || 'Produto de alta qualidade Tuta\'s Paper.' }}</p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="text-lg font-extrabold text-tutas-primary">R$ {{ Number(prod.base_price || 15).toFixed(2) }}</span>
              <button @click="addToCart(prod)" class="bg-tutas-secondary hover:bg-tutas-secondary/90 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition">
                <ShoppingBag class="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-tutas-dark text-slate-400 text-xs py-8 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>© 2026 Tuta's Paper. Sistema Migrado para Python FastAPI + Vue 3 Tailwind CSS.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, Zap, Sparkles, ShoppingBag } from 'lucide-vue-next';

const router = useRouter();
const modo24h = ref(false);
const modoEvento24h = ref(false);
const heroPhrase = ref('Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem.');
const products = ref([]);

function goHome() {
  router.push('/');
}

function openAdmin() {
  router.push('/admin');
}

function addToCart(prod) {
  alert(`Item ${prod.name} adicionado ao carrinho!`);
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

    const prodRes = await fetch('/api/products');
    if (prodRes.ok) {
      products.value = await prodRes.json();
    }
  } catch (err) {
    console.log('Erro ao carregar dados da loja:', err.message);
  }
});
</script>
