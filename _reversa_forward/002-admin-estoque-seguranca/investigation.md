# Investigação Técnica: Feature 002 (Admin, Estoque, PDF, Clientes e Modo 24h)

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`

## 1. Pesquisa de fundo & Arquitetura de PDF

Para a geração do comprovante de pedido timbrado no layout oficial da empresa (*MATERIAL CONSIGNADO TATI.pdf*):
- **Opção Escolhida (`pdfkit`)**: Biblioteca extremamente veloz para Node.js que desenha vetorialmente cabeçalhos, logos, linhas e tabelas em memória sem carregar um Chromium. Resposta típica < 300ms.
- **Estrutura Visual do Timbrado**:
  - Cabeçalho Superior: Logo Tuta's Paper, slogan *"Papelaria e Artigos Religiosos"*, contatos `@tutaspaper`, `(83) 99985 3299` e endereço físico.
  - Dados do Pedido: Número do Pedido, Data/Hora, Nome do Cliente, Telefone do Checkout e Endereço de Entrega.
  - Tabela Principais: Colunas `Item / Produto`, `Quantidade`, `Preço Unitário (R$)`, `Total (R$)`.
  - Rodapé: Total Geral e Mensagem de Agradecimento.

## 2. Investigação de UX: Canvas & Zoom Flexível em Dispositivos Móveis

- **Problema Observado**: Imagens de altíssima resolução (ex: fotos de câmeras de celular com 4000x3000px como `sistemaejc2.png`) ao serem carregadas em Canvas com limite de zoom estático travavam o enquadramento sem permitir reduzir o suficiente para que a arte inteira entrasse no círculo do botton.
- **Solução Técnica**:
  - **Auto-Fit Inicial**: Ao carregar qualquer imagem no `BottonPreviewModal.jsx`, calcular o fator de escala inicial `initialScale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)`.
  - **Slider de Zoom de Amplitude Expandida**: Permitir valores de zoom de `0.1x` até `5.0x` relativos ao `initialScale`. Dessa forma, fotos gigantescas podem ser reduzidas facilmente a 10% da escala inicial para enquadramento perfeito, e fotos pequenas podem ser ampliadas em até 500%.
  - **Modal Mobile-First**: O modal fixa o viewport no celular (`fixed inset-0 z-50 overflow-y-auto bg-black/75`), com touch events nativos para arrastar a imagem e slider de zoom na parte inferior.

## 3. Gestão de Clientes Compradores

- **Padrão de Dados**: Tabela `customers` vinculada aos pedidos pela chave estrangeira `customer_id` ou pelo número de telefone/CPF.
- **Campos do Cadastro**:
  - `name`: Nome completo.
  - `phone`: Telefone (chave primária/busca rápida).
  - `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zip_code`: Endereço completo.
  - `cpf`: Opcional (salvo como `NULL` se omitido no formulário).

## 4. Segurança & RBAC

- Roles disponíveis: `admin` e `funcionario`.
- Tabela `users` ganha a coluna `role VARCHAR(20) DEFAULT 'funcionario'`.
- Middleware `requireRole(['admin'])` protege a rota de faturamento (`/api/admin/dashboard`), rota de criação de usuários admin (`/api/admin/users`) e rota de alteração de chaves (`/api/admin/config`).
- Rota de produtos (`/api/admin/products`) e Fila de Prensa são liberadas para `requireRole(['admin', 'funcionario'])`, autorizando funcionários a alterar estoques e preços de produtos.
