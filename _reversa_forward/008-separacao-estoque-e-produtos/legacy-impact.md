# Legacy Impact: Separação do Cadastro de Estoque e Exibição de Produtos no Catálogo

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Âncora: `prd.md` + specs em `_reversa_sdd/sdd/`

## 1. Mapeamento de Arquivos Afetados

| Arquivo afetado | Componente nas Specs SDD | Tipo de impacto | Severidade | Justificativa |
|-----------------|--------------------------|-----------------|------------|---------------|
| `backend/src/database/migrations.js` | `inventory-dashboard-admin.md` | componente-novo | MEDIUM | Adição da tabela `raw_materials_stock` e campos `is_limited_edition` / `max_limit` em `products`. |
| `backend/src/controllers/stockController.js` | `inventory-dashboard-admin.md` | componente-novo | MEDIUM | Controller para gestão do estoque centralizado de insumos. |
| `backend/src/controllers/productController.js` | `ecommerce-catalog-fastfood.md` | componente-novo | LOW | Remoção da obrigatoriedade do estoque manual no cadastro de produtos. |
| `backend/src/controllers/orderController.js` | `checkout-payment-mp.md` | componente-novo | HIGH | Baixa atômica de insumos centralizados na aprovação do pedido. |
| `frontend/src/components/AdminDashboard.jsx` | `inventory-dashboard-admin.md` | componente-novo | MEDIUM | Nova aba "Cadastrar Estoques" e simplificação do form de cadastro de produtos. |
| `frontend/src/components/Catalog.jsx` | `ecommerce-catalog-fastfood.md` | componente-novo | LOW | Checagem de disponibilidade vinculada a edições limitadas e insumos. |

## 2. Diff Conceitual por Componente

- **Estoque de Insumos (Matéria-Prima):** Centralizado e desacoplado da criação de produtos no catálogo.
- **Cadastro de Produtos:** Formulário simplificado sem necessidade de digitação repetitiva de estoques por item.

## 3. Preservadas

*Feature greenfield / ancorada em SDD, sem regras de código legado para preservação.*

## 4. Modificadas

*Nenhuma regra legada modificada.*
