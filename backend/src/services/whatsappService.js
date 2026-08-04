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
      console.log(`📱 Simulação WhatsApp enviado para ${formattedPhone}: "${(messageText || '').substring(0, 60)}..."`);
    } else {
      let endpoint = `${EVOLUTION_API_URL}/message/sendText/tutaspaper`;
      let bodyPayload = { number: formattedPhone, text: messageText };

      if (isDocument) {
        endpoint = `${EVOLUTION_API_URL}/message/sendMedia/tutaspaper`;
        bodyPayload = {
          number: formattedPhone,
          media: mediaUrl,
          mediatype: 'document',
          fileName: fileName || 'Pedido_TutasPaper.pdf',
          caption: messageText
        };
      } else if (mediaUrl) {
        endpoint = `${EVOLUTION_API_URL}/message/sendMedia/tutaspaper`;
        bodyPayload = {
          number: formattedPhone,
          media: mediaUrl,
          mediatype: 'image',
          caption: messageText
        };
      }

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
  sendTextMessage,
  sendPdfDocument
};
