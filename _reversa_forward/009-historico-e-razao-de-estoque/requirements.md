# Requirements: Livro Razão e Histórico de Movimentações de Estoque (Estratégia A)

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Esta feature implementa a **Estratégia A (Livro Razão / Stock Ledger)** para a gestão de matérias-primas da Tuta's Paper. Em vez de edições numéricas soltas no banco, toda alteração de estoque (compras de fornecedores, saídas por vendas, perdas em prensa e ajustes) é gravada como uma movimentação imutável na tabela `stock_movements`. O administrador ganha a modal de **"Registrar Entrada de Insumo"** (com quantidade, valor pago e fornecedor) e uma aba de **"Histórico & Razão de Estoque"** totalmente auditável com cálculo automático do Custo da Mercadoria Vendida (CMV) e prejuízo de perdas.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/addenda/008-separacao-estoque-e-produtos.md#1.-Resumo-da-entrega` | Estoque central por insumo combinado (`25mm_alfinete`, `38mm_alfinete`, etc.) | 🟢 |
| `_reversa_sdd/prd.md#1.-Problema` | Incerteza quanto ao faturamento, custos e lucros líquidos | 🟢 |
| `_reversa_sdd/prd.md#4.-Escopo-(in)` | Dashboard Financeiro e Operacional com custo de insumos | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Administrador / Proprietário | Registrar nova compra de insumos do fornecedor | O administrador clica em "+ Registrar Entrada", seleciona o insumo "Botton 38mm - Alfinete", digita a quantidade (ex: 500 un) e o valor pago (ex: R$ 150,00). O saldo é incrementado e a movimentação gravada. |
| Administrador / Proprietário | Auditar o consumo e movimentação de estoque | O administrador acessa a aba "Histórico de Estoque" e visualiza todas as entradas, saídas por vendas e eventuais perdas com data, hora e observações. |
| Administrador / Proprietário | Registrar descarte/perda de peça danificada na prensa | O administrador seleciona o insumo "Botton 25mm - Chaveiro", escolhe "Perda em Produção" e informa 3 peças danificadas. O prejuízo é calculado automaticamente com base na última compra. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Toda alteração no saldo de qualquer insumo da tabela `raw_materials_stock` gera obrigatoriamente um registro imutável em `stock_movements` com `type` (ENTRADA, SAIDA_VENDA, PERDA_PRENSA, AJUSTE), quantidade, saldo anterior, saldo resultante e timestamp. 🟢
   - Origem no legado: `_reversa_sdd/addenda/008-separacao-estoque-e-produtos.md`
   - Tipo: nova
2. **RN-02:** A compra de matéria-prima é registrada via modal "+ Registrar Entrada", permitindo informar a quantidade comprada, valor total pago (custo) e fornecedor/nota. 🟢
   - Origem no legado: N/A
   - Tipo: nova
3. **RN-03:** As vendas aprovadas no e-commerce registram automaticamente linhas do tipo `SAIDA_VENDA` em `stock_movements` vinculadas ao `order_id` correspondente. 🟢
   - Origem no legado: `_reversa_sdd/addenda/008-separacao-estoque-e-produtos.md`
   - Tipo: alterada
4. **RN-04:** Registros em `stock_movements` são imutáveis (append-only). Erros de lançamento são corrigidos através de novos lançamentos de estorno/ajuste. 🟢
   - Origem no legado: N/A
   - Tipo: nova
5. **RN-05:** Os valores pagos lançados nas entradas alimentam o cálculo automático do Custo da Mercadoria Vendida (CMV) e valorização monetária do estoque no Dashboard. 🟢
   - Origem no legado: `_reversa_sdd/prd.md#4.-Escopo-(in)`
   - Tipo: nova
