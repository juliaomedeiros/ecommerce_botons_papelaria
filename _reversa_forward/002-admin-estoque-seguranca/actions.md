# Actions: Evolução do Admin — Gestão de Produtos, Estoque, Dashboard, Perfis RBAC, Mercado Pago Sandbox/Prod, Segurança, Testes Automatizados, PDF Timbrado no WhatsApp, Gestão de Clientes e Modo 24h

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`
> Roadmap: `_reversa_forward/002-admin-estoque-seguranca/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 16 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 7 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Atualizar `backend/src/database/migrations.js` adicionando as tabelas `products` e `customers`, e estendendo `users`, `store_config` e `orders` | - | `[//]` | `backend/src/database/migrations.js` | 🟢 | `[X]` |
| T002 | Adicionar a biblioteca `pdfkit` nas dependências do `backend/package.json` | - | `[//]` | `backend/package.json` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar suíte de testes de integração em `backend/tests/products.test.js` para validação do cadastro de produtos e baixa automática de estoque | - | `[//]` | `backend/tests/products.test.js` | 🟢 | `[X]` |
| T004 | Criar suíte de testes de autorização RBAC em `backend/tests/rbac.test.js` cobrindo perfis `admin` e `funcionario` | - | `[//]` | `backend/tests/rbac.test.js` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Atualizar `backend/src/middlewares/authMiddleware.js` com o middleware `requireRole` para permissões `admin` e `funcionario` | T001 | - | `backend/src/middlewares/authMiddleware.js` | 🟢 | `[X]` |
| T006 | Criar `backend/src/controllers/productController.js` com CRUD de produtos, estoque e cálculo de baixa automática em vendas | T001, T005 | - | `backend/src/controllers/productController.js` | 🟢 | `[X]` |
| T007 | Criar `backend/src/controllers/customerController.js` para cadastro e listagem de compradores com endereço completo e CPF opcional | T001, T005 | - | `backend/src/controllers/customerController.js` | 🟢 | `[X]` |
| T008 | Criar `backend/src/services/pdfService.js` reproduzindo o layout timbrado oficial (*MATERIAL CONSIGNADO TATI.pdf*) em PDF puro via `pdfkit` | T002 | - | `backend/src/services/pdfService.js` | 🟢 | `[X]` |
| T009 | Atualizar `backend/src/controllers/configController.js` suportando o toggle `modo_24h` e a alternância `mp_environment` (Sandbox/Prod) | T001, T005 | - | `backend/src/controllers/configController.js` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Integrar o `pdfService.js` ao `backend/src/controllers/checkoutController.js` para disparar o PDF via WhatsApp Evolution API no telefone informado no checkout | T006, T008 | - | `backend/src/controllers/checkoutController.js` | 🟢 | `[X]` |
| T011 | Atualizar `backend/src/routes/api.js` mapeando endpoints de produtos, clientes, dashboard e configurações com as devidas roles de acesso | T006, T007, T009 | - | `backend/src/routes/api.js` | 🟢 | `[X]` |
| T012 | Atualizar `frontend/src/components/AdminDashboard.jsx` com as abas de Gestão de Produtos, Estoque, Clientes, Dashboard e Toggle Modo 24h | T011 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T013 | Criar `frontend/src/components/BottonPreviewModal.jsx` (Modal responsivo de personalização com auto-fit inicial e zoom flexível 0.1x a 5.0x) | T011 | - | `frontend/src/components/BottonPreviewModal.jsx` | 🟢 | `[X]` |
| T014 | Atualizar `frontend/src/components/Catalog.jsx` respeitando a flag `modo_24h` (ocultando personalização e trocando frase inicial) e abrindo o `BottonPreviewModal.jsx` | T012, T013 | - | `frontend/src/components/Catalog.jsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T015 | Compilar o bundle de produção do frontend executando `npx vite build` | T014 | - | `frontend/package.json` | 🟢 | `[X]` |
| T016 | Executar a suíte completa de testes automatizados e validar subida de toda a stack em `docker-compose.yml` | T003, T004, T015 | - | `docker-compose.yml` | 🟢 | `[X]` |

## Notas de execução

100% das 16 tarefas concluídas e validadas via `/reversa-coding`.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-03 | Versão inicial gerada por `/reversa-to-do` | reversa-to-do |
| 2026-08-03 | 100% das 16 tarefas concluídas e validadas | reversa-coding |
