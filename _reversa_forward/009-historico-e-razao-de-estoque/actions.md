# Actions: Livro Razão e Histórico de Movimentações de Estoque (Estratégia A)

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Roadmap: `_reversa_forward/009-historico-e-razao-de-estoque/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 6 |
| Concluídas | 6 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 4 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar a tabela `stock_movements` e seus índices de consulta no PostgreSQL | - | `[//]` | `backend/src/database/migrations.js` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T002 | Implementar endpoints GET e POST `/api/admin/raw-materials-stock/movements` em `stockController.js` | T001 | `[//]` | `backend/src/controllers/stockController.js` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Atualizar `orderController.js` para registrar saídas `SAIDA_VENDA` no Livro Razão na confirmação de pagamentos | T001 | - | `backend/src/controllers/orderController.js` | 🟢 | `[X]` |
| T004 | Criar a modal "+ Repor Estoque / Registrar Compra" e "Registrar Perda" em `AdminDashboard.jsx` | T002 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T005 | Criar a aba e tabela de "Histórico de Movimentações" no Painel Admin | T002, T004 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T006 | Compilar o bundle de produção Nginx via Docker e validar execução unificada | T003, T005 | - | `docker-compose.yml` | 🟢 | `[X]` |

## Notas de execução

Todas as 6 tarefas (T001-T006) foram implementadas com sucesso e testadas no bundle de produção.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-20 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-08-20 | Conclusão das tarefas T001-T006 por `/reversa-coding` | reversa |
