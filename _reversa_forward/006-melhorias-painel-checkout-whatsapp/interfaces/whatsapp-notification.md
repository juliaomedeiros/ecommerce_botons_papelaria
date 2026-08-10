# Contrato: Notificações de Pedido via WhatsApp

> Identificador: `whatsapp-notification`  
> Protocolo: HTTP REST / Evolution Go  

## 1. Disparo de Alerta para o Admin / Produção

- **Endpoint Chamado Internamente:** `POST /message/sendText/tutaspaper`
- **Headers:** `{ "Content-Type": "application/json", "apikey": "tutas_evolution_key" }`
- **Payload:**
  ```json
  {
    "number": "83999998888",
    "text": "📦 *NOVO PEDIDO RECEBIDO - TUTA'S PAPER*\n\n*Cliente:* Maria Silva\n*WhatsApp:* 83988776655\n*Itens (2):*\n- 2x Botton Personalizado 38mm Alfinete\n*Total:* R$ 17,00\n*Endereço:* Rua das Flores, 123 - João Pessoa/PB"
  }
  ```

## 2. Disparo de Recibo para o Comprador / Cliente

- **Endpoint Chamado Internamente:** `POST /message/sendText/tutaspaper`
- **Headers:** `{ "Content-Type": "application/json", "apikey": "tutas_evolution_key" }`
- **Payload:**
  ```json
  {
    "number": "83988776655",
    "text": "🛍️ *TUTA'S PAPER - Confirmação do Pedido #1024*\n\nOlá Maria Silva! Seu pedido foi recebido com sucesso e já entrou em nossa fila de produção.\n\n*Resumo da Compra:*\n- 2x Botton Personalizado 38mm Alfinete (R$ 17,00)\n\n*Valor Total:* R$ 17,00\n*Endereço de Entrega:* Rua das Flores, 123 - João Pessoa/PB\n\nAgradecemos a sua preferência!"
  }
  ```
