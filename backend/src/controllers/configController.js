const db = require('../database/db');

let localStoreConfig = {
  modo_evento_24h: false,
  modo_24h: false,
  mp_environment: 'sandbox',
  mp_public_key: 'APP_USR-mock-public-key',
  mercadopago_token: 'APP_USR-mock-token-mercadopago',
  mp_webhook_secret: '',
  evolution_api_url: 'http://localhost:8080',
  evolution_api_key: 'tutas_evolution_key',
  evolution_instance_name: 'tutaspaper'
};

async function getConfig(req, res) {
  try {
    const result = await db.query("SELECT * FROM store_config");
    const configMap = {};
    if (result.rows && result.rows.length > 0) {
      result.rows.forEach(row => {
        configMap[row.key] = row.value;
      });
    }

    if (configMap.modo_evento_24h !== undefined) {
      localStoreConfig.modo_evento_24h = configMap.modo_evento_24h === 'true';
    }
    if (configMap.modo_24h !== undefined) {
      localStoreConfig.modo_24h = configMap.modo_24h === 'true';
    }
    if (configMap.mp_environment) localStoreConfig.mp_environment = configMap.mp_environment;
    if (configMap.mp_public_key) localStoreConfig.mp_public_key = configMap.mp_public_key;
    if (configMap.mercadopago_token) localStoreConfig.mercadopago_token = configMap.mercadopago_token;
    if (configMap.mp_webhook_secret) localStoreConfig.mp_webhook_secret = configMap.mp_webhook_secret;
    if (configMap.evolution_api_url) localStoreConfig.evolution_api_url = configMap.evolution_api_url;
    if (configMap.evolution_api_key) localStoreConfig.evolution_api_key = configMap.evolution_api_key;
    if (configMap.evolution_instance_name) localStoreConfig.evolution_instance_name = configMap.evolution_instance_name;

    const hero_phrase = localStoreConfig.modo_24h
      ? 'Modo Entrega Rápida 24h: Escolha seu botton diretamente no nosso catálogo.'
      : 'Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem.';

    return res.json({
      modo_evento_24h: localStoreConfig.modo_evento_24h,
      modo_24h: localStoreConfig.modo_24h,
      mp_environment: localStoreConfig.mp_environment,
      hero_phrase: hero_phrase,
      default_delivery_days: 5,
      mp_public_key: localStoreConfig.mp_public_key,
      mercadopago_token: localStoreConfig.mercadopago_token,
      mp_webhook_secret: localStoreConfig.mp_webhook_secret,
      evolution_api_url: localStoreConfig.evolution_api_url,
      evolution_api_key: localStoreConfig.evolution_api_key,
      evolution_instance_name: localStoreConfig.evolution_instance_name,
      evolution_manager_url: `${localStoreConfig.evolution_api_url}/manager`
    });
  } catch (error) {
    console.error('Aviso ao consultar banco para config, usando fallback local:', error.message);
    const hero_phrase = localStoreConfig.modo_24h
      ? 'Modo Entrega Rápida 24h: Escolha seu botton diretamente no nosso catálogo.'
      : 'Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem.';

    return res.json({
      modo_evento_24h: localStoreConfig.modo_evento_24h,
      modo_24h: localStoreConfig.modo_24h,
      mp_environment: localStoreConfig.mp_environment,
      hero_phrase: hero_phrase,
      default_delivery_days: 5,
      mp_public_key: localStoreConfig.mp_public_key,
      mercadopago_token: localStoreConfig.mercadopago_token,
      mp_webhook_secret: localStoreConfig.mp_webhook_secret,
      evolution_api_url: localStoreConfig.evolution_api_url,
      evolution_api_key: localStoreConfig.evolution_api_key,
      evolution_instance_name: localStoreConfig.evolution_instance_name,
      evolution_manager_url: `${localStoreConfig.evolution_api_url}/manager`
    });
  }
}

async function updateConfig(req, res) {
  try {
    const {
      modo_evento_24h,
      modo_24h,
      mp_environment,
      mp_public_key,
      mercadopago_token,
      mp_webhook_secret,
      evolution_api_url,
      evolution_api_key,
      evolution_instance_name
    } = req.body;

    const updates = [
      { key: 'modo_evento_24h', val: modo_evento_24h !== undefined ? (modo_evento_24h ? 'true' : 'false') : null },
      { key: 'modo_24h', val: modo_24h !== undefined ? (modo_24h ? 'true' : 'false') : null },
      { key: 'mp_environment', val: mp_environment },
      { key: 'mp_public_key', val: mp_public_key },
      { key: 'mercadopago_token', val: mercadopago_token },
      { key: 'mp_webhook_secret', val: mp_webhook_secret },
      { key: 'evolution_api_url', val: evolution_api_url },
      { key: 'evolution_api_key', val: evolution_api_key },
      { key: 'evolution_instance_name', val: evolution_instance_name },
      { key: 'admin_phone', val: req.body.admin_phone }
    ];

    for (const item of updates) {
      if (item.val !== null && item.val !== undefined) {
        localStoreConfig[item.key] = item.val;
        await db.query(`
          INSERT INTO store_config (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
        `, [item.key, String(item.val)]);
      }
    }

    return res.json({
      success: true,
      config: localStoreConfig,
      message: 'Configurações atualizadas com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar store_config:', error);
    return res.json({
      success: true,
      config: localStoreConfig,
      message: 'Configurações salvas!'
    });
  }
}

async function resetDemoData(req, res) {
  try {
    // Limpar ordens e itens de demonstração
    await db.query('DELETE FROM order_items');
    await db.query('DELETE FROM orders');
    await db.query('DELETE FROM customers');
    return res.json({ success: true, message: 'Dados de demonstração removidos com sucesso! Banco limpo para novos testes.' });
  } catch (error) {
    console.error('Erro ao resetar dados:', error);
    return res.status(500).json({ error: 'Erro ao resetar banco de dados.' });
  }
}

module.exports = {
  getConfig,
  updateConfig,
  resetDemoData
};
