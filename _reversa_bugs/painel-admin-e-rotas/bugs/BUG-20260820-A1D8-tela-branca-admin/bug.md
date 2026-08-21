---
id: BUG-20260820-A1D8
display_number: 1
context: painel-admin-e-rotas
title: Tela branca ao acessar ou atualizar a rota /admin devido a History nao importado do lucide-react
status: closed
phase: verified
severity: critical
priority: P0
security_suspected: false
visibility: public
area: admin
module: autenticacao
feature: painel-admin-e-rotas
origin:
  type: manual-report
created_at: 2026-08-20T20:21:00Z
updated_at: 2026-08-20T20:27:15Z
closure_policy: regression-tests
traceability:
  specs:
    - _reversa_sdd/prd.md#9.-Critérios-de-aceite-(alto-nível)
  affected_code:
    - frontend/src/components/AdminDashboard.jsx
    - frontend/src/App.jsx
    - backend/src/controllers/orderController.js
---

# BUG-20260820-A1D8: Tela branca ao acessar ou atualizar a rota /admin [RESOLVIDO RE-VERIFICADO]

## 1. Causa Raiz Definitiva Identificada
O componente `<History />` do `lucide-react` foi adicionado à barra de abas superiores em `AdminDashboard.jsx`, porém o símbolo `History` não havia sido incluído na declaração de `import { ... } from 'lucide-react'`.
No momento do render no navegador, a tentativa de renderizar um símbolo `undefined` disparava um erro fatídico no React (`Element type is invalid: expected a string or a class/function but got: undefined`), provocando a tela branca em tempo de execução.

## 2. Solução Aplicada
1. Adicionado o símbolo `History` aos imports do `lucide-react` no cabeçalho do `AdminDashboard.jsx`.
2. Executado build da aplicação via `npm --prefix frontend run build`.
3. Atualizado o contêiner Docker do frontend (`docker compose up -d --build frontend`).
