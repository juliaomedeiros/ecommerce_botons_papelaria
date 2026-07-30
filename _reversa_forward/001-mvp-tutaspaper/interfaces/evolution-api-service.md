# Especificação de Contrato: Evolution API Service (WhatsApp)

> Identificador: `001-mvp-tutaspaper`
> Contrato: `Evolution API Client`

## Disparo de Mensagem Transacional

### `POST {EVOLUTION_API_URL}/message/sendText/{INSTANCE_NAME}`
Dispara mensagem de texto formatada contendo status do pedido e alerta de produção 24h.

**Headers:**
- `Content-Type: application/json`
- `apikey: {EVOLUTION_API_KEY}`

**Body:**
```json
{
  "number": "5511999999999",
  "text": "Olá Juliao! Seu pagamento para o pedido #ORD-12345 foi APROVADO! 🎉 Produção 24h iniciada."
}
```

### `POST {EVOLUTION_API_URL}/message/sendMedia/{INSTANCE_NAME}`
Dispara a foto recortada circular pronta para prensa.

**Body:**
```json
{
  "number": "5511999999999",
  "media": "data:image/png;base64,...",
  "mediatype": "image",
  "caption": "Arte recortada circular para a prensa - Pedido #ORD-12345"
}
```
