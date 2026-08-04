const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const customerController = require('./controllers/customerController');
const webhookController = require('./controllers/webhookController');
const configController = require('./controllers/configController');
const { verifyToken, requireRole } = require('./middlewares/authMiddleware');
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

// Rotas Protegidas de Administração (Admin e Funcionário)
app.get('/api/admin/customers', verifyToken, requireRole(['admin', 'funcionario']), customerController.getCustomers);
app.post('/api/admin/customers', verifyToken, requireRole(['admin', 'funcionario']), customerController.upsertCustomer);

app.post('/api/admin/categories', verifyToken, requireRole(['admin', 'funcionario']), productController.createCategory);
app.post('/api/admin/products', verifyToken, requireRole(['admin', 'funcionario']), productController.createProduct);
app.put('/api/admin/products/:id', verifyToken, requireRole(['admin', 'funcionario']), productController.updateProduct);
app.delete('/api/admin/products/:id', verifyToken, requireRole(['admin']), productController.deleteProduct);

app.get('/api/admin/production-queue', verifyToken, requireRole(['admin', 'funcionario']), orderController.getProductionQueue);
app.patch('/api/admin/orders/:id/production-status', verifyToken, requireRole(['admin', 'funcionario']), orderController.updateProductionStatus);

// Rota de Configurações Sensíveis (Exclusiva de Admin)
app.post('/api/admin/config', verifyToken, requireRole(['admin']), configController.updateConfig);

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
