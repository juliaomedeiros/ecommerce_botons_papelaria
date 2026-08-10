# Onboarding: Passo a Passo para Testar as Melhorias

## 1. Testando a Tag de Status do WhatsApp no Admin
1. Acesse o Painel Admin em `http://localhost/admin`.
2. Vá até a **Aba Integrações**.
3. Localize o **Card da Evolution API (WhatsApp)**.
4. Verifique o selo visual:
   - Se o contêiner Evolution Go estiver ativo e pareado, exibe `🟢 WhatsApp Conectado (Online)`.
   - Se desconectado, exibe `🔴 WhatsApp Desconectado (Requer QR Code)`.

## 2. Testando o Upload Exclusivo de Imagem de Produto
1. Na aba **Produtos** do Admin, observe que o campo de URL externa foi removido.
2. Clique no botão de enviar arquivo do PC, selecione uma imagem local e salve.
3. Verifique se a imagem é exibida corretamente na lista de produtos do Admin e na Home do e-commerce.

## 3. Testando o Checkout Rápido por WhatsApp
1. No e-commerce (`http://localhost`), adicione qualquer produto ao carrinho e clique em **Finalizar Compra**.
2. No topo do formulário de entrega, observe a caixa: `📱 Já comprou conosco? Digite seu WhatsApp para carregar seus dados`.
3. Digite um número de WhatsApp previamente cadastrado e clique em **Buscar Meus Dados**.
4. Observe que Nome, CPF e Endereço Completo são autopreenchidos instantaneamente.

## 4. Testando as Notificações de WhatsApp
1. Finalize um pedido no e-commerce.
2. Verifique nos logs do backend (`docker compose logs -f backend`) o disparo das duas mensagens:
   - Notificação curta de novo pedido para o WhatsApp do Admin/Produção.
   - Recibo completo de confirmação com a marca *Tuta's Paper* para o WhatsApp do cliente.

## 5. Testando Botões Separados por Card no Admin
1. Na aba Integrações, altere um campo no Card do Mercado Pago e clique no botão **Salvar Mercado Pago**.
2. Verifique se as alterações são salvas individualmente, sem afetar as configurações do WhatsApp.
3. Observe que o botão vermelho de Reset Demo foi removido.
