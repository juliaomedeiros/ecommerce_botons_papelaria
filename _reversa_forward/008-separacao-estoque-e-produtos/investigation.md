# Investigation: Arquitetura de Separamento entre Insumos Físicos e Catálogo

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/008-separacao-estoque-e-produtos/`

## 1. Visão Geral da Pesquisa

O sistema atual apresentava acoplamento entre o cadastro de vitrine do produto (título, foto da arte) e o controle quantitativo de peças físicas. Na prática da produção de bottons, os produtos expostos são impressões de imagens aplicadas sobre insumos padrão (conchas de metal 25mm/38mm e acabamentos de alfinete, chaveiro ou ímã).

Separar esses domínios resolve dois problemas simultâneos:
1. **Operacional:** Elimina a necessidade de o administrador digitar "quantidade 100" para cada nova imagem/arte cadastrada na loja.
2. **Gerencial:** O saldo de matéria-prima é unificado e fidedigno ao estoque real presente na oficina.

## 2. Alternativas Avaliadas

### Alternativa A: Manter campo de estoque no produto e atualizar todos via trigger
- **Descrição:** Manter o campo `stock` na tabela `products`, mas criar uma trigger no Postgres que atualiza todas as linhas de produtos quando o estoque de insumos muda.
- **Desvantagem:** Alta redundância e overhead de update em massa no banco de dados a cada alteração de insumo ou venda efetuada.
- **Veredito:** Descartada.

### Alternativa B: Relação 1-para-M com tabela centralizada `raw_materials_stock` (Escolha Adotada)
- **Descrição:** Produtos do catálogo indicam apenas quais insumos/diâmetros utilizam. A API de produtos faz um `JOIN` ou consulta auxiliar com `raw_materials_stock` para derivar o status de disponibilidade.
- **Vantagem:** Desempenho alto, zero redundância, baixa de estoque centralizada atômica.
- **Veredito:** Adotada.

## 3. Padrões Aplicados

- **Domain-Driven Design (DDD):** Separação clara entre o Agregado de *Insumos/Estoque Físico* e o Agregado de *Catálogo de Produtos*.
- **Optimistic/Pessimistic Locking:** Uso de transações de banco de dados (`SELECT FOR UPDATE`) para controle concorrente de baixa de matérias-primas no fechamento da venda.
