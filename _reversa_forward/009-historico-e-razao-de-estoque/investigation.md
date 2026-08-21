# Investigation: Livro Razão e Histórico de Movimentações de Estoque

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/009-historico-e-razao-de-estoque/`

## 1. Visão Geral da Pesquisa

A introdução de um **Livro Razão (Stock Ledger / Double-Entry Inventory Log)** resolve a perda de histórico decorrente de sobrescritas diretas no saldo.

No modelo de Livro Razão:
- O saldo final de um insumo físico é auditável por meio do somatório ou atualização com snapshot derivado de cada evento de movimentação.
- As entradas gravam o custo financeiro total pago nas matérias-primas.
- O histórico fornece métricas reais para o cálculo do **Custo da Mercadoria Vendida (CMV)** no Dashboard e monitoramento de desperdícios por perdas na prensa de bottons.

## 2. Padrões de Arquitetura Aplicados

- **Event Sourcing / Ledger Append-Only:** Todos os eventos que afetam o estoque (Entrada, Saída Venda, Perda Prensa, Ajuste) são imutáveis e chronologicamente ordenados.
- **Transactional Consistency:** Toda gravação no histórico e atualização de saldo em `raw_materials_stock` é executada de forma atômica no PostgreSQL.
