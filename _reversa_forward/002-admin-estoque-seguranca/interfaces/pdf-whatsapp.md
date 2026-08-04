# Contrato de Interface: Geração de PDF e Despacho no WhatsApp

> Identificador: `002-admin-estoque-seguranca`
> Contrato: `pdf-whatsapp`
> Tipo: Evento Interno / HTTP Evolution API

## 1. Fluxo de Disparo

```
[Mercado Pago Webhook: Approved]
          │
          ▼
[pdfService.generateOrderPdf(orderData)]
          │ (Buffer do PDF em memória)
          ▼
[whatsappService.enqueuePdfMessage({ phone, pdfBuffer, orderId })]
          │ (Fila Anti-Ban em Memória - Delay 5s-15s)
          ▼
[Evolution API: POST /message/sendMedia/tutaspaper]
```

## 2. Payload Enviado para a Evolution API

- **Endpoint**: `POST http://evolution-api:8080/message/sendMedia/tutaspaper`
- **Headers**: `apikey: <EVOLUTION_API_KEY>`
- **Request Body**:
```json
{
  "number": "5583999998888",
  "mediaMessage": {
    "mediatype": "document",
    "fileName": "Pedido_TutasPaper_001.pdf",
    "caption": "Olá! Aqui está o comprovante timbrado do seu pedido na Tuta's Paper. Agradecemos a preferência!",
    "media": "data:application/pdf;base64,JVBERi0xLjQ..."
  }
}
```
