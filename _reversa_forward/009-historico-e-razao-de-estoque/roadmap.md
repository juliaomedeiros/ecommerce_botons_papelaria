# Roadmap: Livro Razão e Histórico de Movimentações de Estoque (Estratégia A)

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Requirements: `_reversa_forward/009-historico-e-razao-de-estoque/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

Esta feature introduz o **Livro Razão (Stock Ledger)** para o ecossistema Tuta's Paper:
1. **Banco de Dados:** Cria a tabela `stock_movements` no PostgreSQL.
2. **Backend (`stockController.js` & `orderController.js`):**
   - Endpoint `POST /api/admin/raw-materials-stock/movements` para registrar entradas de reposição de insumos (`ENTRADA`), perdas na prensa (`PERDA_PRENSA`) e ajustes.
   - Atualização de `deductStockForOrder` para gravar automaticamente a movimentação `SAIDA_VENDA` no momento da confirmação do pagamento.
   - Endpoint `GET /api/admin/raw-materials-stock/movements` para listagem e filtro do histórico.
3. **Frontend (`AdminDashboard.jsx`):**
   - Modal/Form **"+ Repor Estoque / Registrar Compra"** com quantidade, valor total pago, fornecedor e observação.
   - Modal **"Registrar Perda / Descarte"** para informar peças danificadas na montagem.
   - Nova aba/tabela **"Histórico de Movimentações"** com busca, badges e paginação.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Sem `principles.md` cadastrado | N/A | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Tabela `stock_movements` imutável (append-only) com transação SQL | Garante auditabilidade contábil e previne adulteração de histórico. | Sobrescrever dados na tabela de estoque. | 🟢 |
| D-02 | Cálculo automático de prejuízo em perdas de prensa com base no último custo unitário | Elimina necessidade de o administrador pesquisar preços antigos ao registrar peça danificada. | Exigir digitação manual do valor do prejuízo. | 🟢 |
| D-03 | Integração transparente no `orderController.js` para registrar saídas de vendas | Mantém o histórico sincronizado sem ação manual do usuário. | Exigir que o admin dê baixa manual no histórico após cada venda. | 🟢 |

## 4. Premissas

*Todas as dúvidas foram resolvidas na sessão `/reversa-clarify`. Nenhuma premissa pendente.*

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `migrations.js` | `backend/src/database/migrations.js` | regra-alterada | Criação da tabela `stock_movements`. |
| `stockController.js` | `backend/src/controllers/stockController.js` | componente-novo | Métodos de registro e consulta de movimentações de estoque no Livro Razão. |
| `orderController.js` | `backend/src/controllers/orderController.js` | regra-alterada | Inclusão da geração de `SAIDA_VENDA` na baixa de pedidos aprovados. |
| `AdminDashboard.jsx` | `frontend/src/components/AdminDashboard.jsx` | contrato-alterado | Modais de reposição/perda e aba "Histórico de Movimentações". |

## 6. Delta no modelo de dados

- Resumo das mudanças: Adição da tabela `stock_movements`.
- Detalhe completo em: `_reversa_forward/009-historico-e-razao-de-estoque/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Stock Movements API | HTTP | `_reversa_forward/009-historico-e-razao-de-estoque/interfaces/stock-movements-api.md` |

## 8. Plano de migração

1. Executar a migration SQL para criação da tabela `stock_movements`.
2. Atualizar o backend com os endpoints de movimentação e integração com `orderController.js`.
3. Atualizar o frontend no Admin com a nova modal de reposição e aba de Histórico.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Desincronia entre saldo de estoque e histórico de movimentações | Alto | Baixo | Utilização estrita de transações SQL (`BEGIN...COMMIT`) em todos os lançamentos. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Teste de reposição de estoque com gravação de movimentação validado
- [ ] Teste de saída por venda validado na aprovação de pagamento
- [ ] Build de produção Docker compilado sem erros

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-20 | Versão inicial gerada por `/reversa-plan` | reversa |
