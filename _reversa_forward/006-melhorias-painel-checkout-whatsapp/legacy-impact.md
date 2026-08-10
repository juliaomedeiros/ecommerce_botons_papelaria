# Legacy Impact: Feature 006 - Melhorias no Painel Admin, Checkout com Autopreenchimento WhatsApp e Notificações

> Identificador: `006-melhorias-painel-checkout-whatsapp`
> Data: `2026-08-10`

## 1. Mapeamento de Arquivos e Componentes Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `backend/src/controllers/configController.js` | `_reversa_sdd/architecture.md#backend` | contrato-novo | LOW | Adiciona consulta de status do WhatsApp via GET `/api/admin/whatsapp/status` |
| `backend/src/controllers/customerController.js` | `_reversa_sdd/architecture.md#backend` | contrato-novo | LOW | Adiciona busca de cliente por telefone via GET `/api/customers/lookup` |
| `backend/src/controllers/orderController.js` | `_reversa_sdd/architecture.md#backend` | regra-alterada | MEDIUM | Realiza upsert automático de clientes e dispara notificações para Admin e Cliente |
| `frontend/src/components/AdminDashboard.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | MEDIUM | Adiciona badge no Card do WhatsApp, botões independentes e remove Reset Demo |
| `frontend/src/components/Checkout.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | MEDIUM | Adiciona busca por WhatsApp com autopreenchimento de endereço no checkout |
| `frontend/src/components/Catalog.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | LOW | Força abertura da modal de opções ao clicar no card de bottons e remove botão duplicado |
| `frontend/src/components/ProductDetailModal.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | LOW | Torna as opções de diâmetro/acabamento condicionais à categoria Bottons |

## 2. Diff Conceitual por Componente

- **Backend Express:** Expandido com rotas seguras de verificação do Evolution Go e busca de cadastro por telefone. O controller de pedidos agora grava/atualiza clientes de forma transparente e aciona mensagens formatadas de recibo e alerta.
- **Frontend SPA (React):** O Painel Admin teve a aba de integrações descentralizada com botões de salvar individuais por card e badge de status do WhatsApp. O checkout foi aprimorado com consulta rápida por WhatsApp (reduzindo tempo de preenchimento para compras recorrentes). O catálogo foi ajustado para exigir seleção de tamanho/acabamento em bottons antes do carrinho.

## 3. Regras Preservadas

- `_reversa_sdd/domain.md#RN-01` — Cálculo de total de pedidos e itens
- `_reversa_sdd/domain.md#RN-02` — Fila noturna de impressão e crop circular 300DPI
- `_reversa_sdd/domain.md#RN-03` — Integração de pagamentos Mercado Pago Pix/Cartão

## 4. Regras Modificadas

- Cadastro e atualização de compradores agora ocorre automaticamente no fechamento do pedido via upsert no banco.
- Exibição de opções de botton em produtos gerais no modal de detalhes ocultada para não confundir outras categorias.
