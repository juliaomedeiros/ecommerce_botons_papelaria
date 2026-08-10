---
id: BUG-20260810-CFG1-persistencia-chaves-integracao
display_number: 10
title: Persistência no PostgreSQL e Trava de Edição (Bloqueado/Salvo vs Editar) para Chaves do Mercado Pago e Evolution API
context: integracoes-e-configuracoes
severity: high
priority: p0
status: resolved
phase: closure
resolution_kind: fixed
created_at: 2026-08-10T19:26:00-03:00
updated_at: 2026-08-10T19:33:00-03:00
reporter: juliao
affected_code:
  - backend/src/controllers/configController.js
  - backend/src/server.js
  - frontend/src/components/AdminDashboard.jsx
root_cause:
  state: confirmed
  description: O endpoint GET /api/config expunha chaves privadas e usava fallbacks mockados. Não existia o endpoint protegido GET /api/admin/config nem os estados no React (isEditingMp, isEditingEvo) para travar os campos em modo leitura desabilitado após a gravação.
traceability:
  spec_ref: _reversa_sdd/architecture.md#backend
  code_ref: backend/src/controllers/configController.js#L80
closure:
  satisfied: true
---

# BUG-010: Persistência no PostgreSQL e Trava de Edição para Chaves do Mercado Pago e Evolution API

## 1. Descrição do Defeito

Na aba **Integrações** do Painel Admin, ao preencher os campos do Mercado Pago (*Access Token*, *Public Key*, *Webhook Secret*) e da Evolution API (*URL*, *API Key*, *Nome da Instância*, *WhatsApp do Admin*), clicar em Salvar exibia a mensagem de sucesso, porém os campos não permaneciam desabilitados e protegidos (salvos) nos inputs.

## 2. Causa Raiz Confirmada

1. **`configController.js`:** O `getConfig` público expunha chaves privadas e não lia de forma sanitizada os dados reais gravados em `store_config`.
2. **`server.js`:** Faltava a rota `GET /api/admin/config` protegida por middleware JWT (`verifyToken`, `requireRole(['admin'])`).
3. **`AdminDashboard.jsx`:** Faltava a lógica de controle visual `isEditingMp` e `isEditingEvo` para desabilitar (`disabled={!isEditingMp}`) os inputs quando salvos e exibir o botão de desbloqueio sob demanda.

## 3. Resolução Aplicada (`FIXED`)

1. **`configController.js`:** Criado `getAdminConfig` para retornar 100% dos valores reais gravados na tabela `store_config` do PostgreSQL para requisições autenticadas de admin. Sanitizado o `getConfig` público para não expor tokens privados para usuários deslogados.
2. **`server.js`:** Registrada a rota `GET /api/admin/config`.
3. **`AdminDashboard.jsx`:**
   - Adicionados estados `isEditingMp` e `isEditingEvo`.
   - Adicionado atributo `disabled={!isEditingMp}` e `disabled={!isEditingEvo}` aos formulários.
   - Adicionados botões de alternância **"🔓 Editar Credenciais do Mercado Pago"** / **"💾 Salvar Mercado Pago no Banco"** e **"🔓 Editar Configurações do WhatsApp"** / **"💾 Salvar WhatsApp no Banco"**.
   - Ao salvar, os dados são gravados no PostgreSQL, o `fetchAdminConfig` recarrega as credenciais e os campos voltam automaticamente ao estado **trava/desabilitado protegidos**.
