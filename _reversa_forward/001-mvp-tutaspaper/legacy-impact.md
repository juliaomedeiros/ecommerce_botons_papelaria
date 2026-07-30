# Impacto no Legado / Greenfield (Legacy Impact)

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`
> Âncora de contexto: Greenfield (`_reversa_sdd/prd.md` e specs em `_reversa_sdd/sdd/`)

## 1. Mapeamento de Arquivos e Componentes

Feature greenfield, sem legado pré-existente. Âncora: `prd.md` + specs SDD.

| Arquivo afetado | Componente | Tipo de impacto | Severidade | Justificativa |
|-----------------|------------|-----------------|------------|---------------|
| `backend/src/database/migrations.js` | Database Schema | delta-de-dados | LOW | Inclusão da tabela `store_config` e coluna `delivery_deadline` em `orders`. |
| `backend/src/controllers/configController.js` | Store Config API | componente-novo | LOW | Novo controller para consulta e gestão da flag Modo Evento. |
| `backend/src/controllers/orderController.js` | Orders API | regra-alterada | LOW | Registro do prazo de entrega (`delivery_deadline`) no pedido e retorno na fila do Admin. |
| `backend/src/server.js` | Express Router | delta-de-contrato-externo | LOW | Registro de rotas públicas `/api/config` e protegidas `/api/admin/config`. |
| `frontend/src/App.jsx` | App Root | regra-alterada | LOW | Reatividade do Modo Evento (Hero dinâmico, Banners de evento e badges). |
| `frontend/src/components/Navbar.jsx` | Header | regra-alterada | LOW | Botões destacados para Personalizador com Foto e Guia de Tamanhos. |
| `frontend/src/components/Catalog.jsx` | Store Catalog | regra-alterada | LOW | Exibição de tags 24h apenas quando o Modo Evento estiver ativo. |
| `frontend/src/components/SizeGuideModal.jsx` | Size Guide | regra-alterada | LOW | Interceptador de fluxo com confirmação *"Entendi, escolher meu botton"*. |
| `frontend/src/components/BottonPreviewCanvas.jsx` | Canvas Customizer | regra-alterada | LOW | Instruções visuais, slider de zoom ampliado (`0.2x` a `3.0x`) e exportação do crop redondo. |
| `frontend/src/components/AdminDashboard.jsx` | Admin Panel | componente-novo | LOW | Toggle do Modo Evento 24h e tabela de pedidos com imagens e prazo. |
| `frontend/src/components/Checkout.jsx` | Checkout Payment | regra-alterada | LOW | Exibição e envio do prazo real de entrega. |

## 2. Preservadas

Feature greenfield, sem legado pré-existente.

## 3. Modificadas

Feature greenfield, sem legado pré-existente.
