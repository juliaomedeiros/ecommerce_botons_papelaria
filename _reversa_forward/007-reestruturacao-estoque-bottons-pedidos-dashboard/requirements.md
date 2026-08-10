# Requisitos: Reestruturação do Estoque de Bottons, Catálogo, Clientes e Dashboard

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`
> Status: `requirements-clarified`
> Ancoragem Legado: `_reversa_sdd/domain.md`, `_reversa_sdd/architecture.md` e `_reversa_sdd/addenda/006-melhorias-painel-checkout-whatsapp.md`

---

## 1. Visão Geral & Objetivos do Negócio

Esta feature atende a 4 frentes essenciais de evolução do e-commerce Tuta's Paper:

1. **Modelagem de Estoque e Catálogo de Bottons:** Descouplar o cadastro de estoque bruto por acabamento de verso (*Alfinete*, *Chaveiro 2 faces*, *Ímã de Geladeira*) e diâmetro (*38mm* / *25mm*), permitindo que cada produto do catálogo possua sua foto de estampa própria, acabamento específico e escolha dinâmica de tamanho pelo comprador no e-commerce.
2. **Exibição da Lista de Clientes Compradores:** Corrigir a consulta/renderização na aba *Clientes Compradores* do Painel Admin, exibindo a tabela completa de compradores salvos no PostgreSQL.
3. **Fila de Produção ("Lista de Pedidos"):** Renomear a aba *Fila Noturna* para *Lista de Pedidos*, apresentando uma lista sequencial FIFO (First-In, First-Out) onde os pedidos mais antigos ficam no topo (prioridade) e os novos pedidos no final.
4. **Métricas Consolidadas do Dashboard:** Garantir que todos os números do Dashboard venham de queries SQL reais e atualizadas no PostgreSQL.

---

## 2. Ancoragem no Legado & Especificações SDD

* 🟢 `_reversa_sdd/domain.md#produtos` — Cadastro de produtos e categorias
* 🟢 `_reversa_sdd/domain.md#estoque` — Matriz de variações de diâmetro e acabamento
* 🟢 `_reversa_sdd/architecture.md#backend` — Endpoints `/api/admin/products`, `/api/admin/customers` e `/api/admin/dashboard-stats`
* 🟢 `_reversa_sdd/architecture.md#frontend` — Componentes `AdminDashboard.jsx`, `Catalog.jsx`, `BottonMockupDisplay.jsx` e `ProductDetailModal.jsx`
* 🟢 `_reversa_sdd/addenda/006-melhorias-painel-checkout-whatsapp.md` — Upsert de clientes e notificações de WhatsApp

---

## 3. Requisitos Funcionais Detalhados

### RF-01: Cadastro de Estoque Base de Bottons (Admin)
- 🟢 **Acabamentos Permitidos:** O Admin poderá definir e cadastrar quantidades de estoque para os 3 acabamentos de verso:
  - *Alfinete* (botton tradicional)
  - *Chaveiro 2 faces* (dupla face estampada)
  - *Ímã de Geladeira* (fixação magnética)
- 🟢 **Seleção de Diâmetros (Checkboxes):** Ao cadastrar/gerenciar o estoque de um acabamento, o Admin deve obrigatoriamente marcar ao menos um dos checkboxes de diâmetro: `38mm` e/ou `25mm`.
  - **Regra de Validação:** Não é permitido salvar sem marcar pelo menos um tamanho.
  - **Campos de Quantidade:** Se marcou ambos (`38mm` e `25mm`), o Admin informa a quantidade em estoque para o de 38mm e a quantidade para o de 25mm. Se marcou apenas um diâmetro, é exibido apenas o campo daquele tamanho selecionado.
- 🟢 **Manutenção das Regras de Estoque:** Toda a lógica de dedução de estoque existente por diâmetro e acabamento permanece preservada. Se o estoque de um diâmetro zerar (`stock = 0`), esse botão de tamanho é desabilitado dinamicamente no card e na modal do cliente.

### RF-02: Cadastro de Produto na Categoria Bottons (Admin -> Catálogo)
- 🟢 **Campos do Formulário de Produto:**
  - Nome do produto (ex: *"Botton Religioso Nossa Senhora"*).
  - Categoria (preenchida automaticamente como `Bottons`).
  - Carregar Foto do Produto (Upload exclusivo do arquivo do computador, salvo em Base64 no PostgreSQL).
  - Preço de venda (R$).
  - Limite máximo por compra.
  - **Acabamento Verso:** Caixa de seleção (`<select>`) para escolher um único acabamento (dentre os ativos no estoque).
  - **Tamanhos Disponíveis (Checkboxes):** Checkboxes de `38mm` e `25mm`. O Admin marca os diâmetros que aquela estampa/modelo comercializará.

