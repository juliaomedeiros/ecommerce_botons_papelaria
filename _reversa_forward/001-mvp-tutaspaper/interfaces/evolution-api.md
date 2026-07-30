# Interface: Evolution API (WhatsApp Notifications)

> Feature: `001-mvp-tutaspaper`
> Data: `2026-07-30`

## 1. Visão Geral
Integração via cliente HTTP para disparo automatizado de notificações de WhatsApp aos clientes.

## 2. Endpoints da Evolution API Utilizados

### 2.1 Enviar Mensagem de Texto (`POST /message/sendText/{instance}`)
- **Headers:** `apikey: <EVOLUTION_API_KEY>`
- **Payload:**
```json
{
  "number": "5511999999999",
  "text": "Olá Juliao! Seu pedido #001 (5x 38mm Chaveiro) foi pago com sucesso e já entrou na nossa fila de produção! 🎨"
}
```

### 2.2 Enviar Mídia / Imagem (`POST /message/sendMedia/{instance}`)
- **Payload:**
```json
{
  "number": "5511999999999",
  "media": "https://tutaspapeis.com.br/uploads/cropped-001.png",
  "caption": "Seu botton ficou pronto! Pode passar para retirar na loja. 🛍️"
}
```
