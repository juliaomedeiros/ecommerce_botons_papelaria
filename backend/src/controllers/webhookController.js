const db = require('../database/db');
const whatsappService = require('../services/whatsappService');

async function handleMercadoPagoWebhook(req, res) {
  try {
    const { type, data } = req.body;
    console.log('🔔 Webhook Mercado Pago recebido:', type, data);

    if (type === 'payment' && data && data.id) {
      const paymentId = data.id;
      // Atualizar status do pedido para pago
      const orderResult = await db.query(`
        UPDATE orders
        SET payment_status = 'approved', mercadopago_payment_id = $1
        WHERE mercadopago_payment_id = $1 OR payment_status = 'pending'
        RETURNING *
      `, [paymentId]);

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0];
        console.log(`✅ Pedido ${order.id} aprovado via Webhook Mercado Pago!`);
        
        // Enviar WhatsApp de confirmação
        await whatsappService.sendTextMessage(
          order.customer_phone,
          `Olá ${order.customer_name}! Seu pagamento para o pedido #${order.id} foi APROVADO! 🎉 Já enviamos para nossa fila de produção noturna.`
        );
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no webhook Mercado Pago:', error);
    return res.status(500).json({ error: 'Erro interno ao processar webhook.' });
  }
}

module.exports = {
  handleMercadoPagoWebhook
};
