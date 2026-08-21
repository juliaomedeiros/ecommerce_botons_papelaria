# Onboarding: Validação da Separação de Estoques e Produtos

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/008-separacao-estoque-e-produtos/`

## Passo a Passo para Validação Humana

### 1. Acesso à aba "Cadastrar Estoques" no Admin
1. Acesse o painel administrativo em `http://localhost/admin` (ou `http://localhost:5173/admin`).
2. Clique na aba **Cadastrar Estoques**.
3. Verifique se os insumos `25mm`, `38mm`, `Alfinete`, `Chaveiro` e `Ímã` são exibidos com suas quantidades.
4. Altere a quantidade do insumo `25mm` para `100` unidades e salve.

### 2. Cadastro de um Novo Produto sem digitar estoque
1. Acesse a aba **Produtos / Catálogo** no Admin.
2. Clique no botão **Novo Produto**.
3. Preencha Título: `"Botton Teste Sem Estoque Manual"`, Categoria: `"Papelaria"`, Preço: `"10.00"`.
4. Marque os diâmetros `25mm` e `38mm`.
5. Observe que **não existe mais o campo de quantidade de estoque individual** a ser preenchido.
6. Salve o produto.

### 3. Validação da Vitrine do E-commerce
1. Acesse a loja pública em `http://localhost`.
2. Localize o produto `"Botton Teste Sem Estoque Manual"`.
3. Verifique se o produto está disponível para compra normalmente.

### 4. Teste de Produto com Edição Limitada (Opcional)
1. No Admin, crie um produto marcando a caixa **Edição Limitada** com limite de `2` unidades.
2. Simule a compra de 2 unidades desse produto.
3. Confirme que após a venda o produto passa a figurar como **Esgotado**.
