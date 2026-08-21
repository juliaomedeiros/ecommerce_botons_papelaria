# Regression Watch: Livro Razão e Histórico de Estoque

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`

## Watch Items

### W001: Consistência do Saldo vs Histórico de Movimentações
- **O que vigiar:** Garantir que nenhuma alteração manual de saldo ignore a gravação no Livro Razão `stock_movements`.
- **Como verificar:** Verificar se a soma das movimentações é equivalente ao saldo atual em `raw_materials_stock`.

### W002: Atribuição de Custo Unitário de Perdas
- **O que vigiar:** Ao lançar perda na prensa sem informar custo, garantir que o sistema encontre o último custo unitário da entrada do mesmo insumo.
