# Roadmap Técnico: Reestruturação do Estoque de Bottons, Catálogo, Clientes e Dashboard

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`
> Requirements: `_reversa_forward/007-reestruturacao-estoque-bottons-pedidos-dashboard/requirements.md`

---

## 1. Resumo da Abordagem Técnica

A solução foi estruturada para ser **mínima, retrocompatível e cirúrgica**, preservando integralmente os componentes legados de renderização 3D (`BottonMockupDisplay.jsx`) e as regras de dedução de estoque existentes.

### Principais Pilares da Solução:
1. **Estoque Base por Acabamento & Diâmetro:** Reestruturar os endpoints do Admin em `productController.js` e a renderização da aba de Estoque em `AdminDashboard.jsx`. Cada acabamento (*Alfinete*, *Chaveiro 2 faces*, *Ímã de Geladeira*) terá seu controle de quantidade por diâmetro (`38mm` e/ou `25mm`).
2. **Produtos de Bottons com Imagem e Variação Única de Acabamento:** No cadastro de novos produtos da categoria *Bottons*, o Admin envia a imagem estampa única (upload do PC em Base64 para o PostgreSQL), define o preço, limite máximo, seleciona **um único acabamento** e marca os checkboxes dos diâmetros disponíveis (`25mm` e/ou `38mm`).
3. **Cards Individuais & Filtros por Acabamento no Catálogo:** No front-end (`Catalog.jsx`), cada estampa vira um card próprio. Adicionados botões de filtro por acabamento (*Todos*, *Alfinete*, *Chaveiro 2 faces*, *Ímã*) na barra de navegação. Se ambos os tamanhos estiverem habilitados, o cliente pode alternar no card/modal; se apenas um tamanho estiver habilitado, a opção é fixa.
4. **Fix da Lista de Clientes Compradores:** Ajustar a query em `customerController.js` (`GET /api/admin/customers`) e o mapeamento de estado em `AdminDashboard.jsx` para renderizar a tabela com os dados completos dos compradores.
5. **Aba "Lista de Pedidos" (Ordenação FIFO):** Renomear a aba *Fila Noturna* para *Lista de Pedidos* em `AdminDashboard.jsx` e ordenar a busca SQL (`orderController.js`) com `ORDER BY created_at ASC`, garantindo que o pedido mais antigo apareça no topo e o mais recente no final.
6. **Consolidação de Métricas no Dashboard:** Ajustar `orderController.js#getDashboardStats` para que os 4 cards do topo sejam alimentados por queries SQL diretas (`COUNT`, `SUM`) no PostgreSQL.

---

## 2. Delta Arquitetural

| Componente | Tipo de Modificação | Descrição do Delta |
|------------|---------------------|--------------------|
| `backend/src/controllers/productController.js` | Alteração de Regra | Ajustar `createProduct` e `updateProduct` para suportar cadastro por acabamento único e diâmetros habilitados |
| `backend/src/controllers/customerController.js` | Ajuste de Query | Garantir que `GET /api/admin/customers` retorne todos os campos gravados no `upsert` |
| `backend/src/controllers/orderController.js` | Ajuste de Query | Ajustar `getProductionQueue` com `ORDER BY created_at ASC` e atualizar `getDashboardStats` |
| `frontend/src/components/AdminDashboard.jsx` | Modificação de UI | Atualizar formulários de estoque e produto, renomear aba para *Lista de Pedidos* e renderizar tabela de clientes |
| `frontend/src/components/Catalog.jsx` | Modificação de UI | Adicionar filtro por acabamento e renderizar botões de diâmetro condicionalmente |
| `frontend/src/components/ProductDetailModal.jsx` | Modificação de UI | Renderizar seletores de tamanho apenas para diâmetros habilitados no produto |

---

## 3. Delta de Dados

Ver o documento detalhado em [`data-delta.md`](file:///C:/ProjectsCode/sistema_tutaspaper/_reversa_forward/007-reestruturacao-estoque-bottons-pedidos-dashboard/data-delta.md).

- **Tabela `products`:** Suporta `image_url` em TEXT (Base64) e `allowed_diameters` (ou variações em `product_variations`).
- **Tabela `product_variations`:** Grava as linhas de variação para cada diâmetro habilitado com a referência ao produto e acabamento.
- **Tabela `customers`:** Tabela PostgreSQL populada via `upsert` no checkout e lida pelo Admin.

---

## 4. Delta de Contratos Externos

Ver o documento em [`interfaces/admin-customers.md`](file:///C:/ProjectsCode/sistema_tutaspaper/_reversa_forward/007-reestruturacao-estoque-bottons-pedidos-dashboard/interfaces/admin-customers.md).

---

## 5. Plano de Migração e Teste

1. **Passo 1 (Backend):** Atualizar `productController.js`, `customerController.js` e `orderController.js`.
2. **Passo 2 (Frontend Admin):** Atualizar `AdminDashboard.jsx` com o novo fluxo de cadastro por acabamento, tabela de clientes e renomeação da *Lista de Pedidos*.
3. **Passo 3 (Frontend E-commerce):** Atualizar `Catalog.jsx` com filtros por acabamento e exibição de diâmetros condicionais.
4. **Passo 4 (Validação):** Executar `docker compose up -d --build` e testar via roteiro de onboarding em [`onboarding.md`](file:///C:/ProjectsCode/sistema_tutaspaper/_reversa_forward/007-reestruturacao-estoque-bottons-pedidos-dashboard/onboarding.md).

---

## 6. Critério de Pronto (Definition of Done)

- [ ] Estoque do Admin permite definir quantidade por acabamento (*Alfinete*, *Chaveiro 2 faces*, *Ímã*) e diâmetro (`38mm` / `25mm`).
- [ ] Cadastro de produto de Bottons aceita 1 acabamento único, foto do PC em Base64 e seleção dos diâmetros disponíveis.
- [ ] Cards do catálogo exibem foto própria e seletores de diâmetro condicionalmente.
- [ ] Filtro rápido por acabamento funciona na barra de navegação do catálogo.
- [ ] Tabela de *Clientes Compradores* exibe todos os clientes cadastrados no PostgreSQL.
- [ ] Aba *Lista de Pedidos* exibe lista vertical com pedido mais antigo no topo (FIFO).
- [ ] Métricas do Dashboard são alimentadas por queries SQL reais.
