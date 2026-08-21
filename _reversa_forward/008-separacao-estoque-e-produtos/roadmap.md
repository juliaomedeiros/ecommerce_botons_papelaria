# Roadmap: Separação do Cadastro de Estoque e Exibição de Produtos no Catálogo

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Requirements: `_reversa_forward/008-separacao-estoque-e-produtos/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A solução separa fisicamente e conceitualmente a tabela de **Estoque de Insumos Físicos** (matéria-prima: diâmetros 25mm/38mm e acabamentos alfinete/chaveiro/ímã) da tabela de **Produtos do Catálogo**.
1. No Backend, criamos/refatoramos a gestão de saldo físico em `raw_materials_stock` estruturada por par **Diâmetro × Acabamento** (`25mm_alfinete`, `25mm_chaveiro`, `25mm_ima`, `38mm_alfinete`, `38mm_chaveiro`, `38mm_ima`). No cadastro de produtos (`products`), o estoque manual foi descontinuado para produtos padrão e mantido apenas como `max_limit` opcional para produtos do tipo "Edição Limitada".
2. No Admin (`AdminDashboard.jsx`), a aba "Cadastrar Estoques (Insumos)" centraliza a atualização das matérias-primas com feedback flutuante Toast reativo. O formulário de cadastro de produtos deixa de pedir saldo manual a cada item.
3. No fluxo de checkout/pagamento (`orderController.js`), a confirmação do pagamento dispara uma transação atômica que abate o saldo do insumo físico combinado correspondente e o limite individual do produto (caso configurado).

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Sem `principles.md` cadastrado | N/A | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Criar/Padronizar tabela central `raw_materials_stock` no Postgres | Garante fonte única da verdade para saldos físicos de bases de metal, acetatos e acabamentos. | Armazenar estoque duplicado em cada linha da tabela `products`. | 🟢 |
| D-02 | Tornar campo `stock` em `products` derivado e incluir `max_limit` opcional | Atende o requisito de Edição Limitada sem obrigar a digitação de estoque para produtos comuns. | Forçar todo produto a ter um valor arbitrário alto (ex: 9999) no campo stock. | 🟢 |
| D-03 | Baixa direta de estoque na transação SQL da webhook/aprovação de pagamento | Evita overselling e atende o esclarecimento de baixa pós-confirmação (sem trava temporária no carrinho). | Fila de reserva em Redis/memória com expiração por timer. | 🟢 |

## 4. Premissas

*Todas as dúvidas foram resolvidas na sessão `/reversa-clarify`. Nenhuma premissa pendente.*

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `productController.js` | `backend/src/controllers/productController.js` | regra-alterada | Cadastro de produto sem estoque obrigatório; cálculo dinâmico de disponibilidade por insumo. |
| `orderController.js` | `backend/src/controllers/orderController.js` | regra-alterada | Baixa atômica de insumos centralizados na confirmação do pagamento. |
| `stockController.js` | `backend/src/controllers/stockController.js` | componente-novo | Controller/endpoints dedicados para consulta e atualização de saldos de insumos físicos. |
| `AdminDashboard.jsx` | `frontend/src/components/AdminDashboard.jsx` | contrato-alterado | Aba isolada de Gestão de Estoques e simplificação da modal/form de cadastro de produtos. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Adição da tabela `raw_materials_stock` (se ainda não isolada) e alteração da tabela `products` para suporte a `max_limit` (INT nullable) e remoção da obrigatoriedade do campo `stock`.
- Detalhe completo em: `_reversa_forward/008-separacao-estoque-e-produtos/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Stock & Products API | HTTP | `_reversa_forward/008-separacao-estoque-e-produtos/interfaces/stock-and-products-api.md` |

## 8. Plano de migração

1. Executar a migration SQL adicionando a tabela `raw_materials_stock` e a coluna `max_limit` em `products`.
2. Executar script de inicialização para popular os insumos padrão (`25mm`, `38mm`, `alfinete`, `chaveiro`, `ima`) caso não existam.
3. Atualizar o backend para que a busca de produtos retorne disponibilidade calculada a partir do estoque de insumos.
4. Atualizar o frontend do Admin para renderizar a nova aba "Cadastrar Estoques" e o form simplificado de produtos.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Produtos legados cadastrados com estoque fixo entrarem em conflito com o novo modelo | Médio | Baixo | Migration converterá ou ignorará o campo `stock` legado em favor da checagem na tabela de insumos. |
| Concorrência de vendas no mesmo insumo em diâmetros populares (ex. 38mm) | Alto | Baixo | Utilização de transação SQL com `FOR UPDATE` na baixa do estoque durante a aprovação do pagamento. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Testes de fluxo de cadastro de produto sem estoque validados no Admin
- [ ] Testes de baixa de insumo físico validados na aprovação de pedido
- [ ] Build de produção Docker compilado sem erros

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-20 | Versão inicial gerada por `/reversa-plan` | reversa |
