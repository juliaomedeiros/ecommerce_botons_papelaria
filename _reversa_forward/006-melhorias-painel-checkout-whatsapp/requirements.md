# Requirements: Melhorias no Painel Admin, Checkout com Autopreenchimento WhatsApp e Notificações

> Identificador: `006-melhorias-painel-checkout-whatsapp`
> Data: `2026-08-10`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Esta feature refina a experiência do cliente e a gestão do administrador do Tuta's Paper. Ela introduz o indicador de conexão do Evolution Go dentro do card de WhatsApp no Admin, limita o upload de produtos exclusivamente a arquivos locais do PC, simplifica o checkout com busca rápida e autopreenchimento de dados por WhatsApp (sem fricção de senha), grava todos os compradores na lista do Admin, automatiza o envio de alertas de pedidos via WhatsApp (para o admin e para o cliente), divide as configurações do Admin com botões de Salvar/Editar por seção (removendo o botão de Reset), torna o Guia de Tamanhos exclusivo para Bottons e abre a modal de variações obrigatoriamente ao clicar no card de bottons.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#componentes` | Estrutura de comunicação Express Node.js, PostgreSQL e Evolution Go em Docker | 🟢 |
| `_reversa_sdd/domain.md#pedidos` | Fluxo de pedidos, clientes e cadastros no e-commerce | 🟢 |
| `_reversa_sdd/addenda/addendum-005-matriz-variacoes-bottons.md` | Matriz de variações de bottons (25mm/38mm x Alfinete, Chaveiro, Ímã) | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Comprador Recorrente | Finalizar compra em menos de 1 minuto sem re-digitar endereço | Digita o WhatsApp no topo do checkout e tem todos os dados preenchidos automaticamente |
| Novo Comprador | Comprar bottons com facilidade e receber confirmação instantânea no WhatsApp | Preenche os dados de entrega sem precisar inventar senha e recebe comprovante via WhatsApp |
| Administrador / Operador da Prensa | Controlar as integrações e acompanhar novos pedidos com agilidade | Visualiza o status da API do WhatsApp no próprio card e recebe alertas no celular quando entra novo pedido |

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Status do WhatsApp no Card):** O status de conexão do Evolution Go (`🟢 Conectado` / `🔴 Desconectado`) deve ser exibido exclusivamente dentro do Card de Integração da Evolution API na aba de Integrações do Admin. 🟢
2. **RN-02 (Upload Apenas do PC):** O cadastro de produtos deve aceitar exclusivamente o envio de imagens locais do computador, removendo o campo de URL externa. 🟢
3. **RN-03 (Checkout com Autopreenchimento por WhatsApp):** No topo do checkout de entrega, haverá uma caixa de busca por número de WhatsApp. Se o cliente já constar no banco de dados, o sistema autopreencherá Nome, CPF e Endereço Completo. Se for novo cliente, permitirá preenchimento limpo sem exigir senha. 🟢
4. **RN-04 (Persistência Automática de Compradores):** Todo pedido finalizado deve gravar ou atualizar automaticamente os dados do comprador na tabela `customers` do banco de dados, tornando-os visíveis na aba Clientes do Admin. 🟢
5. **RN-05 (Notificações WhatsApp Duplas):** 🟢
   - **Admin:** Mensagem para o número do Admin/Produção contendo Nome do Cliente, Quantidade de Itens e Resumo do Pedido.
   - **Cliente:** Mensagem para o comprador iniciando com `🛍️ *Tuta's Paper - Confirmação do Pedido*`, detalhando itens, valor e confirmação.
