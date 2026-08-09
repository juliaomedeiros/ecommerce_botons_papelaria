---
schema_version: 1
id: BUG-20260809-C4T1
display_number: 1
title: Dropdown de categorias no formulário do Admin não exibe nem vincula categorias das abas do /home
status: resolved
phase: patching
severity: medium
priority: P1
created: 2026-08-09
updated: 2026-08-09

origin:
  type: manual-report
  external_ref: null

area: catalogo
module: categorias
feature: dropdown-categorias
labels:
  - spec-gap
  - ux

visibility: normal
security_suspected: false

reproduction:
  classification: deterministic
  rate: "10/10"
  suspected_triggers: []

blocking: []
relationships: []

traceability:
  specs:
    - _reversa_sdd/prd.md#categorias-e-produtos
  affected_code:
    - frontend/src/components/AdminDashboard.jsx#L346
    - frontend/src/components/AdminDashboard.jsx#L848-L856
    - frontend/src/components/Catalog.jsx#L85-L115
  root_cause:
    state: confirmed
    hypothesis: "Fórmula e payload de cadastro enviavam category_id null fixo sem dropdown de seleção no admin."
  reproduction_tests: []
  regression_tests:
    - frontend/package.json (npx vite build)

spec_verdict: spec-correta
change_set:
  - id: CHG-001
    kind: code
    artifact: frontend/src/components/AdminDashboard.jsx
    purpose: Carregar categorias dinâmicas via API e adicionar dropdown no formulário de produtos do Admin.
  - id: CHG-002
    kind: code
    artifact: frontend/src/components/BottonMockupDisplay.jsx
    purpose: Criar mockup visual de botton (frente estampada 3D + verso com alfinete/chaveiro/ímã).

closure:
  policy: local-software
  satisfied: true
resolution_kind: fixed
---

# BUG-20260809-C4T1: Dropdown de categorias no formulário do Admin não exibe nem vincula categorias das abas do /home

## Summary
Ao cadastrar um novo produto no Painel Administrativo (`/admin`), o formulário de cadastro não possuía um campo seletor (`<select>`) para associar o produto às categorias existentes ("Bottons, Chaveiros & Ímãs", "Artigos Religiosos", "Materiais de Papelaria").

## Resolution
- Adicionada a busca dinâmica de categorias (`GET /api/categories`) e o estado `prodCategoryId` em `AdminDashboard.jsx`.
- Adicionado o elemento `<select>` no formulário de produtos do Admin permitindo escolher qualquer categoria cadastrada.
- Payload de criação atualizado com `category_id: prodCategoryId || null`.
- Criado o componente `BottonMockupDisplay.jsx` para apresentar visualmente os bottons com a frente redonda estampada e o verso metálico (alfinete/chaveiro/ímã) no e-commerce público.
