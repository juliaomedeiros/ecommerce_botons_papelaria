# Investigação Técnica: Evolution API v2 no Docker & Roteamento Nginx `/admin`

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`

## 1. Pesquisa sobre o Contêiner Docker Evolution API

A Evolution API é uma API aberta em Node.js/TypeScript para integração nativa com o WhatsApp.
Para rodar no Docker junto com o PostgreSQL do Tuta's Paper:
- Imagem: `atendai/evolution-api:v2.1.1`
- Porta exposta: `8080:8080`
- Variáveis de ambiente principais:
  - `SERVER_URL=http://localhost:8080`
  - `AUTHENTICATION_API_KEY=tutas_evolution_key`
  - `DATABASE_ENABLED=false` (ou SQLite interno para instâncias leves)
  - `DEL_INSTANCE=false`

## 2. Roteamento Nginx para `/admin`

No `Dockerfile.frontend`, o Nginx serve a pasta `dist`. Para garantir que URLs como `http://localhost/admin` redirecionem para a Single Page Application (SPA) React sem dar erro 404 de servidor, a diretiva Nginx `try_files $uri $uri/ /index.html;` deve ser mantida na configuração do Nginx.

No frontend React (`App.jsx`), a verificação de `window.location.pathname === '/admin'` abre automaticamente a visão do Admin de forma fullscreen/dedicada.