6. **RN-06 (Botões Independentes por Integração & Sem Reset):** Cada card na aba Integrações (Mercado Pago, Evolution API, Modo 24h) terá seus próprios botões de Salvar/Editar. O botão de "Limpar Dados de Exemplo" deve ser removido. 🟢
7. **RN-07 (Guia de Tamanho Condicional):** O modal/botão de Guia de Tamanhos (25mm/38mm) só deve ser exibido se a categoria do produto for `Botton` ou `Botton Personalizado`. 🟢
8. **RN-08 (Modal de Variações Obrigatória no Card de Bottons):** Clicar em qualquer parte do card ou no botão "Adicionar ao Carrinho" de produtos das categorias de Botton deve abrir a modal de seleção de tamanho e acabamento antes de enviar ao carrinho. 🟢

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Exibir badge de status de conexão do WhatsApp dentro do Card da Evolution API | Must | Mostra `🟢 Conectado` ou `🔴 Desconectado` consultando o endpoint do backend | 🟢 |
| RF-02 | Restringir o cadastro de imagem de produtos para upload de arquivo local | Must | Remove campo de texto de URL de imagem e normaliza a exibição da imagem em todas as telas | 🟢 |
| RF-03 | Criar busca de dados por WhatsApp no modal de checkout | Must | Digitar o WhatsApp busca o cliente e preenche Nome, CPF e Endereço automaticamente | 🟢 |
| RF-04 | Salvar/Atualizar automaticamente compradores na tabela `customers` | Must | Pedidos finalizados criam ou atualizam o registro de cliente e aparecem no Admin | 🟢 |
| RF-05 | Disparar notificações automáticas de pedido via WhatsApp para Admin e Cliente | Must | Dispara mensagem de alerta ao Admin/Produção e mensagem de confirmação ao Cliente | 🟢 |
| RF-06 | Separar botões de Salvar/Editar por seção de integração e remover botão Reset Demo | Must | Cada card possui seus botões independentes e o botão de reset é excluído | 🟢 |
| RF-07 | Exibir Guia de Tamanhos apenas em produtos das categorias de Bottons | Must | Guia de 25mm/38mm oculta para produtos de papelaria/geral | 🟢 |
| RF-08 | Forçar abertura da modal de opções ao clicar no card de bottons | Must | Clique no card ou no botão Adicionar abre modal de opções e remove botão Ver Detalhes | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Segurança | Tokenização transparente PCI-DSS para pagamentos via Cartão no Mercado Pago | Não armazena dados de cartão no banco próprio | 🟢 |
| Usabilidade | Autopreenchimento de checkout em menos de 2 segundos após digitar o WhatsApp | Redução de fricção e aumento de taxa de conversão | 🟢 |
| Manutenibilidade | Organização modular das seções do Painel Admin | Código React limpo e isolado por card | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Busca de cliente por WhatsApp no Checkout
  Dado que o cliente está no modal de checkout do e-commerce
  Quando ele digita seu WhatsApp cadastrado e clica em "Buscar Meus Dados"
  Então o sistema preenche automaticamente os campos de Nome, CPF, Rua, Bairro, Cidade e CEP
  E permite que ele siga direto para a escolha do pagamento

Cenário: Alerta de Novo Pedido no WhatsApp do Admin
  Dado que um novo pedido foi aprovado ou finalizado
  Quando a compra é registrada no banco de dados
  Então o backend envia uma mensagem para o WhatsApp do Admin contendo Nome do Cliente, Quantidade e Resumo dos Itens
  E envia uma mensagem de confirmação para o WhatsApp do comprador com o nome da loja Tuta's Paper
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Status WhatsApp no Card) | Must | Facilita a gestão visual sem precisar abrir manager |
| RF-02 (Upload Apenas PC) | Must | Corrige exibição e elimina inconsistência de links externos |
| RF-03 (Checkout por WhatsApp) | Must | Melhora a conversão e experiência de compra |
| RF-04 (Lista de Clientes Admin) | Must | Mantém base de dados de compradores organizada |
| RF-05 (Notificações WhatsApp) | Must | Automatiza avisos de produção e recibos |
| RF-06 (Botões Separados no Admin) | Must | Melhora usabilidade da gestão de integrações |
| RF-07 (Guia Condicional Bottons) | Must | Evita informações confusas em outros produtos |
| RF-08 (Modal Obrigatória em Bottons) | Must | Garante escolha de diâmetro e acabamento antes da compra |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. O escopo foi alinhado diretamente com o usuário no chat.

## 10. Lacunas

Nenhuma lacuna detectada. Todos os 8 requisitos foram alinhados e validados.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-08-10 | Versão inicial gerada por `/reversa-requirements` | reversa |
