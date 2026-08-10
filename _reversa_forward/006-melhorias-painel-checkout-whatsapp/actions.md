# Actions: Melhorias no Painel Admin, Checkout com Autopreenchimento WhatsApp e Notificações

> Identificador: `006-melhorias-painel-checkout-whatsapp`
> Data: `2026-08-10`
> Roadmap: `_reversa_forward/006-melhorias-painel-checkout-whatsapp/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 8 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 4 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Adicionar endpoint `GET /api/admin/whatsapp/status` no backend para checar status da instância Evolution Go | - | `[//]` | `backend/src/controllers/adminController.js` | 🟢 | `[X]` |
| T002 | Adicionar endpoint `GET /api/customers/lookup` no backend e `upsert` de clientes no `orderController.js` | - | `[//]` | `backend/src/controllers/customerController.js` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Atualizar `whatsappService.js` para formatar e disparar alertas de pedido duplos (Admin e Cliente) | T001 | - | `backend/src/services/whatsappService.js` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Atualizar `AdminDashboard.jsx` adicionando o badge no Card do WhatsApp, botões independentes por card e removendo o Reset Demo | T001 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T005 | Restringir o formulário de produtos no `AdminDashboard.jsx` exclusivamente ao upload de imagens locais do PC | T004 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T006 | Atualizar `CartModal.jsx` criando a busca por WhatsApp no topo do checkout e autopreenchimento de endereço | T002 | - | `frontend/src/components/Checkout.jsx` | 🟢 | `[X]` |
| T007 | Atualizar `Catalog.jsx` e `ProductDetailModal.jsx` para guia de tamanhos condicional e modal obrigatória em bottons | - | `[//]` | `frontend/src/components/Catalog.jsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Compilar bundle de produção Nginx via Docker e validar execução unificada dos contêineres | T003, T005, T006, T007 | - | `docker-compose.yml` | 🟢 | `[X]` |

## Fase 5, Polimento

N/A

## Notas de execução

Todas as 8 tarefas foram executadas com sucesso.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-10 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-08-10 | Execução concluída por `/reversa-coding` | reversa |