6. **RN-06:** O prejuízo financeiro das perdas em prensa é calculado automaticamente com base no preço unitário da última compra realizada daquele insumo. 🟢
   - Origem no legado: N/A
   - Tipo: nova

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar a tabela `stock_movements` no PostgreSQL para armazenar o livro razão de movimentações. | Must | Tabela criada com chave primária, tipo de movimentação, referência do insumo, quantidades, custo total e observação. | 🟢 |
| RF-02 | Criar a modal e o endpoint `POST /api/admin/raw-materials-stock/movement` para registro de Entradas, Perdas e Ajustes. | Must | Administrador consegue lançar reposição de estoque com quantidade e custo; o saldo em `raw_materials_stock` é atualizado simultaneamente. | 🟢 |
| RF-03 | Integrar a baixa de pedidos confirmados para gerar entradas de `SAIDA_VENDA` no livro razão. | Must | Ao aprovar pagamento, o sistema gera a linha de saída no histórico vinculada ao número do pedido. | 🟢 |
| RF-04 | Renderizar a aba/tabela "Histórico & Razão de Estoque" no Painel Admin com busca e filtros por período e tipo de movimentação. | Must | Tabela exibe histórico cronológico com badges coloridos (Verde = Entrada, Vermelho = Saída Venda, Laranja = Perda, Azul = Ajuste). | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Integridade | Lançamentos de movimentação e atualização de saldo devem ocorrer dentro de uma transação SQL (`BEGIN...COMMIT`). | Evita divergências entre o saldo da tabela principal e o histórico do livro razão. | 🟢 |
| Auditoria | Lançamentos não podem ser alterados ou apagados diretamente. | Princípio de contabilidade e controle imutável de estoque. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Registro de compra de insumos (Entrada)
  Dado que o administrador está logado no Painel Admin na aba "Cadastrar Estoques"
  Quando ele clica em "+ Registrar Entrada de Insumo"
  E seleciona "Botton 38mm - Alfinete", informa a quantidade 500, valor R$ 150,00 e fornecedor "Importadora X"
  Então a quantidade do insumo é incrementada em +500
  E uma linha do tipo "ENTRADA" é adicionada ao histórico com a data, hora e valor pago.

Cenário: Saída por Venda registrada no Livro Razão
  Dado que um pedido de 2 bottons de 38mm Alfinete teve o pagamento Pix aprovado
  Quando a baixa de estoque é executada
  Então uma linha do tipo "SAIDA_VENDA" de 2 unidades é gravada no histórico vinculada ao ID do pedido.

Cenário: Registro de perda na prensa
  Dado que 3 peças de 25mm Chaveiro foram danificadas na montagem
  Quando o administrador registra "Perda em Produção" de 3 unidades
  Então o saldo de 25mm Chaveiro é reduzido em 3 unidades
  E o prejuízo é calculado com base no último custo unitário de compra.
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Tabela `stock_movements`) | Must | Estrutura de dados essencial para o livro razão. |
| RF-02 (Modal de Entrada / Perda) | Must | Interface de reposição de estoque pelo administrador. |
| RF-03 (Gravação de saída por venda) | Must | Mantém histórico sincronizado com o e-commerce. |
| RF-04 (Aba de Histórico no Admin) | Must | Visualização e auditabilidade para o gestor. |

## 9. Esclarecimentos

### Sessão 2026-08-20

- **Q:** Deseja utilizar os valores pagos nas compras de matéria-prima para calcular o Custo Real e Lucro no Dashboard?
  **R:** Sim, calcular automaticamente o CMV no Dashboard com base no custo médio dos insumos lançados nas entradas.
- **Q:** Como deve ser calculado o valor financeiro do prejuízo em perdas de produção (peças danificadas na prensa)?
  **R:** Calcular o valor do prejuízo automaticamente com base no preço unitário da última compra do insumo.

## 10. Lacunas

*Nenhuma lacuna ou dúvida pendente.*

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-20 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-08-20 | Resolução de dúvidas de CMV e cálculo de prejuízo em perdas via `/reversa-clarify` | reversa |
