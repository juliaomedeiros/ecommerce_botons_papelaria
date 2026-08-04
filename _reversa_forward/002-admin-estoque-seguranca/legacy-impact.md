# Legacy Impact: Feature 002 (Admin, Estoque, PDF, Clientes e Modo 24h)

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`
> Âncora: `_reversa_sdd/prd.md` + Specs SDD em `_reversa_sdd/sdd/`

## 1. Resumo de Impacto

Feature greenfield desenvolvida como expansão modular da plataforma Tuta's Paper. Todos os novos componentes foram mapeados diretamente às especificações SDD de Catálogo, Dashboard Admin, Checkout e Notificações WhatsApp.

| Arquivo afetado | Componente SDD Mapeado | Tipo | Severidade | Justificativa |
|-----------------|------------------------|------|------------|---------------|
| `backend/src/database/migrations.js` | `inventory-dashboard-admin.md` | delta-de-dados | LOW | Adição das tabelas `products`, `customers` e colunas `role`, `modo_24h`. |
| `backend/src/middlewares/authMiddleware.js` | `inventory-dashboard-admin.md` | componente-novo | MEDIUM | Middleware RBAC validando papéis `admin` e `funcionario`. |
| `backend/src/controllers/productController.js` | `inventory-dashboard-admin.md` | componente-novo | MEDIUM | CRUD de produtos, categorias, ajuste de preços e estoque com baixa automática. |
| `backend/src/controllers/customerController.js` | `inventory-dashboard-admin.md` | componente-novo | LOW | Cadastro e consulta de clientes compradores com endereço completo e CPF. |
| `backend/src/services/pdfService.js` | `checkout-payment-mp.md` | componente-novo | HIGH | Geração em memória do PDF de Pedido Timbrado (*MATERIAL CONSIGNADO TATI.pdf*). |
| `backend/src/services/whatsappService.js` | `notification-whatsapp-evolution.md` | componente-alterado | MEDIUM | Envio de documentos PDF pela Fila Anti-Ban no WhatsApp. |
| `backend/src/controllers/configController.js` | `inventory-dashboard-admin.md` | componente-alterado | LOW | Suporte às chaves `modo_24h`, `mp_environment` e `hero_phrase` dinâmica. |
| `frontend/src/components/AdminDashboard.jsx` | `inventory-dashboard-admin.md` | componente-alterado | MEDIUM | Inclusão das abas Produtos, Estoque, Clientes e Toggle Modo 24h. |
| `frontend/src/components/BottonPreviewModal.jsx` | `ecommerce-catalog-fastfood.md` | componente-novo | HIGH | Modal responsivo de personalização com auto-fit inicial e zoom flexível (0.1x a 5.0x). |
| `frontend/src/components/Catalog.jsx` | `ecommerce-catalog-fastfood.md` | componente-alterado | MEDIUM | Ocultamento de personalização quando Modo 24h está ativo. |

## 2. Seção "Preservadas"

Sem legado pré-existente alterado de forma destrutiva.

## 3. Seção "Modificadas"

- `Catalog.jsx`: Passou a aceitar a prop `isModo24h` para filtrar a exibição de personalização quando a entrega expressa está ativa.
- `server.js`: Novas rotas de produtos, clientes e controle RBAC integradas.
