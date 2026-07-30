const db = require('../database/db');

// Memória local fallback caso o banco ainda esteja inicializando
let localStoreConfig = {
  modo_evento_24h: false,
  mercadopago_token: 'APP_USR-mock-token-mercadopago',
  evolution_api_url: 'http://localhost:8080',
  evolution_api_key: 'tutas_evolution_key',
  evolution_instance_name: 'tutaspaper'
};

// Obter configurações públicas e de integração da loja
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
    if (configMap.mercadopago_token) localStoreConfig.mercadopago_token = configMap.mercadopago_token;
    if (configMap.evolution_api_url) localStoreConfig.evolution_api_url = configMap.evolution_api_url;
    if (configMap.evolution_api_key) localStoreConfig.evolution_api_key = configMap.evolution_api_key;

    return res.json({
      modo_evento_24h: localStoreConfig.modo_evento_24h,
      default_delivery_days: 5,
      mercadopago_token: localStoreConfig.mercadopago_token,
      evolution_api_url: localStoreConfig.evolution_api_url,
      evolution_api_key: localStoreConfig.evolution_api_key,
      evolution_instance_name: localStoreConfig.evolution_instance_name,
      evolution_manager_url: `${localStoreConfig.evolution_api_url}/manager`
    });
  } catch (error) {
    console.error('Aviso ao consultar banco para config, usando fallback local:', error.message);
    return res.json({
      modo_evento_24h: localStoreConfig.modo_evento_24h,
      default_delivery_days: 5,
      mercadopago_token: localStoreConfig.mercadopago_token,
      evolution_api_url: localStoreConfig.evolution_api_url,
      evolution_api_key: localStoreConfig.evolution_api_key,
      evolution_instance_name: localStoreConfig.evolution_instance_name,
      evolution_manager_url: `${localStoreConfig.evolution_api_url}/manager`
    });
  }
}

// Atualizar Configurações Globais e Integrações (Admin)
async function updateConfig(req, res) {
  try {
    const { modo_evento_24h, mercadopago_token, evolution_api_url, evolution_api_key, evolution_instance_name } = req.body;

    if (modo_evento_24h !== undefined) {
      const isTrue = modo_evento_24h === true || modo_evento_24h === 'true';
      localStoreConfig.modo_evento_24h = isTrue;
      await db.query(`
        INSERT INTO store_config (key, value, updated_at) VALUES ('modo_evento_24h', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [isTrue ? 'true' : 'false']);
    }

    if (mercadopago_token) {
      localStoreConfig.mercadopago_token = mercadopago_token;
      await db.query(`
        INSERT INTO store_config (key, value, updated_at) VALUES ('mercadopago_token', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [mercadopago_token]);
    }

    if (evolution_api_url) {
      localStoreConfig.evolution_api_url = evolution_api_url;
      await db.query(`
        INSERT INTO store_config (key, value, updated_at) VALUES ('evolution_api_url', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [evolution_api_url]);
    }

    if (evolution_api_key) {
      localStoreConfig.evolution_api_key = evolution_api_key;
      await db.query(`
        INSERT INTO store_config (key, value, updated_at) VALUES ('evolution_api_key', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [evolution_api_key]);
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
      message: 'Configurações mantidas em memória local.'
    });
  }
}

module.exports = {
  getConfig,
  updateConfig
};
