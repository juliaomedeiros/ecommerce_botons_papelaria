# Transformação: Reestruturação da Navegação e Restauração da Aba do Livro Razão

> Identificador: `OPP-011-restructure-rotas-e-aba-razao`
> Data: `2026-08-20`

## 1. Smells Identificados & Refatorações Aplicadas (Catálogo Fowler)

1. **Missing Navigation Tab (Aba Oculta / Inacessível):**
   - *Smell:* A aba do Livro Razão (`activeTab === 'stock_history'`) existia no render das tabelas, mas não possuía um botão dedicado na barra superior principal do Admin.
   - *Refatoração (Fowler):* **Introduce Explicit Navigation Component** — Adicionado o botão da aba **`<History /> Histórico & Razão de Estoque`** na barra principal de navegação do Admin.

2. **Unprotected Optional Chaining & Null Handling:**
   - *Smell:* Chamadas diretas de `.toFixed(2)` em propriedades assíncronas de objetos `dashboardStats` geravam unhandled `TypeError` durante o F5/refresh, fazendo com que o React travasse em tela branca.
   - *Refatoração (Fowler):* **Introduce Null Object / Guard Clauses** — Inserido encadeamento opcional `(dashboardStats?.property || 0).toFixed(2)` e rotina de deslogamento gracioso em caso de token 401/403.

## 2. Status dos Testes de Caracterização

- Build Vite/Nginx: 🟢 PASSING (1.93s)
- Proteção de Rota `/admin`: 🟢 PASSING
