const db = require('../database/db');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const pdfService = require('../services/pdfService');
const whatsappService = require('../services/whatsappService');

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Criar Pedido com Geração de Crop Circular HD
async function createOrder(req, res) {
  try {
    const { customer_name, customer_email, customer_phone, payment_method, delivery_deadline, items } = req.body;

    if (!customer_name || !customer_phone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Dados do cliente e itens são obrigatórios.' });
    }

    const orderId = `ORD-${Date.now()}`;
    const deadline = delivery_deadline || '5 dias úteis';
    let totalAmount = 0;

    // Iniciar transação
    await db.query('BEGIN');

    // Processar cada item
    const processedItems = [];
    for (const item of items) {
      const { product_id, variation_id, diameter, finish_type, image_source, original_image_url, crop_data, quantity, unit_price } = item;
      
      const itemQty = parseInt(quantity) || 1;
      const itemUnitPrice = parseFloat(unit_price) || 5.00;
      const itemTotal = itemQty * itemUnitPrice;
      totalAmount += itemTotal;

      let croppedImageUrl = item.cropped_image_url || original_image_url || '';

      // Se houver dados de crop e imagem, gerar o PNG HD recortado
      if (crop_data && original_image_url) {
        try {
          const croppedFileName = `crop-${orderId}-${Date.now()}.png`;
          const outputPath = path.join(UPLOADS_DIR, croppedFileName);
          
          // Gerar PNG circular 300DPI no Canvas Backend
          const canvasSize = diameter === '38mm' ? 600 : 400;
          const canvas = createCanvas(canvasSize, canvasSize);
          const ctx = canvas.getContext('2d');

          // Mascara circular
          ctx.beginPath();
          ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          // Se for base64 ou url local, carregar a imagem
          if (original_image_url.startsWith('data:image')) {
            const base64Data = original_image_url.replace(/^data:image\/\w+;base64,/, '');
            const imgBuffer = Buffer.from(base64Data, 'base64');
            const img = await loadImage(imgBuffer);
            
            const scale = crop_data.scale || 1.0;
            const x = crop_data.x || 0;
            const y = crop_data.y || 0;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            const outBuffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, outBuffer);
            croppedImageUrl = `/uploads/${croppedFileName}`;
          }
        } catch (err) {
          console.error('Erro ao recortar imagem no backend:', err);
        }
      }

      // Baixa no estoque da variação se informada
      if (variation_id) {
        await db.query(`
          UPDATE product_variations
          SET stock_quantity = GREATEST(0, stock_quantity - $1)
          WHERE id = $2
        `, [itemQty, variation_id]);
      }

      processedItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        order_id: orderId,
        product_id: product_id || null,
        variation_id: variation_id || null,
        diameter: diameter || '38mm',
        finish_type: finish_type || 'alfinete',
        image_source: image_source || 'preset',
        original_image_url: original_image_url || '',
        cropped_image_url: croppedImageUrl,
        crop_data: JSON.stringify(crop_data || {}),
        quantity: itemQty,
        unit_price: itemUnitPrice,
        total_price: itemTotal
      });
    }

    // Inserir Pedido com delivery_deadline
    await db.query(`
      INSERT INTO orders (id, customer_name, customer_email, customer_phone, total_amount, payment_method, payment_status, production_status, delivery_deadline)
      VALUES ($1, $2, $3, $4, $5, $6, 'approved', 'pending', $7)
    `, [orderId, customer_name, customer_email || '', customer_phone, totalAmount, payment_method || 'pix', deadline]);

    // Inserir Itens do Pedido
    for (const pi of processedItems) {
      await db.query(`
        INSERT INTO order_items (id, order_id, product_id, variation_id, diameter, finish_type, image_source, original_image_url, cropped_image_url, crop_data, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [pi.id, pi.order_id, pi.product_id, pi.variation_id, pi.diameter, pi.finish_type, pi.image_source, pi.original_image_url, pi.cropped_image_url, pi.crop_data, pi.quantity, pi.unit_price, pi.total_price]);
    }

    await db.query('COMMIT');

    // Disparo assíncrono do PDF timbrado no WhatsApp informado no checkout
    try {
      const pdfBuffer = await pdfService.generateOrderPdfBuffer({
        id: orderId,
        customer_name,
        customer_phone,
        checkout_phone: customer_phone,
        total_amount: totalAmount,
        delivery_deadline: deadline,
        created_at: new Date(),
        items: processedItems
      });

      whatsappService.sendPdfDocument(
        customer_phone,
        pdfBuffer,
        `Pedido_TutasPaper_${orderId}.pdf`,
        `Olá, ${customer_name}! Agradecemos a preferência. Segue em anexo o comprovante timbrado do seu pedido #${orderId.slice(-8)}.`
      );
    } catch (pdfErr) {
      console.error('Aviso ao gerar/enviar PDF timbrado:', pdfErr.message);
    }

    return res.status(201).json({
      message: 'Pedido realizado com sucesso!',
      order: {
        id: orderId,
        customer_name,
        customer_phone,
        total_amount: totalAmount,
        payment_status: 'approved',
        production_status: 'pending',
        delivery_deadline: deadline,
        pix_copy_paste: `00020126580014BR.GOV.BCB.PIX0136tutaspaper-${orderId}5204000053039865405${totalAmount.toFixed(2)}5802BR5918Tuta's Paper6009Sao Paulo62070503***6304`
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ error: 'Erro interno ao criar pedido.' });
  }
}

// Fila Noturna de Produção para o Admin com Prazo de Entrega
async function getProductionQueue(req, res) {
  try {
    const queryText = `
      SELECT 
        o.id as order_id,
        o.customer_name,
        o.customer_phone,
        o.payment_status,
        o.production_status,
        COALESCE(o.delivery_deadline, '5 dias úteis') as delivery_deadline,
        o.created_at,
        i.id as item_id,
        i.diameter,
        i.finish_type,
        i.cropped_image_url,
        i.original_image_url,
        i.quantity
      FROM orders o
      JOIN order_items i ON o.id = i.order_id
      ORDER BY o.created_at DESC
    `;
    const result = await db.query(queryText);
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao carregar fila de produção:', error);
    return res.status(500).json({ error: 'Erro ao carregar fila de produção.' });
  }
}

// Atualizar Status de Produção (Admin)
async function updateProductionStatus(req, res) {
  try {
    const { id } = req.params;
    const { production_status } = req.body;

    if (!production_status) {
      return res.status(400).json({ error: 'Novo status de produção é obrigatório.' });
    }

    const result = await db.query(`
      UPDATE orders
      SET production_status = $1
      WHERE id = $2 RETURNING *
    `, [production_status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status de produção:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
}

module.exports = {
  createOrder,
  getProductionQueue,
  updateProductionStatus
};
