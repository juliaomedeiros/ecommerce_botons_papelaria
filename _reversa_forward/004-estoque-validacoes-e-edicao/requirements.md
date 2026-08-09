# Requisitos: Validação de Limites de Estoque, Edição Bloqueada via Lápis e Regras de Disponibilidade

> Identificador: `004-estoque-validacoes-e-edicao`
> Data: `2026-08-09`

## Resumo Executivo
Implementação de regras estritas de integridade de estoque e experiência de gestão no Admin e E-commerce:
1. **Regra de Limite por Compra**: `limite_maximo_por_compra` nunca pode ser maior que `estoque_total`.
2. **Edição Bloqueada na Tabela Admin**: Campos da tabela de produtos do Admin iniciam desabilitados/bloqueados com ícone de Lápis ✏️ para habilitar edição.
3. **Abatimento Condicionado ao Pagamento Aprovado**: O abatimento no estoque (`products.stock_quantity`) **NÃO** ocorre na geração do Pix pendente; ele só é executado no momento em que o pagamento for efetivado com sucesso (Webhooks do Mercado Pago / Fila Noturna de Produção com confirmação de pagamento).
4. **Alerta de Renovação (20% Threshold)**: Quando o estoque total for `<= limite_maximo_por_compra * 1.2`, sinalizar no Admin a tag `"⚠️ Renovar Estoque"`.
5. **Bloqueio de Venda e Sinalização de Indisponibilidade**: Quando `estoque_total <= limite_maximo_por_compra`, o produto fica indisponível para o comprador e bloqueado com aviso no Admin.

## Requisitos Funcionais (RF)

- **RF001**: O formulário do Admin e as APIs do Backend devem validar que `max_limit_per_order <= stock_quantity`.
- **RF002**: A tabela de produtos no Admin deve exibir os valores em modo somente-leitura com botão de Lápis ✏️ para alternar o modo de edição por produto.
- **RF003**: O checkout grava pedidos pendentes sem decrementar o estoque; a função `deductStockForOrder(orderId)` realiza o abatimento com trava de segurança (`stock_deducted: true`) somente quando `payment_status` muda para `approved`.
- **RF004**: Exibir a badge `"⚠️ Renovar Estoque"` no Admin quando o estoque estiver próximo do limite (limite + 20%).
- **RF005**: Bloquear o botão de compra na vitrine e modal e exibir `"Indisponível no momento"` quando o estoque for menor ou igual ao limite de compra.

---

## 📌 Apêndice A: Regra de Abatimento Diferido por Confirmação de Pagamento

> **Data de Atualização**: `2026-08-09`  
> **Motivação**: Prevenir redução indevida de estoque para Pix ou pagamentos abandonados no checkout.

1. **Separação entre Pedido Criado e Pagamento Confirmado**:
   - Ao criar o pedido no checkout (`POST /api/orders`), o pedido é inserido na tabela `orders` com `payment_status = 'pending'`.
   - Nenhuma linha em `products` ou `product_variations` tem seu `stock_quantity` alterado neste momento.

2. **Execução Segura da Baixa de Estoque**:
   - A baixa ocorre quando a notificação do Mercado Pago envia `payment_status = 'approved'`.
   - O backend executa a transação idempotente `deductStockForOrder(order.id)`, garantindo que cada compra abatida no estoque seja acompanhada pelo recebimento real do valor financeiro.
