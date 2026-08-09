# Requisitos: Vínculo de Categorias no Admin & Mockup Visual de Bottons (Frente e Verso)

> Identificador: `003-categorias-e-mockup-botton`
> Data: `2026-08-09`
> Bug Relacionado: `BUG-20260809-C4T1`

## Resumo Executivo
Esta especificação atende a dois requisitos fundamentais para a experiência do e-commerce Tuta's Paper:
1. **Correção do Bug `BUG-20260809-C4T1`**: Permitir a escolha da categoria no formulário de produtos no Painel Admin (`/admin`), vinculando o produto às abas do e-commerce público (`/home`).
2. **Mockup Visual de Botton (Frente & Verso)**: Apresentar os produtos de pronta entrega da categoria Bottons em um componente interativo que simula a peça física (frente com estampa em alta resolução e prensa de acetato + verso em metal mostrando alfinete, chaveiro ou ímã de geladeira).

## Requisitos Funcionais (RF)

### RF001 — Dropdown de Categorias no Formulário Admin
- O Painel Admin (`AdminDashboard.jsx`) deve carregar dinamicamente a lista de categorias (`GET /api/categories`).
- O formulário de produto deve conter um campo seletor `<select>` listando todas as categorias ativas.
- Ao salvar o produto (`POST /api/admin/products` e `PUT /api/admin/products/:id`), o `category_id` deve ser gravado e retornado corretamente.
- A tabela de produtos no Admin deve exibir o nome da categoria associada a cada item.

### RF002 — Visualização em Mockup de Botton (Frente e Verso)
- Produtos vinculados à categoria de Bottons devem ser renderizados usando o novo componente `BottonMockupDisplay.jsx`.
- O mockup da **Frente** deve exibir a imagem ajustada em círculo perfeito com prensa de acetato 3D (sombra e brilho metálico).
- O mockup do **Verso** deve simular a parte traseira de metal com os acabamentos selecionáveis:
  - **Alfinete de Metal**: Alfinete de segurança traseiro.
  - **Chaveiro**: Argola e corrente superior.
  - **Ímã de Geladeira**: Disco de ferrite magnético.
- O comprador deve poder alternar entre a visão de **Frente** e **Verso** no card do produto e no modal de detalhes (`ProductDetailModal.jsx`).

## Requisitos Não-Funcionais (RNF)
- **RNF001**: O componente de mockup deve ser responsivo e performático no navegador sem exigir carregamento de imagens pesadas de terceiros.
- **RNF002**: Manter retrocompatibilidade total com produtos já cadastrados e sem categoria (`category_id: null`).
