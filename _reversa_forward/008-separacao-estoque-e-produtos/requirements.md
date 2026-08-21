# Requirements: Separação do Cadastro de Estoque e Exibição de Produtos no Catálogo

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Esta feature reestrutura a gestão de estoque do sistema Tuta's Paper, separando a **Gestão de Estoque Físico de Insumos** (bases/diâmetros de 25mm e 38mm e acabamentos) do **Cadastro e Exibição de Produtos no Catálogo**. Com isso, o administrador cadastra o saldo físico de insumos uma única vez e cria múltiplos produtos (com artes e imagens predefinidas) sem a necessidade de preencher o estoque produto a produto, garantindo controle centralizado e evitando divergências ou digitações repetitivas.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/prd.md#4.-Escopo-(in)` | Trava de Estoque por Insumo e Painel de Gestão de Estoque e Catálogo | 🟢 |
| `_reversa_sdd/addenda/007-reestruturacao-estoque-bottons-pedidos-dashboard.md#1.-Resumo-do-Delta` | Cadastro de variações e estoques por acabamento e diâmetro no Admin | 🟢 |
| `_reversa_sdd/prd.md#1.-Problema` | Desorganização no controle de matérias-primas e ausência de trava automática centralizada | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Administrador / Proprietário | Cadastrar novos modelos de bottons com imagens predefinidas rapidamente | O administrador faz o upload de uma nova arte no catálogo e seleciona os diâmetros compatíveis (25mm/38mm) sem precisar inserir saldos numéricos de estoque para aquele produto. |
| Administrador / Proprietário | Atualizar o saldo de matéria-prima recebido | O administrador acessa a tela de "Cadastrar Estoques", insere a quantidade de insumos físicos recebidos (ex: +500 unidades de 25mm) e o saldo atualizado é refletido para todos os produtos associados. |
| Cliente Comprador | Comprar produtos predefinidos ou personalizados | Ao navegar no catálogo, a disponibilidade do produto é validada em tempo real com base no saldo real de insumos físicos cadastrados e eventuais limites de edições limitadas. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** O cadastro de saldos de estoque passa a ser exclusivo do módulo centralizado "Cadastrar Estoques", organizado por insumo/diâmetro (25mm, 38mm) e acabamento (Alfinete, Chaveiro, Ímã). 🟢
   - Origem no legado: `_reversa_sdd/prd.md#4.-Escopo-(in)`
   - Tipo: alterada
2. **RN-02:** O cadastro padrão de produtos no catálogo (artes predefinidas ou item personalizável) não exigirá digitação manual de quantidade de estoque no momento da criação ou edição do produto. 🟢
   - Origem no legado: N/A
   - Tipo: nova
3. **RN-03:** A disponibilidade de compra de um produto no e-commerce é determinada dinamicamente pelo saldo do estoque físico do diâmetro/acabamento selecionado, respeitando também o limite individual (se configurado como Edição Limitada). 🟢
   - Origem no legado: `_reversa_sdd/addenda/007-reestruturacao-estoque-bottons-pedidos-dashboard.md#1.-Resumo-do-Delta`
   - Tipo: alterada
4. **RN-04:** A baixa de estoque do insumo físico ocorre diretamente após a confirmação e aprovação do pagamento (Pix ou Cartão de Crédito), sem reserva temporária no carrinho de compras. 🟢
   - Origem no legado: `_reversa_sdd/prd.md#4.-Escopo-(in)`
   - Tipo: alterada
