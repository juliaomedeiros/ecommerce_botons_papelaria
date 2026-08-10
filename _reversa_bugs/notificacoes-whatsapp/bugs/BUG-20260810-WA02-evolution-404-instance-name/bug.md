---
id: BUG-20260810-WA02-evolution-404-instance-name
display_number: 9
title: Notificações do WhatsApp falham com HTTP 404 (instância tutaspaper fixa no whatsappService)
context: notificacoes-whatsapp
severity: high
priority: p0
status: resolved
phase: closure
created_at: 2026-08-10T17:02:00-03:00
updated_at: 2026-08-10T17:05:35-03:00
reporter: juliao
affected_code:
  - backend/src/services/whatsappService.js
  - backend/src/controllers/configController.js
  - backend/src/controllers/orderController.js
root_cause:
  state: confirmed
  description: O whatsappService.js realizava chamadas HTTP com a string da instância fixada em /tutaspaper. A API Evolution Go não encontrava a instância tutaspaper (pois o ID/nome ativo é dinâmico, ex. 67076b2d-edce-4f7f-8478-7c7eb38cc27d) e retornava HTTP 404.
traceability:
  spec_ref: _reversa_sdd/architecture.md#integraçoes
  code_ref: backend/src/services/whatsappService.js#L52
---

# BUG-009: Notificações do WhatsApp falham com HTTP 404 (instância tutaspaper fixa no whatsappService)

## 1. Descrição do Defeito

Ao concluir um pedido no e-commerce, o pedido entrava na fila de produção, porém nenhuma notificação via WhatsApp era entregue ao Admin nem ao Cliente. O log do Evolution Go exibia requisições `POST /message/sendText/tutaspaper` e `POST /message/sendMedia/tutaspaper` retornando **HTTP 404 Not Found**.

## 2. Passos para Reproduzir

1. Conectar uma instância no Evolution Go (ex.: via QR Code).
2. Concluir um pedido no e-commerce (`POST /api/orders`).
3. Verificar os logs do contêiner Evolution Go (`docker logs tutaspaper_evolution_go`).
4. Observar erros `404` para as rotas `/chat/sendPresence/tutaspaper`, `/message/sendText/tutaspaper` e `/message/sendMedia/tutaspaper`.

## 3. Causa Raiz Confirmada

O arquivo `backend/src/services/whatsappService.js` fazia chamadas à API da Evolution com URLs contendo a string fixa `/tutaspaper`. No entanto:
- O Evolution Go expõe rotas com a variável de instância `:instance` (por exemplo, `67076b2d-edce-4f7f-8478-7c7eb38cc27d`).
- Como a instância cadastrada/ativa no Evolution Go possui outro ID/nome, o Evolution Go retornava erro HTTP 404 (Not Found).

## 4. Plano de Solução

1. **Obtenção Dinâmica da Instância:** Criada a função `getActiveEvolutionConfig()` que lê as configurações salvas em `store_config` no PostgreSQL e consulta `GET /instance/all` no Evolution Go para auto-detectar o nome/ID da instância conectada.
2. **Remoção de String Fixa:** Substituída a rota fixa `/tutaspaper` pela variável `${instanceName}` em todos os disparos (`sendPresence`, `sendText`, `sendMedia`).
3. **Liberação de Envio Real:** Liberados os disparos em ambiente de contêiner.

## 5. Resolução

- **Veredito de Spec:** `spec-correta` (o envio automático e resiliente de notificações de pedido no WhatsApp utilizando a instância ativa configurada era a regra de negócio esperada).
- **Alterações Aplicadas:**
  - `CHG-001`: `backend/src/services/whatsappService.js` — Implementada a função `getActiveEvolutionConfig()` que busca a URL, chave de API e ID/nome da instância conectada dinamicamente, eliminando os erros 404 nas rotas do Evolution Go.
