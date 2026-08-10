# Impacto no Legado (Legacy Impact): Feature 007

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`

---

## 1. Mapeamento de Arquivos Tocados

| Arquivo Afetado | Componente | Tipo de Impacto | Severidade | Justificativa |
|-----------------|------------|-----------------|------------|---------------|
| `backend/src/controllers/productController.js` | Backend API | `regra-alterada` | MEDIUM | Anexo de `finish_type` e `allowed_diameters` na listagem `/api/products` |
| `backend/src/controllers/customerController.js` | Backend API | `regra-alterada` | LOW | Agregação dinâmica de `total_orders` e `last_order_at` na busca de clientes |
| `backend/src/controllers/orderController.js` | Backend API | `regra-alterada` | MEDIUM | Ordenação FIFO (`created_at ASC`) na Lista de Pedidos |
| `frontend/src/components/AdminDashboard.jsx` | Frontend Admin | `componente-novo` | MEDIUM | Interface de cadastro por acabamento único, diâmetros selecionáveis e renderização de clientes |
| `frontend/src/components/Catalog.jsx` | Frontend Catalog | `regra-nova` | LOW | Botões de filtro por acabamento de verso e repasse de `finishType` |
| `frontend/src/components/ProductDetailModal.jsx` | Frontend Modal | `regra-alterada` | LOW | Exibição dinâmica dos tamanhos habilitados e bloqueio de botões zerados no estoque |

---

## 2. Regras Preservadas 🟢

- `_reversa_sdd/domain.md#produtos` — Cadastro e persistência de imagens em Base64 no PostgreSQL.
- `_reversa_sdd/domain.md#estoque` — Dedução automática de estoque ao confirmar pagamentos PIX/Cartão.
- `_reversa_sdd/architecture.md#frontend` — Renderização visual do mockup 3D em `BottonMockupDisplay.jsx` com acetato e verso metálico.

---

## 3. Regras Modificadas 🟡

- `_reversa_sdd/domain.md#estoque` — Modificado o formulário do produto para vincular 1 acabamento único e os diâmetros selecionados via checkboxes, em vez de gerar todas as 6 combinações para cada estampa.
- `_reversa_sdd/architecture.md#frontend` — Renomeada a aba *Fila Noturna* para *Lista de Pedidos* com ordenação cronológica FIFO.
