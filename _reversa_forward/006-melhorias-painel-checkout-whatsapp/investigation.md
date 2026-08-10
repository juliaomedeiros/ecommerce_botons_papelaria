# Investigation: Padrões de Checkout sem Fricção e Notificações WhatsApp

## 1. Padrões de UX para Checkout sem Senha (Guest Checkout)
Estudos de usabilidade de e-commerce (Baymard Institute) indicam que a obrigatoriedade de criação de conta com senha é a principal causa de abandono de carrinho em dispositivos móveis. A identificação prévia por número de telefone (WhatsApp) permite:
- Recuperação instantânea de endereço cadastrado para clientes recorrentes.
- Zero fricção para novos clientes, mantendo os campos abertos para preenchimento.

## 2. Segurança de Pagamentos PCI-DSS com Mercado Pago
- O SDK do Mercado Pago no frontend gera um Token de uso único para pagamentos via cartão de crédito.
- O banco de dados do Tuta's Paper grava apenas o ID da transação (`payment_id`) e o status do Mercado Pago.
- Nenhuma informação de cartão é mantida em armazenamento local, garantindo total conformidade com a LGPD e PCI-DSS.

## 3. Notificações Humanizadas WhatsApp (Anti-Ban Guard)
- Utilização do serviço em memória FIFO (`whatsappService.js`) com atrasos randômicos (5 a 15 segundos) e simulador de presença `composing`.
- Estruturação de templates legíveis para o Admin e para o Cliente.
