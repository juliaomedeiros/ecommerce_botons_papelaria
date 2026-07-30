# Actions: MVP E-commerce de Bottons, Rota Admin e Evolution API WhatsApp

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`
> Roadmap: `_reversa_forward/001-mvp-tutaspaper/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 11 |
| Paralelizáveis (`[//]`) | 5 |
| Maior cadeia de dependência | 7 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Adicionar serviço contêinerizado `evolution-api` no `docker-compose.yml` exposto na porta 8080 | - | `[//]` | `docker-compose.yml` | 🟢 | `[X]` |
| T002 | Atualizar `backend/src/database/migrations.js` criando a tabela `store_config` e estendendo `orders` | - | `[//]` | `backend/src/database/migrations.js` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar Fila FIFO em Memória com Delay Humanizado (5-15s) e simulador 'composing' no `whatsappService.js` | T001 | - | `backend/src/services/whatsappService.js` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Atualizar `backend/src/controllers/configController.js` para persistir chaves de integração (Mercado Pago e Evolution API) | T002 | - | `backend/src/controllers/configController.js` | 🟢 | `[X]` |
| T005 | Configurar roteamento nativo `/admin` no `App.jsx` e suporte Nginx para URLs diretas | T004 | `[//]` | `frontend/src/App.jsx` | 🟢 | `[X]` |
| T006 | Atualizar `AdminDashboard.jsx` com a aba de Integrações (Mercado Pago + Evolution Manager link) | T005 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Garantir header limpo em `Navbar.jsx` e suporte ao botão de cadeado com atalho para o login do Admin | T005 | `[//]` | `frontend/src/components/Navbar.jsx` | 🟢 | `[X]` |
| T008 | Atualizar textos em `BottonPreviewCanvas.jsx` e `Catalog.jsx` para "Personalize com uma imagem" | T006 | `[//]` | `frontend/src/components/BottonPreviewCanvas.jsx` | 🟢 | `[X]` |
| T009 | Atualizar `Checkout.jsx` gravando o prazo real de entrega (`24 horas` ou `5 dias úteis`) | T006 | - | `frontend/src/components/Checkout.jsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Compilar bundle de produção frontend com `npx vite build` | T008, T009 | - | `frontend/package.json` | 🟢 | `[X]` |
| T011 | Reconstruir e subir toda a stack Docker contendo Frontend, Backend, PostgreSQL e Evolution API | T001, T010 | - | `docker-compose.yml` | 🟢 | `[X]` |

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-07-30 | Versão inicial gerada por `/reversa-to-do` | reversa-to-do |
| 2026-07-30 | 100% das 11 tarefas concluídas e validadas via `/reversa-coding` | reversa-coding |
