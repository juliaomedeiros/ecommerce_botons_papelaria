# Guia de Onboarding & Testes: Feature 002

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`

## 1. Pré-requisitos
- Stack Docker rodando (`docker-compose up -d`).
- Backend rodando na porta 3001 e Frontend rodando na porta 3000 (ou Nginx 80).
- Evolution API ativa na porta 8080.

## 2. Passo a Passo de Teste Manual

### A. Teste do Painel Admin e RBAC
1. Acesse `http://localhost/admin` e faça login com a conta de Administrador.
2. Na aba **Produtos**, cadastre um novo produto com nome, preço R$ 15,00, quantidade em estoque = 5 e faça upload de uma imagem.
3. Alterne para a aba **Configurações**:
   - Ative a chave seletora **Mercado Pago Sandbox**.
   - Ative o **Modo 24h**.
4. Faça logout e entre com uma conta de perfil `funcionario`:
   - Verifique que o funcionário **consegue** editar preços de produtos e quantidade em estoque.
   - Verifique que o acesso à aba de relatórios financeiros e chaves é **bloqueado (HTTP 403)**.

### B. Teste da Vitrine e Modo 24h
1. Acesse o e-commerce público `http://localhost/`.
2. Como o **Modo 24h está ATIVADO**:
   - Observe a nova frase do banner: *"Modo Entrega Rápida 24h: Escolha seu botton diretamente no nosso catálogo."*
   - Verifique que o card e a opção *"Personalize com uma imagem"* estão **completamente ocultos/desativados**.
3. Volte ao Admin e **DESATIVE** o Modo 24h:
   - Recarregue a vitrine: a frase muda para *"Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem."*
   - O card de personalização volta a aparecer.

### C. Teste do Modal Responsivo e Zoom Flexível
1. Clique em "Personalizar" no catálogo.
2. Observe que a personalização abre dentro de um **Modal responsivo (pop-up)**.
3. Carregue uma imagem de altíssima resolução (ex: `sistemaejc2.png` ou qualquer foto grande de celular).
4. Mova o slider de Zoom para a esquerda: verifique que é possível **diminuir bastante a imagem** até que ela se enquadre perfeitamente dentro do círculo do botton sem limitações.

### D. Teste do Envio do PDF Timbrado no WhatsApp
1. Conclua uma compra de teste com Pix (Mercado Pago Sandbox).
2. Informe um número de WhatsApp válido no checkout.
3. Após a confirmação do pagamento, verifique que o WhatsApp recebe a mensagem contendo o PDF do pedido com o timbrado oficial da Tuta's Paper.

### E. Teste da Gestão de Clientes
1. Acesse a nova aba **Clientes** no Painel Admin.
2. Verifique que o comprador do pedido recente consta na lista com Nome Completo, Telefone, Endereço e CPF.
