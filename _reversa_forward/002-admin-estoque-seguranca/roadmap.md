# Roadmap: Evolução do Admin — Gestão de Produtos, Estoque, Dashboard, Perfis RBAC, Mercado Pago Sandbox/Prod, Segurança, Testes Automatizados, PDF Timbrado no WhatsApp, Gestão de Clientes e Modo 24h

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`
> Requirements: `_reversa_forward/002-admin-estoque-seguranca/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A feature 002 transforma o Painel Administrativo do Tuta's Paper em um hub de gestão completo. Ela implementa a gestão completa de produtos e estoque no banco PostgreSQL, reflete alterações instantaneamente na vitrine, calcula estatísticas financeiras no dashboard, introduz o controle de papéis RBAC (`admin` e `funcionario`), adiciona alternância Sandbox/Prod do Mercado Pago e insere a nova aba de Gestão de Clientes compradores. No e-commerce, implementa o gerador de PDF de Pedido Timbrado (no padrão oficial do layout *MATERIAL CONSIGNADO TATI.pdf*) disparado via Evolution API no WhatsApp informado no checkout, o **Modo 24h** (para bloquear personalização em entregas expressas e alterar a frase inicial) e o **Modal Responsivo Mobile** para o Canvas de personalização de bottons com zoom flexível de amplitude estendida (para fotos grandes ou pequenas).

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| I. Preservação de Contratos | As novas APIs administrativas e públicas respeitam os padrões de payload do backend Node/Express existentes. | Respeita |
| II. Segurança e Privacidade | Autenticação JWT com Hashing Bcrypt e papéis estritos RBAC protegendo relatórios financeiros. | Respeita |
| III. Experiência Mobile-First | O Modal de personalização de botton é otimizado para celulares com Canvas responsivo. | Respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Geração de PDF timbrado via `pdfkit` no backend Node.js | Alto desempenho (< 1.5s), geração pura em memória e reprodução fiel do layout timbrado oficial `MATERIAL CONSIGNADO TATI.pdf`. | HTML-to-PDF via Puppeteer (muito pesado para container Docker) | 🟢 |
| D-02 | Modal Responsivo Mobile (`BottonPreviewModal.jsx`) | Melhora a usabilidade em dispositivos móveis e isola o Canvas de enquadramento. | Rendereização inline na página do produto (ruim em telas de celular) | 🟢 |
| D-03 | Zoom flexível de amplitude estendida (0.1x a 5.0x) no Canvas | Aceita imagens de alta resolução (grandes) ou baixa resolução (pequenas), calculando o enquadramento *fit* inicial automático. | Limites fixos de zoom (travava em fotos de alta resolução como `sistemaejc2.png`) | 🟢 |
| D-04 | Tabela `customers` para cadastro de compradores | Armazena dados cadastrais completos (Nome, Telefone, Endereço com Rua/Bairro/Cidade/Estado/CEP e CPF opcional). | Gravar dados soltos apenas no histórico do pedido | 🟢 |
| D-05 | RBAC Granular (`admin` vs `funcionario`) | Protege faturamento e chaves Mercado Pago para `admin`, enquanto autoriza `funcionario` a ajustar preços e estoques. | Permissão única de leitura/escrita global | 🟢 |
| D-06 | Flag `modo_24h` na tabela `store_config` | Oculta personalização e ajusta frase da vitrine dinamicamente via chave seletora no Admin. | Flag hardcoded em código frontend | 🟢 |

## 4. Premissas

Nenhuma premissa pendente. Todas as dúvidas de negócio foram 100% esclarecidas no `/reversa-clarify`.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `backend/src/controllers/productController.js` | `_reversa_sdd/sdd/inventory-dashboard-admin.md` | componente-novo | CRUD de produtos, categorias, preços e estoque com baixa automática. |
| `backend/src/controllers/customerController.js` | `_reversa_sdd/sdd/inventory-dashboard-admin.md` | componente-novo | Listagem e cadastro de clientes compradores com endereço completo e CPF. |
| `backend/src/controllers/configController.js` | `_reversa_sdd/sdd/inventory-dashboard-admin.md` | contrato-alterado | Suporte ao toggle `modo_24h` e alternância `mp_environment` (Sandbox/Prod). |
| `backend/src/services/pdfService.js` | `_reversa_sdd/sdd/checkout-payment-mp.md` | componente-novo | Geração do PDF timbrado idêntico ao modelo oficial da empresa. |
| `backend/src/middlewares/authMiddleware.js` | `_reversa_sdd/sdd/inventory-dashboard-admin.md` | contrato-alterado | Validação de roles RBAC (`admin` e `funcionario`). |
| `frontend/src/components/AdminDashboard.jsx` | `_reversa_sdd/sdd/inventory-dashboard-admin.md` | componente-alterado | Adição das abas Produtos, Estoque, Clientes e Configurações (Modo 24h / MP). |
| `frontend/src/components/BottonPreviewModal.jsx` | `_reversa_sdd/sdd/ecommerce-catalog-fastfood.md` | componente-novo | Modal responsivo de personalização com slider de zoom flexível. |
| `frontend/src/components/Catalog.jsx` | `_reversa_sdd/sdd/ecommerce-catalog-fastfood.md` | componente-alterado | Ocultamento de personalização no Modo 24h e atualização dinâmica da frase inicial. |

## 6. Delta no modelo de dados

- Adição das tabelas `products`, `categories`, `customers` e extensão da tabela `store_config` com os campos `modo_24h` e `mp_environment`.
- Detalhe completo em: `_reversa_forward/002-admin-estoque-seguranca/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Admin & Store API | HTTP | `_reversa_forward/002-admin-estoque-seguranca/interfaces/admin-api.md` |
| PDF & WhatsApp Dispatcher | Fila / HTTP | `_reversa_forward/002-admin-estoque-seguranca/interfaces/pdf-whatsapp.md` |

## 8. Plano de migração

1. Executar a nova migration em `backend/src/database/migrations.js` adicionando `products`, `customers` e campos em `store_config`.
2. Rodar a suíte de testes automatizados (`npm test`) no backend para garantir que as rotas de produtos, baixa de estoque e auth RBAC estão blindadas.
3. Subir a stack atualizada via `docker-compose up -d --build`.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Geração de PDF exceder o tempo limite | Média | Baixa | Utilizar biblioteca nativa em memória `pdfkit` (sem dependência de navegador headless). |
| Imagem de alta resolução estourar memória no Canvas | Média | Média | Aplicar redimensionamento prévio do elemento Image do browser antes da renderização no Canvas. |
| Envio de WhatsApp falhar por número inválido | Baixa | Média | Validar formato do telefone no formulário de checkout antes de agendar na Fila Anti-Ban. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Testes de integração cobrindo estoque e login RBAC com 100% de sucesso
- [ ] PDF timbrado gerado e entregue com sucesso via WhatsApp
- [ ] Modal de personalização funcionando perfeitamente em telas móveis
- [ ] Toggle Modo 24h alternando a vitrine e a frase da loja corretamente

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-03 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
