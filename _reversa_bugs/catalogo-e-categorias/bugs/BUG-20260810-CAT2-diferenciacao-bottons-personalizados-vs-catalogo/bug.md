---
id: BUG-20260810-CAT2-diferenciacao-bottons-personalizados-vs-catalogo
display_number: 11
title: Exibição Exclusiva de Mockup 3D em Bottons do Catálogo e Fluxo Canva/Decisão de Carrinho em Bottons Personalizados
context: catalogo-e-categorias
severity: high
priority: p0
status: resolved
phase: closure
resolution_kind: fixed
created_at: 2026-08-10T20:02:00-03:00
updated_at: 2026-08-10T20:08:00-03:00
reporter: juliao
affected_code:
  - frontend/src/components/Catalog.jsx
  - frontend/src/components/AddToCartSuccessModal.jsx
  - frontend/src/App.jsx
root_cause:
  state: confirmed
  description: A verificação isBottonProduct em Catalog.jsx ativava o BottonMockupDisplay para personalizados. Além disso, faltava o modal de decisão AddToCartSuccessModal pós-personalização no Canva 3D.
traceability:
  spec_ref: _reversa_sdd/domain.md#produtos
  code_ref: frontend/src/components/Catalog.jsx#L114
closure:
  satisfied: true
---

# BUG-011: Exibição Exclusiva de Mockup 3D em Bottons do Catálogo e Fluxo Canva/Decisão de Carrinho em Bottons Personalizados

## 1. Descrição do Defeito

Produtos da categoria **Bottons Personalizados** exibiam o mockup 3D rotativo nos cards do catálogo quando deveriam exibir uma imagem normal estática. E faltava o popup de decisão (Ir para o Pagamento vs Continuar Comprando) ao adicionar o item customizado ao carrinho.

## 2. Causa Raiz Confirmada

* `Catalog.jsx` aplicava o mockup 3D para qualquer produto com a palavra "botton" no nome/categoria.
* `App.jsx` abria diretamente a gaveta do carrinho ao adicionar um botton customizado sem oferecer a opção ao cliente de continuar comprando.

## 3. Resolução Aplicada (`FIXED`)

1. **`Catalog.jsx`:**
   * Condicionado o `<BottonMockupDisplay>` (giro 3D frente/verso) **exclusivamente** para produtos não-personalizáveis da categoria **Bottons** (`prod.category_id === 'cat-bottons-001' && !prod.is_customizable`).
   * Produtos da categoria **Bottons Personalizados** (`is_customizable === true`) exibem a **imagem estática normal (`<img>`)**.
   * O botão no card de personalizados é obrigatoriamente **"✨ Personalize com sua imagem"**, abrindo o Canva 3D (`BottonPreviewModal`).
2. **`AddToCartSuccessModal.jsx`:**
   * Criado o componente de popup flutuante de confirmação (Opção 1) exibindo o item adicionado e duas opções claras:
     - 💳 **"Ir para o Pagamento"** (navega para o Checkout/Carrinho).
     - 🛍️ **"Continuar Comprando"** (fecha o popup e permite continuar no catálogo).
3. **`App.jsx`:**
   * Integrado o `AddToCartSuccessModal` ao fluxo de adição ao carrinho do Canva 3D e catálogo.
