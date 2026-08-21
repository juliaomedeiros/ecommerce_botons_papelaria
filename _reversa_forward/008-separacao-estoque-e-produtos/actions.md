# Actions: Separação do Cadastro de Estoque e Exibição de Produtos no Catálogo

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Roadmap: `_reversa_forward/008-separacao-estoque-e-produtos/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 8 |
| Concluídas | 8 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 5 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar a tabela `raw_materials_stock` e adicionar colunas `is_limited_edition` e `max_limit` na tabela `products` | - | `[//]` | `backend/src/database/migrations.js` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T002 | Criar `stockController.js` para endpoints GET e PUT `/api/admin/raw-materials-stock` de gestão de insumos físicos | T001 | `[//]` | `backend/src/controllers/stockController.js` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Ajustar `productController.js` para remover obrigatoriedade do campo `stock` e calcular disponibilidade por insumo | T001 | - | `backend/src/controllers/productController.js` | 🟢 | `[X]` |
| T004 | Atualizar `orderController.js` com baixa atômica de insumos centralizados na confirmação do pagamento | T001 | - | `backend/src/controllers/orderController.js` | 🟢 | `[X]` |
| T005 | Criar a aba "Cadastrar Estoques" no Painel Admin para gerenciamento dos saldos de insumos por diâmetro e acabamento | T002 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |
| T006 | Atualizar a modal de cadastro/edição de produtos no Admin removendo campo de estoque manual e inserindo opção de Edição Limitada | T003, T005 | - | `frontend/src/components/AdminDashboard.jsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Atualizar `Catalog.jsx` e `ProductDetailModal.jsx` com verificação de disponibilidade via insumos e limite de edição | T003, T006 | - | `frontend/src/components/Catalog.jsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Compilar bundle de produção Nginx via Docker e validar execução unificada dos contêineres | T004, T007 | `[//]` | `docker-compose.yml` | 🟢 | `[X]` |

## Notas de execução

Todas as 8 tarefas (T001-T008) foram implementadas com sucesso e validadas na compilação estática do Vite/Nginx.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-20 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-08-20 | Conclusão das tarefas T001-T008 por `/reversa-coding` | reversa |
