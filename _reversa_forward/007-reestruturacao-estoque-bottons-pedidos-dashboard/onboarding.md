# Roteiro de Teste e Onboarding: Feature 007

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`

---

## 1. Passo a Passo para Testar o Novo Fluxo de Estoque e Produtos (Admin)

1. Acesse o Painel Administrativo em `/admin`.
2. Vá para a aba **Estoque de Bottons**:
   - Defina a quantidade em estoque para o acabamento *Alfinete* (marcando `38mm` e/ou `25mm`).
   - Defina a quantidade em estoque para o acabamento *Chaveiro 2 faces* e *Ímã de Geladeira*.
   - Salve a matriz de estoque.
3. Vá para a aba **Cadastrar Produto**:
   - Escolha a categoria `Bottons`.
   - Selecione um arquivo de imagem de foto no computador.
   - Digite o Nome (ex: *"Botton Chaveiro Anime"*), Preço e Limite Máximo por compra.
   - Escolha **um único acabamento** na caixa de seleção (ex: *Chaveiro 2 faces*).
   - Marque os tamanhos que essa estampa terá disponível (`25mm` e/ou `38mm`).
   - Clique em **Adicionar Produto ao Catálogo**.

---

## 2. Passo a Passo para Testar o E-Commerce e Catálogo

1. Acesse a loja pública em `/home` ou no Catálogo.
2. Na barra de categorias, observe a presença das abas/filtros de acabamento: *Todos*, *Alfinete*, *Chaveiro 2 faces*, *Ímã de Geladeira*.
3. Clique no produto cadastrado:
   - Observe que a foto da estampa é exibida no card.
   - O mockup 3D renderiza o modelo redondo com acetato na frente e o verso correspondente ao acabamento escolhido.
   - Se você cadastrou apenas o tamanho `38mm`, o card/modal exibirá `38mm (Padrão)` como opção única fixa. Se cadastrou ambos (`38mm` e `25mm`), permitirá alternar o tamanho.
   - Se o estoque de um tamanho for 0, o botão desse tamanho ficará desabilitado com aviso de esgotado.

---

## 3. Passo a Passo para Testar Clientes Compradores, Lista de Pedidos e Dashboard

1. Faça uma compra no carrinho informando WhatsApp, Nome e Endereço Completo.
2. Acesse o Admin `/admin` -> Aba **Clientes Compradores**:
   - Verifique que o cliente cadastrado aparece listado na tabela com Nome, WhatsApp, CPF, Endereço Completo e total de compras.
3. Vá para a aba **Lista de Pedidos** (antiga Fila Noturna):
   - Verifique que a aba se chama *Lista de Pedidos*.
   - Verifique que o pedido mais antigo permanece no topo da lista e os novos pedidos aparecem abaixo (ordem FIFO).
4. Observe o topo do **Dashboard**:
   - Confirme que os cards de Faturamento Total, Pedidos, Estoque e Fila de Produção são atualizados via banco de dados.
