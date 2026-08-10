# Roadmap: Melhorias no Painel Admin, Checkout com Autopreenchimento WhatsApp e Notificações

> Identificador: `006-melhorias-painel-checkout-whatsapp`
> Data: `2026-08-10`
> Requirements: `_reversa_forward/006-melhorias-painel-checkout-whatsapp/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A abordagem técnica implementa os 8 refinamentos como deltas pontuais e limpos sobre a stack conteinerizada do Tuta's Paper. O backend Express ganha novas rotas de consulta de status do WhatsApp (`GET /api/admin/whatsapp/status`) e busca de clientes por número (`GET /api/customers/lookup?phone=...`), além do `upsert` automático na criação de pedidos. O serviço de WhatsApp (`whatsappService.js`) é expandido para enviar disparos duplos (alerta de produção ao Admin e recibo legível ao Cliente). No frontend React (`AdminDashboard.jsx`, `CartModal.jsx`, `Catalog.jsx`, `ProductDetailModal.jsx`), atualizamos a experiência do usuário com isolamento de cartões na aba de integrações, busca destacada por WhatsApp no checkout sem exigência de senha, upload exclusivo de imagens locais do PC, e direcionamento automático para opções de bottons.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| I. Simplicidade & Fricção Zero no Checkout | Permite compra instantânea com autopreenchimento por WhatsApp | respeita |
| II. Segurança PCI-DSS | Transmite pagamentos via token seguro do Mercado Pago sem armazenar cartões | respeita |
| III. Isolamento Visual de Componentes | Organiza botões e indicadores dentro do próprio card da integração | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Exibir status do WhatsApp dentro do Card da Evolution API | Mantém a aba limpa sem poluir o topo com informações de um único serviço | Badge global no topo da aba | 🟢 |
| D-02 | Upload de produtos exclusivamente de arquivos do PC | Elimina inconsistências de URLs externas e quebras de imagens no Nginx | Permitir URL externa + upload | 🟢 |
| D-03 | Busca por WhatsApp no Checkout com autopreenchimento | Reduz fricção de cadastro e acelera compras de clientes recorrentes | Obrigar criação de senha ou abas complexas | 🟢 |
| D-04 | Upsert automático na tabela `customers` a cada pedido | Garante que compradores fiquem salvos no Admin independente de cadastro manual | Exigir cadastro prévio manual | 🟢 |
| D-05 | Botões independentes de Salvar/Editar por Card no Admin | Evita re-salvar todas as chaves ao alterar apenas um serviço e remove botão inutilizado de Reset | Botão único no rodapé da página | 🟢 |

## 4. Premissas

Nenhuma premissa sob dúvida. Todas as 8 regras foram definidas e validadas com o usuário.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `backend/src/controllers/adminController.js` | `_reversa_sdd/architecture.md#backend` | contrato-novo | Adiciona endpoint `GET /api/admin/whatsapp/status` |
| `backend/src/controllers/customerController.js` | `_reversa_sdd/architecture.md#backend` | contrato-novo | Adiciona endpoint `GET /api/customers/lookup` |
| `backend/src/controllers/orderController.js` | `_reversa_sdd/architecture.md#backend` | regra-alterada | Executa `upsertCustomer` e dispara notificações no WhatsApp do Admin e Cliente |
| `backend/src/services/whatsappService.js` | `_reversa_sdd/architecture.md#backend` | regra-alterada | Adiciona formatação de mensagens de alerta de pedido (Admin) e recibo (Cliente) |
| `frontend/src/components/AdminDashboard.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | Adiciona badge no card WhatsApp, botões independentes e remove reset demo |
| `frontend/src/components/CartModal.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | Adiciona caixa de busca rápida por WhatsApp e autopreenchimento de endereço |
| `frontend/src/components/Catalog.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | Altera clique no card de Bottons para abrir modal de opções e oculta Guia em outras categorias |
| `frontend/src/components/ProductDetailModal.jsx` | `_reversa_sdd/architecture.md#frontend` | componente-alterado | Exibe Guia de Tamanhos apenas em produtos da categoria Botton |

## 6. Delta no modelo de dados

- Adição de consulta otimizada por índice no campo `phone` / `whatsapp` da tabela `customers`.
- Garantia de que a tabela `orders` armazene os dados de endereço de entrega completos (`street`, `number`, `neighborhood`, `city`, `state`, `zip_code`, `complement`).
- Detalhe completo em: `_reversa_forward/006-melhorias-painel-checkout-whatsapp/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `whatsapp-notification` | HTTP / WhatsApp | `_reversa_forward/006-melhorias-painel-checkout-whatsapp/interfaces/whatsapp-notification.md` |
| `customer-lookup` | HTTP REST | `_reversa_forward/006-melhorias-painel-checkout-whatsapp/interfaces/customer-lookup.md` |

## 8. Plano de migração

1. Aplicar atualizações de rotas e controllers no backend (`orderController.js`, `adminController.js`, `customerController.js`).
2. Atualizar componentes React no frontend (`AdminDashboard.jsx`, `CartModal.jsx`, `Catalog.jsx`, `ProductDetailModal.jsx`).
3. Recompilar o bundle de produção Nginx (`docker compose up -d --build`).

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Telefone do WhatsApp sem formatação E.164 | Médio | Baixo | Sanitizar string removendo caracteres não numéricos antes de consultar/enviar |
| Imagem enviada com nome duplicado | Baixo | Baixo | Adicionar timestamp único no salvamento dos uploads |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Conexão e status do WhatsApp validados visualmente no card do Admin
- [ ] Autopreenchimento de checkout funcionando via busca de WhatsApp
- [ ] Mensagens de WhatsApp entregues com sucesso para Admin e Cliente
- [ ] Bundle de produção Docker compilado sem erros

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-10 | Versão inicial gerada por `/reversa-plan` | reversa |
