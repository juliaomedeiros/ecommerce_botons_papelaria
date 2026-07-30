const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const webhookController = require('./controllers/webhookController');
const configController = require('./controllers/configController');
const { runMigrations } = require('./database/migrations');
const { runSeed } = require('./database/seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos de uploads de mídia
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Rota de Healthcheck e Configurações da Loja
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tuta\'s Paper API em execução', time: new Date().toISOString() });
});
app.get('/api/config', configController.getConfig);

// Rotas de Autenticação Admin
app.post('/api/auth/login', authController.login);

// Rotas Públicas de E-commerce & Catálogo
app.get('/api/categories', productController.getCategories);
app.get('/api/products', productController.getProducts);
app.post('/api/orders', orderController.createOrder);

// Webhook Mercado Pago
app.post('/api/webhooks/mercadopago', webhookController.handleMercadoPagoWebhook);

// Rotas Protegidas de Administração
app.post('/api/admin/config', authController.verifyTokenMiddleware, configController.updateConfig);
app.post('/api/admin/categories', authController.verifyTokenMiddleware, productController.createCategory);
app.post('/api/admin/products', authController.verifyTokenMiddleware, productController.createProduct);
app.get('/api/admin/production-queue', authController.verifyTokenMiddleware, orderController.getProductionQueue);
app.patch('/api/admin/orders/:id/production-status', authController.verifyTokenMiddleware, orderController.updateProductionStatus);

async function startServer() {
  try {
    console.log('🚀 Inicializando Tuta\'s Paper Backend API...');
    await runMigrations();
    await runSeed();

    app.listen(PORT, () => {
      console.log(`🌐 Servidor API rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
