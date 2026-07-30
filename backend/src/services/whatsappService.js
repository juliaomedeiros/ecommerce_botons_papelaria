const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'tutas_evolution_key';

// Fila FIFO em Memória para Proteção Anti-Ban no WhatsApp Meta
const messageQueue = [];
let isProcessingQueue = false;

/**
 * Enfileira mensagem de WhatsApp com Proteção Anti-Ban (Delay Humanizado de 5-15s + Digitando)
 * @param {string} phone 
 * @param {string} messageText 
 * @param {string} [mediaUrl] 
 */
function sendTextMessage(phone, messageText, mediaUrl = null) {
  return new Promise((resolve) => {
    messageQueue.push({ phone, messageText, mediaUrl, resolve });
    console.log(`📥 [WhatsApp Anti-Ban Queue] Mensagem enfileirada para ${phone}. Posição na fila: ${messageQueue.length}`);
    processQueue();
  });
}

async function processQueue() {
  if (isProcessingQueue || messageQueue.length === 0) return;
  isProcessingQueue = true;

  const currentItem = messageQueue.shift();
  const { phone, messageText, mediaUrl, resolve } = currentItem;
  const formattedPhone = phone.replace(/\D/g, '');

  console.log(`⚙️ [WhatsApp Anti-Ban Engine] Processando mensagem para ${formattedPhone}...`);

  try {
    // 1. Simulação de Digitação ("composing") por 2 a 4 segundos aleatórios
    const typingDuration = Math.floor(Math.random() * 2000) + 2000;
    try {
      await fetch(`${EVOLUTION_API_URL}/chat/sendPresence/tutaspaper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_API_KEY },
        body: JSON.stringify({ number: formattedPhone, presence: 'composing', delay: typingDuration })
      });
      await new Promise(r => setTimeout(r, typingDuration));
    } catch (presenceErr) {
      console.log('Aviso ao enviar sinal de presença digitando:', presenceErr.message);
    }

    // 2. Disparo da Mensagem via Evolution API v2
    let responseData = { success: true };
    if (process.env.NODE_ENV !== 'production' || !process.env.EVOLUTION_API_URL) {
      console.log(`📱 Simulação WhatsApp enviado para ${formattedPhone}: "${messageText.substring(0, 60)}..."`);
    } else {
      const endpoint = mediaUrl ? `${EVOLUTION_API_URL}/message/sendMedia/tutaspaper` : `${EVOLUTION_API_URL}/message/sendText/tutaspaper`;
      const bodyPayload = mediaUrl ? {
        number: formattedPhone,
        media: mediaUrl,
        mediatype: 'image',
        caption: messageText
      } : {
        number: formattedPhone,
        text: messageText
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        },
        body: JSON.stringify(bodyPayload)
      });

      responseData = await response.json();
    }

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
  sendTextMessage
};
