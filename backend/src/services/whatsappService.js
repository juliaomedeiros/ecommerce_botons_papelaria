const db = require('../database/db');

// Fila FIFO em Memória para Proteção Anti-Ban no WhatsApp Meta
const messageQueue = [];
let isProcessingQueue = false;

/**
 * Consulta dinamicamente as configurações do WhatsApp no PostgreSQL e auto-detecta a instância conectada no Evolution Go
 */
async function getActiveEvolutionConfig() {
  let evoUrl = process.env.EVOLUTION_API_URL || 'http://tutaspaper_evolution_go:8080';
  let evoKey = process.env.EVOLUTION_API_KEY || 'tutas_evolution_key';
  let instanceName = 'tutaspaper';

  try {
    const res = await db.query("SELECT key, value FROM store_config WHERE key IN ('evolution_api_url', 'evolution_api_key', 'evolution_instance_name')");
    if (res.rows && res.rows.length > 0) {
      res.rows.forEach(r => {
        if (r.key === 'evolution_api_url' && r.value) evoUrl = r.value;
        if (r.key === 'evolution_api_key' && r.value) evoKey = r.value;
        if (r.key === 'evolution_instance_name' && r.value) instanceName = r.value;
      });
    }
  } catch (err) {
    console.log('Aviso ao consultar store_config para WhatsApp:', err.message);
  }

  // Tentar auto-detectar a instância conectada no Evolution Go
  try {
    const instRes = await fetch(`${evoUrl}/instance/all`, {
      headers: { 'apikey': evoKey }
    });
    if (instRes.ok) {
      const data = await instRes.json();
      const instances = data.data || [];
      const connectedInst = instances.find(i => i.connected === true) || instances.find(i => i.name === instanceName || i.id === instanceName) || instances[0];
      if (connectedInst) {
        instanceName = connectedInst.name || connectedInst.id || instanceName;
      }
    }
  } catch (err) {
    console.log('Aviso ao consultar /instance/all no Evolution Go:', err.message);
  }

  return { evoUrl, evoKey, instanceName };
}

/**
 * Enfileira mensagem de WhatsApp com Proteção Anti-Ban (Delay Humanizado de 5-15s + Digitando)
 * @param {string} phone 
 * @param {string} messageText 
 * @param {string} [mediaUrl] 
 */
function sendTextMessage(phone, messageText, mediaUrl) {
  return new Promise((resolve) => {
    messageQueue.push({ phone, messageText, mediaUrl, isDocument: false, resolve });
    console.log(`📥 [WhatsApp Anti-Ban Queue] Mensagem enfileirada para ${phone}. Posição na fila: ${messageQueue.length}`);
    processQueue();
  });
}

/**
 * Enfileira documento PDF no WhatsApp com Proteção Anti-Ban
 * @param {string} phone 
 * @param {Buffer|string} pdfBuffer 
 * @param {string} fileName 
 * @param {string} caption 
 */
function sendPdfDocument(phone, pdfBuffer, fileName = 'Pedido_TutasPaper.pdf', caption = '') {
  return new Promise((resolve) => {
    const base64Media = Buffer.isBuffer(pdfBuffer) ? `data:application/pdf;base64,${pdfBuffer.toString('base64')}` : pdfBuffer;
    messageQueue.push({ phone, messageText: caption, mediaUrl: base64Media, fileName, isDocument: true, resolve });
    console.log(`📥 [WhatsApp Anti-Ban Queue] PDF timbrado enfileirado para ${phone}. Posição na fila: ${messageQueue.length}`);
    processQueue();
  });
}

async function processQueue() {
  if (isProcessingQueue || messageQueue.length === 0) return;
  isProcessingQueue = true;

  const currentItem = messageQueue.shift();
  const { phone, messageText, mediaUrl, fileName, isDocument, resolve } = currentItem;
  const formattedPhone = phone.replace(/\D/g, '');

  console.log(`⚙️ [WhatsApp Anti-Ban Engine] Processando mensagem para ${formattedPhone}...`);

  try {
    const { evoUrl, evoKey, instanceName } = await getActiveEvolutionConfig();

    // 1. Simulação de Digitação ("composing") por 2 a 4 segundos aleatórios
    const typingDuration = Math.floor(Math.random() * 2000) + 2000;
    try {
      await fetch(`${evoUrl}/chat/sendPresence/${instanceName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': evoKey },
        body: JSON.stringify({ number: formattedPhone, presence: 'composing', delay: typingDuration })
      });
      await new Promise(r => setTimeout(r, typingDuration));
    } catch (presenceErr) {
      console.log('Aviso ao enviar sinal de presença digitando:', presenceErr.message);
    }

    // 2. Disparo da Mensagem via Evolution API
    let endpoint = `${evoUrl}/message/sendText/${instanceName}`;
    let bodyPayload = { number: formattedPhone, text: messageText };

    if (isDocument) {
      endpoint = `${evoUrl}/message/sendMedia/${instanceName}`;
      bodyPayload = {
        number: formattedPhone,
        media: mediaUrl,
        mediatype: 'document',
        fileName: fileName || 'Pedido_TutasPaper.pdf',
        caption: messageText
      };
    } else if (mediaUrl) {
      endpoint = `${evoUrl}/message/sendMedia/${instanceName}`;
      bodyPayload = {
        number: formattedPhone,
        media: mediaUrl,
        mediatype: 'image',
        caption: messageText
      };
    }

    console.log(`📡 [WhatsApp Engine] Disparando POST para ${endpoint} (Instância: ${instanceName})...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': evoKey
      },
      body: JSON.stringify(bodyPayload)
    });

    const responseData = await response.json();
    console.log(`✅ [WhatsApp Engine] Resposta Evolution (${response.status}):`, responseData);
    resolve(responseData);
  } catch (error) {
    console.error('Erro na fila WhatsApp Anti-Ban:', error.message);
    resolve({ success: false, error: error.message });
  } finally {
    // 3. Delay Humanizado Aleatório entre 5 e 15 segundos antes de processar o próximo item da fila
    const antiBanDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
    console.log(`⏳ [WhatsApp Anti-Ban Guard] Pausa de ${(antiBanDelay / 1000).toFixed(1)}s aplicada antes da próxima mensagem...`);
    
    setTimeout(() => {
      isProcessingQueue = false;
      processQueue();
    }, antiBanDelay);
  }
}

module.exports = {
  sendTextMessage,
  sendPdfDocument
};
