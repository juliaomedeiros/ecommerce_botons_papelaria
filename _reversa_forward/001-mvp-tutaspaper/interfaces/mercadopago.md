# Interface: Mercado Pago API & Webhooks

> Feature: `001-mvp-tutaspaper`
> Data: `2026-07-30`

## 1. Visão Geral
Integração com Mercado Pago para pagamentos transparentes via Pix e Cartão de Crédito com notificações assíncronas via Webhook.

## 2. Endpoints do Mercado Pago Utilizados

### 2.1 Criar Pagamento Pix (`POST /v1/payments`)
- **Headers:** `Authorization: Bearer <MERCADOPAGO_ACCESS_TOKEN>`
- **Payload:**
```json
{
  "transaction_amount": 45.00,
  "description": "Pedido Tuta's Paper - 5x 38mm Chaveiro",
  "payment_method_id": "pix",
  "payer": {
    "email": "cliente@email.com",
    "first_name": "Juliao",
    "last_name": "Cliente"
  }
}
```
- **Response Esperado:** `id` da transação, `qr_code` (base64) e `qr_code_base64`.

### 2.2 Recepção de Webhook (`POST /api/webhooks/mercadopago`)
- **Body:** `{ "type": "payment", "data": { "id": "123456789" } }`
- **Ação:** O backend busca o status atualizado da transação `/v1/payments/123456789` e, se `approved`, atualiza o pedido para `paid` e insere o item na Fila de Produção.
