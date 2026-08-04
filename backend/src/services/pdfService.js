const PDFDocument = require('pdfkit');

/**
 * Gera o arquivo PDF de Pedido Timbrado no padrão oficial Tuta's Paper
 * @param {Object} orderDados - Objeto do pedido contendo id, cliente, itens e total
 * @returns {Promise<Buffer>} Buffer do arquivo PDF em memória
 */
function generateOrderPdfBuffer(orderData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // 1. Cabeçalho Timbrado Oficial
      doc
        .fillColor('#4A154B')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text("TUTA'S PAPER", 40, 40)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#666666')
        .text('Papelaria e Artigos Religiosos', 40, 68)
        .text('Instagram: @tutaspaper  |  WhatsApp: (83) 99985 3299', 40, 84)
        .text('Rua Principal, João Pessoa - PB', 40, 100);

      // Linha divisória timbrada
      doc
        .moveTo(40, 120)
        .lineTo(555, 120)
        .strokeColor('#4A154B')
        .lineWidth(2)
        .stroke();

      // 2. Informações do Pedido & Cliente
      const orderIdStr = orderData.id ? orderData.id.slice(-8).toUpperCase() : 'PENDENTE';
      const createdDate = orderData.created_at ? new Date(orderData.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#333333')
        .text(`COMPROVANTE DE PEDIDO #${orderIdStr}`, 40, 135)
        .fontSize(10)
        .font('Helvetica')
        .text(`Data do Pedido: ${createdDate}`, 40, 155)
        .text(`Cliente: ${orderData.customer_name || 'Cliente Noturno'}`, 40, 170)
        .text(`Telefone: ${orderData.customer_phone || orderData.checkout_phone || 'Não informado'}`, 40, 185)
        .text(`Prazo de Entrega: ${orderData.delivery_deadline || '24 horas'}`, 40, 200);

      // 3. Tabela de Itens
      const tableTop = 230;
      doc
        .fillColor('#F4F4F4')
        .rect(40, tableTop, 515, 25)
        .fill();

      doc
        .fillColor('#4A154B')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Item / Descrição', 50, tableTop + 7)
        .text('Qtd', 320, tableTop + 7)
        .text('Vlr Unit (R$)', 390, tableTop + 7)
        .text('Total (R$)', 480, tableTop + 7);

      let position = tableTop + 32;
      const items = orderData.items || [];

      if (items.length === 0) {
        doc
          .font('Helvetica')
          .fillColor('#333333')
          .fontSize(10)
          .text('1x Botton Personalizado / Item de Catálogo', 50, position)
          .text('1', 325, position)
          .text(parseFloat(orderData.total_amount || 0).toFixed(2), 395, position)
          .text(parseFloat(orderData.total_amount || 0).toFixed(2), 485, position);
        position += 20;
      } else {
        items.forEach(item => {
          const itemTitle = `${item.diameter || ''} ${item.finish_type || 'Botton'}`.trim() || 'Botton Tuta\'s Paper';
          const itemQty = item.quantity || 1;
          const unitPrice = parseFloat(item.unit_price || 0).toFixed(2);
          const totalPrice = parseFloat(item.total_price || (unitPrice * itemQty)).toFixed(2);

          doc
            .font('Helvetica')
            .fillColor('#333333')
            .fontSize(10)
            .text(itemTitle.slice(0, 35), 50, position)
            .text(String(itemQty), 325, position)
            .text(unitPrice, 395, position)
            .text(totalPrice, 485, position);

          position += 20;
        });
      }

      // Linha de fechamento da tabela
      doc
        .moveTo(40, position + 5)
        .lineTo(555, position + 5)
        .strokeColor('#CCCCCC')
        .lineWidth(1)
        .stroke();

      // 4. Resumo Financeiro
      const totalAmount = parseFloat(orderData.total_amount || 0).toFixed(2);
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#4A154B')
        .text(`VALOR TOTAL DO PEDIDO: R$ ${totalAmount}`, 40, position + 20);

      // 5. Rodapé Agradecimento
      doc
        .fontSize(9)
        .font('Helvetica-Oblique')
        .fillColor('#888888')
        .text('Obrigado por comprar na Tuta\'s Paper! Seu pedido está sendo preparado com todo carinho.', 40, 750, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateOrderPdfBuffer
};
