# Actions: Reestruturação do Estoque de Bottons, Catálogo, Clientes e Dashboard

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`
> Roadmap: `_reversa_forward/007-reestruturacao-estoque-bottons-pedidos-dashboard/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 8 |
| Concluídas | 8 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 4 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Ajustar `productController.js` para cadastro por acabamento único e diâmetros selecionados | - | `[//]` | `backend/src/controllers/productController.js` | 🟢 | `[X]` |
| T002 | Ajustar `customerController.js` para retornar a lista completa de clientes cadastrados | - | `[//]` | `backend/src/controllers/customerController.js` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Atualizar `orderController.js` com ordenação FIFO na Lista de Pedidos e métricas SQL no Dashboard | - | `[//]` | `backend/src/controllers/orderController.js` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Atualizar formulário de Estoque de Bottons em `AdminDashboard.jsx` por acabamento e diâmetro | T001 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T005 | Atualizar formulário de Cadastro de Produto no Admin com acabamento único e diâmetros habilitados | T004 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T006 | Renderizar tabela de Clientes Compradores e renomear Fila Noturna para Lista de Pedidos (FIFO) | T002, T003 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Atualizar `Catalog.jsx` e `ProductDetailModal.jsx` com filtros por acabamento e diâmetros condicionais | T005 | - | `frontend/src/components/Catalog.jsx` | 🟢 | `[X]` |
| T008 | Compilar bundle de produção Nginx via Docker e validar execução unificada dos contêineres | T006, T007 | - | `docker-compose.yml` | 🟢 | `[X]` |

## Fase 5, Polimento

N/A

## Notas de execução

Todas as 8 tarefas foram executadas e validadas no build de produção do Docker.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-10 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-08-10 | Conclusão das tarefas T001-T008 por `/reversa-coding` | reversa |
