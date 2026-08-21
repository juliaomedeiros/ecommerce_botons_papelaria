import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import StoreView from './views/StoreView.vue';
import AdminView from './views/AdminView.vue';
import './assets/main.css';

const routes = [
  { path: '/', component: StoreView },
  { path: '/admin', component: AdminView },
  { path: '/carrinho', component: StoreView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
