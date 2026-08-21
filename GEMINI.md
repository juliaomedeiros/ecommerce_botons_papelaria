# 📖 Guia do Projeto Tuta's Paper & Instruções para Agentes IA / LLMs

> **INSTRUÇÃO PARA QUALQUER LLM / AGENTE IA:** Ao iniciar ou retornar a esta sessão, LEIA ESTE ARQUIVO na íntegra para entender a arquitetura completa do projeto e consulte o arquivo **`melhorias.md`** na raiz do repositório. Quaisquer itens em `melhorias.md` marcados com **`[ ]`** estão pendentes de execução e devem ser implementados quando solicitados pelo usuário.

---

## 🏛️ Arquitetura Geral do Sistema (Tuta's Paper v2.0)

O **Tuta's Paper** é um e-commerce e sistema de gestão operacional para fabricação de bottons, itens de papelaria e artigos religiosos, migrado para a seguinte stack de alta performance:

### ⚙️ Backend: Python 3.12 + FastAPI 0.111 (`backend/app/`)
- **FastAPI / Uvicorn (ASGI):** Servidor REST assíncrono rodando na porta `5000`.
- **SQLAlchemy 2.0 Async + asyncpg:** ORM assíncrono conectado ao banco relacional PostgreSQL 16.
- **Pydantic v2:** Schemas de validação de payload em `backend/app/schemas/schemas.py`.
- **Swagger UI:** Documentação OpenAPI nativa disponível em **`http://localhost:5000/docs`**.
- **Autenticação:** JWT com senhas salted por Bcrypt para contas administrativas em `backend/app/routers/auth.py`.

### 💻 Frontend: Vue 3 (Composition API) + Tailwind CSS v3 (`frontend/src/`)
- **Vue 3 + Vite 5.2:** SPA reativa ultra-rápida.
- **Tailwind CSS v3:** Estilização responsiva e elegante com redução de 64% no bundle JS/CSS (`frontend/src/assets/main.css`).
- **Vue Router 4.3:** Roteamento de páginas para `/` (`StoreView.vue`) e `/admin` (`AdminView.vue`).

### 🐘 Banco de Dados & Infraestrutura (Docker Compose)
- **PostgreSQL 16:** Armazena produtos, matérias-primas físicas (`raw_materials_stock`), o **Livro Razão imutável (`stock_movements`)**, pedidos e clientes.
- **Evolution API (evoapicloud/evolution-go):** Engine de WhatsApp em Golang (`http://localhost:8080/manager`) para notificações de pedidos.

---

## 📂 Estrutura de Pastas do Projeto

```
sistema_tutaspaper/
├── backend/
│   ├── app/
│   │   ├── main.py              # Entrada da API FastAPI
│   │   ├── config.py            # Variáveis de ambiente e Pydantic Settings
│   │   ├── database.py          # Conexão Async SQLAlchemy + asyncpg
│   │   ├── models/models.py     # Modelos ORM (Product, Category, Stock, Order, OrderItem, Customer, StoreConfig)
│   │   ├── schemas/schemas.py   # Validações Pydantic v2
│   │   └── routers/             # Controllers REST (auth, products, stock, orders, config_router)
│   ├── requirements.txt         # Dependências Python 3.12
│   └── Dockerfile.backend       # Imagem Python-slim com Uvicorn
│
├── frontend/
│   ├── src/
│   │   ├── assets/main.css      # Diretivas Tailwind CSS v3
│   │   ├── views/
│   │   │   ├── StoreView.vue    # E-commerce Público com Catálogo e Checkout
│   │   │   └── AdminView.vue    # Painel Admin com 8 Abas Operacionais
│   │   ├── App.vue              # Componente Raiz Vue 3
│   │   └── main.js              # SPA Entrypoint com Vue Router e Pinia
│   ├── index.html               # Ponto de montagem Vue 3 (<div id="app">)
│   ├── vite.config.js           # Configuração do Vite
│   ├── tailwind.config.js       # Configuração de temas Tailwind CSS
│   └── Dockerfile.frontend      # Nginx container na porta 80
│
├── melhorias.md                 # BACKLOG & TAREFAS PENDENTES PARA LLMs
├── docker-compose.yml           # Infraestrutura unificada Docker
└── README.md                    # Manual do usuário e documentação geral
```

---

## 📋 Regras de Negócio & Princípios do Sistema

1. **Estoque Central por Insumo Físico Combinado:** O estoque de bottons é gerenciado centralizadamente na tabela `raw_materials_stock` por pares de **Diâmetro × Acabamento** (`25mm_alfinete`, `38mm_alfinete`, `25mm_chaveiro`, `38mm_chaveiro`, `25mm_ima`, `38mm_ima`).
2. **Livro Razão Imutável (`stock_movements`):** Toda movimentação (Entrada de Compra, Saída por Venda, Perda em Prensa, Ajuste) grava um registro no Livro Razão.
3. **Métricas Financeiras no Dashboard:** Cálculo dinâmico em tempo real de $\text{Lucro Líquido Real} = \text{Faturamento} - \text{CMV} - \text{Perdas}$.
4. **Painel Admin em 8 Abas:** 1. Dashboard, 2. Fila de Pedidos, 3. Produtos, 4. Categorias, 5. Insumos Físicos, 6. Histórico & Razão, 7. Clientes Compradores, 8. Integrações & Configurações.
5. **Cards Independentes de Integração:** Evolution API (com link direto para o Manager `8080/manager` e WhatsApp do Admin), Modo Evento 24h e Mercado Pago (com public key, token e ambiente sandbox/produção).

---

## 🎯 Instruções de Redirecionamento para LLMs / Agentes

Quando qualquer LLM/Agente abrir este repositório:
1. Verifique o arquivo **`melhorias.md`** na raiz.
2. Identifique os itens marcados com **`[ ]`**.
3. Implemente as tarefas pendentes de forma aditiva sem quebrar o código existente.

# Reversa

> Framework de Engenharia Reversa instalado neste projeto.

## Como usar

Use o fluxo adequado no chat:

- `/reversa` — descobrir e documentar um sistema existente
- `/reversa-new` — criar PRD e specs para um projeto novo
- `/reversa-forward` — implementar ou evoluir código a partir das specs
- `/reversa-migrate` — planejar a migração de um sistema legado
- `/reversa-docs` — gerar o mini-site visual da documentação
- `/reversa-agents-help` — consultar o catálogo completo de agentes