5. **RN-05:** Permite a configuração opcional de um limite individual de estoque/vistas por produto (ex.: Edição Limitada de 20 unidades), que abate simultaneamente do saldo central do insumo físico a cada venda. 🟢
   - Origem no legado: N/A
   - Tipo: nova

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar/ajustar a aba ou tela "Cadastrar Estoques" no Painel Admin para gerenciamento exclusivo dos saldos de insumos por diâmetro e acabamento. | Must | Administrador consegue visualizar e atualizar o saldo total de insumos físicos (25mm, 38mm, alfinete, chaveiro, ímã) em um único local. | 🟢 |
| RF-02 | Remover a obrigatoriedade do campo de quantidade de estoque no formulário de produtos, adicionando campo opcional "Limite de Edição Limitada". | Must | Form de criação permite salvar produto sem estoque manual ou, opcionalmente, informar limite numérico de edição limitada. | 🟢 |
| RF-03 | Associar automaticamente a checagem de estoque dos produtos exibidos no catálogo ao saldo central de insumos cadastrados. | Must | Se o saldo do insumo 25mm for 0, todos os produtos que utilizam 25mm exibem estado "Esgotado" para essa variação. | 🟢 |
| RF-04 | Executar a baixa de estoque direta na aprovação do pagamento (Pix/Cartão). | Must | Baixa reduz o saldo global do insumo correspondente e decrementa o limite individual do produto (se houver). | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Validação de estoque no checkout deve ser executada em menos de 100ms. | Consulta direta indexada na tabela centralizada de estoques por insumo. | 🟢 |
| Integridade | Baixa de estoque em compras simultâneas deve utilizar transações com lock para evitar overselling. | Transações SQL `BEGIN...COMMIT` com trava de linha (`FOR UPDATE`). | 🟢 |
| Usabilidade | Interface de cadastro de produto simplificada, reduzindo os cliques necessários para postar novos modelos no catálogo. | Feedback visual claro indicando que o estoque é derivado dos insumos globais. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Cadastro de novo produto sem preenchimento de estoque
  Dado que o administrador está logado no Painel Admin na aba "Produtos"
  Quando ele preenche o título "Botton Nossa Senhora", escolhe a categoria "Religiosos", define o preço e seleciona o diâmetro "38mm"
  E salva o produto sem informar nenhum valor numérico de estoque
  Então o produto é cadastrado com sucesso no catálogo
  E sua disponibilidade é vinculada ao saldo atual de insumos 38mm no estoque central.

Cenário: Baixa de estoque centralizada após aprovação do pagamento
  Dado que o estoque central de insumos 25mm possui 50 unidades
  Quando um cliente finaliza a compra de 2 bottons de 25mm e o pagamento Pix/Cartão é confirmado
  Então o saldo do estoque central de insumos 25mm é reduzido diretamente para 48 unidades
  E não há retenção/reserva temporária de insumo durante a navegação do carrinho.

Cenário: Produto com Edição Limitada
  Dado um produto "Botton Comemorativo" cadastrado com limite individual de 10 unidades
  E o estoque central de insumos 38mm possui 100 unidades
  Quando são vendidas e pagas 10 unidades do "Botton Comemorativo"
  Então o "Botton Comemorativo" é marcado como esgotado no catálogo
  E o estoque central de insumos 38mm é reduzido para 90 unidades.
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Tela central de cadastrar estoques) | Must | Requisito fundamental para centralizar a gestão de matéria-prima. |
| RF-02 (Remoção do campo de estoque por produto) | Must | Soluciona diretamente a dor do usuário de redundância e descontrole no cadastro. |
| RF-03 (Vínculo dinâmico produto -> estoque insumo) | Must | Garante a exibição correta no catálogo sem dados legados inconsistentes. |
| RF-04 (Baixa atômica de insumos pós-pagamento) | Must | Previne overselling e garante baixa fiel após confirmação. |

## 9. Esclarecimentos

### Sessão 2026-08-20 (UX & Arquitetura de Produção)

- **Q:** Como você deseja proceder em relação à arquitetura e tecnologia do projeto?
  **R:** Manter a stack atual (Node.js + React + Vite + Postgres) e refatorar a UX para ser 100% reativa (Toasts de sucesso, loading suave, feedback instantâneo ao salvar estoques sem popups alertas).
- **Q:** Qual modelo de execução e portas você prefere para testar as alterações no seu computador?
  **R:** Conteinerizado em Docker Compose para produção, mantendo portas abertas e limpas para acesso (Nginx na porta 80/443, Backend na 5000, Evolution API na 8080, Postgres na 5432).

## 10. Lacunas

*Nenhuma lacuna ou dúvida pendente.*

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-20 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-08-20 | Resolução de dúvidas de checkout e limite individual via `/reversa-clarify` | reversa |
| 2026-08-20 | Alinhamento de reatividade UX e portas de produção Docker via `/reversa-clarify` | reversa |