### RF-03: Exibição dos Cards no Front-end (`/home` e Catálogo)
- 🟢 **Card Individual por Acabamento/Estampa:** Cada produto cadastrado pelo Admin vira um card exclusivo no catálogo com a foto da sua estampa específica.
- 🟢 **Preservação Rígida do Mockup 3D (Frente/Verso):** O componente `BottonMockupDisplay.jsx` mantém a renderização 3D com formato redondo, brilho de película de acetato na frente e textura metálica do verso correspondente ao acabamento (*Alfinete*, *Chaveiro 2 faces* ou *Ímã de Geladeira*).
- 🟢 **Filtro Rápido por Acabamento:** O cabeçalho de navegação do catálogo inclui botões de filtro rápido para isolar produtos por acabamento (*Todos*, *Alfinete*, *Chaveiro 2 faces*, *Ímã de Geladeira*).
- 🟢 **Seleção de Tamanho pelo Comprador:**
  - Se o Admin habilitou ambos os diâmetros (`38mm` e `25mm`), o comprador visualizará e poderá alternar o tamanho no próprio card ou modal de opções.
  - Se o Admin habilitou apenas 1 diâmetro (ex: apenas `38mm`), o e-commerce exibirá esse tamanho como opção fixa e única, sem seletores desnecessários.
- 🟢 **Preservação de Outras Categorias:** As categorias *Artigos Religiosos* e *Papelaria* mantêm suas regras de cadastro simples sem alteração.

### RF-04: Bottons Personalizados (Canvas 3D)
- 🟢 **Personalização via Canvas:** O produto da categoria *Bottons Personalizados* continua exibindo o botão *"Personalize com uma imagem"*, abrindo a modal Canvas 3D para upload e ajuste da imagem do cliente.
- 🟢 **Acabamento Alfinete:** A personalização nesta fase fica restrita ao acabamento *Alfinete* (com escolha de tamanho `38mm` ou `25mm` dependendo do estoque). Outros acabamentos (Chaveiro/Ímã para arte personalizada) ficam reservados como melhoria futura.

### RF-05: Correção da Tabela de Clientes Compradores (Admin)
- 🟢 **Exibição dos Clientes:** Corrigir a query SQL em `customerController.js` e a renderização na aba *Clientes Compradores* de `AdminDashboard.jsx`.
- 🟢 **Dados Exibidos:** Nome Completo, WhatsApp/Telefone, CPF, Endereço Completo (Rua, Número, Bairro, Cidade, Estado, CEP), Total de Pedidos Realizados e Data da Última Compra.

### RF-06: Renomear Fila Noturna para Lista de Pedidos (FIFO)
- 🟢 **Renomeação:** Trocar o título da aba no Admin de *"Fila Noturna de Impressão"* para **"Lista de Pedidos"**.
- 🟢 **Ordenação Cronológica FIFO:** Exibir os pedidos em lista vertical ordenados por data de criação (`created_at ASC`), onde os pedidos recebidos primeiro aparecem no topo (maior prioridade de produção) e os pedidos recentes aparecem na parte inferior da lista.

### RF-07: Métricas e Dados Consolidados do Dashboard (Admin)
- 🟢 **Queries Reais no PostgreSQL:** As métricas exibidas nos cards do topo do Dashboard (Faturamento Total, Total de Vendas, Total de Produtos em Estoque, Pedidos em Produção) devem ser derivadas 100% de queries SQL de agregação (`COUNT`, `SUM`) executadas no PostgreSQL.

---

## 4. Riscos, Premissas & Não-Objetivos

* 🛡️ **Segurança & PCI-DSS:** Nenhuns dados sensíveis de cartão de crédito são gravados localmente.
* 🚫 **Não-Objetivo:** Não alterar o fluxo de personalização das demais categorias nem a integração do Mercado Pago.
* 📦 **Compatibilidade de Dados:** Garantir que o schema do PostgreSQL reflita as variações de estoque sem quebrar produtos já cadastrados.

---

## 5. Esclarecimentos

### Sessão 2026-08-10
- **Q:** Alerta de Estoque Baixo por Diâmetro: Quando o estoque de um diâmetro específico zerar, o botão desse diâmetro deve ser desabilitado?
  - **R:** Sim, toda a regra de estoque já criada deve ser mantida. Se o diâmetro tiver estoque zero, o botão correspondente fica desabilitado no card/modal.
- **Q:** Filtro por Acabamento no Catálogo: Incluir filtros rápidos por tipo de acabamento no catálogo?
  - **R:** Sim, incluir filtros rápidos por acabamento (*Alfinete*, *Chaveiro 2 faces*, *Ímã de Geladeira*).
- **Q:** Preservação da lógica do Mockup 3D:
  - **R:** Preservar rigorosamente o componente 3D que corta a estampa em formato redondo e renderiza frente e verso (metal/alfinete/chaveiro/ímã), alterando apenas o mínimo necessário para acomodar a nova modelagem de estoque e catálogo.

---

## 6. Lacunas

*(Nenhuma dúvida ou lacuna em aberto. Todos os requisitos estão definidos com 100% de clareza).*

---

## 7. Próximo Passo

Todos os marcadores `[DÚVIDA]` foram resolvidos. O documento está pronto para a criação do plano de arquitetura e migração técnica via **`/reversa-plan`**.
