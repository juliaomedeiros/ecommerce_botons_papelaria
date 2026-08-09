# Actions: Validação de Limites de Estoque, Edição Bloqueada via Lápis e Regras de Disponibilidade

> Identificador: `004-estoque-validacoes-e-edicao`
> Data: `2026-08-09`

| ID | Descrição | Status |
|----|-----------|--------|
| T001 | Adicionar validação no backend (`productController.js`) garantindo `max_limit_per_order <= stock_quantity` | `[X]` |
| T002 | Atualizar `orderController.js` para garantir o abatimento do `products.stock_quantity` no checkout | `[X]` |
| T003 | Atualizar `AdminDashboard.jsx` com validação de limite no formulário, campos de tabela bloqueados por padrão e botão de Lápis ✏️ para edição | `[X]` |
| T004 | Adicionar badges de alerta no Admin (`⚠️ Renovar Estoque` e `🚫 Indisponível (Estoque Crítico)`) | `[X]` |
| T005 | Atualizar `Catalog.jsx` e `ProductDetailModal.jsx` bloqueando venda quando estoque for insuficiente ou menor/igual ao limite | `[X]` |
| T006 | Compilar o bundle de produção e verificar execução | `[X]` |
| T007 | Adicionar o botão de Excluir 🗑️ (`handleDeleteProduct`) na coluna de Ação da tabela de produtos do Admin | `[X]` |
