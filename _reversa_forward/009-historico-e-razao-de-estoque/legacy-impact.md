# Legacy Impact: Livro Razão e Histórico de Estoque

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/009-historico-e-razao-de-estoque/`

## 1. Modificações em Arquivos Existentes

| Arquivo | Mudança Realizada | Risco | Mitigação |
|---------|-------------------|-------|-----------|
| `backend/src/database/migrations.js` | Tabela `stock_movements` e índices. | Baixo | `CREATE TABLE IF NOT EXISTS` |
| `backend/src/controllers/stockController.js` | Métodos `createStockMovement` e `getStockMovements`. | Baixo | Uso de transações SQL com `BEGIN...COMMIT` |
| `backend/src/controllers/orderController.js` | Gravação automática de `SAIDA_VENDA` no Livro Razão ao aprovar pagamentos. | Baixo | Transação de baixa protegida contra chamadas duplicadas |
| `frontend/src/components/AdminDashboard.jsx` | Modais `+ Registrar Entrada`, `Registrar Perda` e aba `Histórico de Movimentações`. | Baixo | Renderização condicional por aba |
