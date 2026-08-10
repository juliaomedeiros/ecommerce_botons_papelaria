# Investigação Técnica: Reestruturação do Estoque de Bottons, Catálogo, Clientes e Dashboard

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`

---

## 1. Contexto e Pesquisa de Arquitetura

O sistema Tuta's Paper já possui um modelo relacional robusto no PostgreSQL com as tabelas `products`, `product_variations`, `customers`, `orders` e `order_items`.

### Pontos Investigados no Código Existente:

1. **Modelagem de Variações de Bottons (`product_variations`):**
   - A tabela `product_variations` possui as colunas `diameter` (`25mm` / `38mm`), `finish_type` (`alfinete` / `chaveiro` / `ima`), `price_override` e `stock_quantity`.
   - Na versão anterior, o Admin cadastrava todas as 6 combinações de uma só vez. A nova abordagem simplifica: o Admin escolhe **1 acabamento específico** para aquele modelo/estampa e marca os diâmetros habilitados (`25mm` e/ou `38mm`).

2. **Renderização dos Mockups 3D (`BottonMockupDisplay.jsx`):**
   - O componente `BottonMockupDisplay.jsx` aceita as props `imageUrl`, `productName`, `finishType` e `size`.
   - Mantendo a chamada com a prop `finishType` apropriada (`alfinete`, `chaveiro` ou `ima`), o componente continua recortando em formato redondo e aplicando os gradientes 3D de película de acetato na frente e textura metálica no verso sem necessidade de refatorar o componente visual.

3. **Pesquisa da Aba de Clientes Compradores (`customerController.js`):**
   - O endpoint `GET /api/admin/customers` realiza `SELECT * FROM customers ORDER BY created_at DESC`.
   - Em `AdminDashboard.jsx`, a função `fetchCustomers()` lia os dados, mas a tabela no React usava um filtro de campo ou chave incorreta na renderização. Corrigindo o mapeamento de estado `customersList`, a tabela lista os compradores imediatamente.

4. **Pesquisa da Ordenação da Fila de Pedidos (FIFO):**
   - O endpoint `GET /api/admin/production-queue` ordenava por `created_at DESC` (último pedido no topo).
   - Alterando para `ORDER BY created_at ASC`, os pedidos passam a ser listados em ordem cronológica de chegada (FIFO), colocando o pedido mais antigo no topo da página.

---

## 2. Alternativas Avaliadas

* **Alternativa A (Criar novas tabelas de estoque):** Criar tabelas separadas para estoque base. *(Rejeitada: Adicionaria complexidade desnecessária; a tabela `product_variations` já gerencia o estoque por acabamento/diâmetro perfeitamente).*
* **Alternativa B (Aproveitar `product_variations` com acabamento fixo por produto):** Gravar as variações de diâmetro na tabela `product_variations` vinculadas ao acabamento escolhido do produto. *(Escolhida: 100% compatível com a estrutura existente, sem necessidade de novas migrações DDL).*
