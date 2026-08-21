# Onboarding: Validação do Livro Razão e Histórico de Estoque

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/009-historico-e-razao-de-estoque/`

## Passo a Passo para Validação Humana

### 1. Testar Reposição de Estoque (+ Registrar Entrada)
1. Acesse o Admin em `http://localhost/admin` na aba **Cadastrar Estoques**.
2. Clique no botão **+ Registrar Entrada / Compra**.
3. Selecione o insumo `"Botton 38mm - Alfinete de Metal"`.
4. Digite a quantidade `500` unidades, valor pago `R$ 150.00` e fornecedor `"Fornecedor Brasil"`.
5. Clique em **Salvar Entrada**.
6. Verifique se o saldo do insumo foi atualizado e se a Toast de confirmação foi exibida.

### 2. Testar Registro de Perda na Prensa
1. Na mesma aba de estoques, clique no botão **Registrar Perda / Descarte**.
2. Selecione `"Botton 25mm - Chaveiro 2 Faces"` e digite `2` peças danificadas.
3. Clique em **Confirmar Perda**.
4. Verifique o abatimento de 2 unidades no saldo.

### 3. Consultar a Aba de Histórico de Movimentações
1. Clique na aba **Histórico de Movimentações**.
2. Confirme que as entradas, saídas por vendas e perdas são listadas em ordem cronológica com data, hora, tipo e observações.
