---
id: BUG-20260810-IMG1-infinite-loop-image-onerror
display_number: BUG-008
title: Request em loop infinito no devtools (onError img) e armazenamento de fotos no PostgreSQL
context: catalogo-e-categorias
severity: high
priority: p1
status: resolved
phase: closure
created_at: 2026-08-10T16:26:00-03:00
updated_at: 2026-08-10T16:33:20-03:00
reporter: juliao
affected_code:
  - frontend/src/components/AdminDashboard.jsx
  - frontend/src/components/Catalog.jsx
  - frontend/src/components/BottonMockupDisplay.jsx
  - frontend/src/components/ProductDetailModal.jsx
root_cause:
  state: confirmed
  description: As fotos enviadas via upload no Admin eram armazenadas temporariamente em pasta estática do arquivo ao invés de serem gravadas diretamente como Data URI na coluna image_url do banco de dados PostgreSQL. Além disso, o callback onError das tags <img> reatribuía o fallback sem anular e.target.onerror = null.
traceability:
  spec_ref: _reversa_sdd/domain.md#produtos
  code_ref: frontend/src/components/AdminDashboard.jsx#L256
---

# BUG-008: Request em loop infinito no devtools (onError img) e armazenamento de fotos no PostgreSQL

## 1. Descrição do Defeito

As imagens dos produtos enviados via upload a partir do computador no Admin não estavam sendo gravadas de forma permanente no banco de dados, causando falhas de carregamento e disparando requisições em loop infinito no DevTools para o fallback externo do Unsplash.

## 2. Passos para Reproduzir

1. Acesse o Painel Admin em `/admin` -> Aba **Produtos**.
2. Selecione uma foto no computador para cadastrar um produto.
3. Observe que o caminho não ficava gravado diretamente na coluna `image_url` do banco PostgreSQL, disparando erro de carregamento e requisições externas em loop.

## 3. Causa Raiz Confirmada

1. O upload em pasta física temporária não persistia a foto diretamente na tabela `products` do PostgreSQL.
2. O callback `onError` das imagens reatribuía URLs externas sem anular o evento `onerror = null` e sem utilizar um Data URI de SVG puro como fallback resiliente.

## 4. Plano de Correção

1. Atualizar o `handleProductFileUpload` para converter a foto do computador em Base64 Data URI via `FileReader.readAsDataURL()`.
2. Gravar o Data URI da foto diretamente na coluna `image_url` (tipo `TEXT`) da tabela `products` no PostgreSQL.
3. Substituir a URL externa do Unsplash por um placeholder em SVG Data URI sem requisição de rede em todos os componentes.

## 5. Resolução

- **Veredito de Spec:** `spec-correta` (o armazenamento permanente de imagens na tabela de produtos no banco de dados e a resiliência sem requisições externas em loop era o comportamento esperado).
- **Alterações Aplicadas:**
  - `CHG-001`: `frontend/src/components/AdminDashboard.jsx` — `handleProductFileUpload` atualizado para Base64 Data URI e gravado diretamente na tabela `products` do PostgreSQL. Ocorrências de `onError` atualizadas com `e.target.onerror = null` e SVG Data URI.
  - `CHG-002`: `frontend/src/components/Catalog.jsx` — Inserido `e.target.onerror = null` e SVG Data URI.
  - `CHG-003`: `frontend/src/components/BottonMockupDisplay.jsx` — Inserido `e.target.onerror = null` e SVG Data URI.
  - `CHG-004`: `frontend/src/components/ProductDetailModal.jsx` — Inserido `e.target.onerror = null` e SVG Data URI.
