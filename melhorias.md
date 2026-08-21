# 🚀 Roadmap & Melhorias Futuras (Backlog do Projeto Tuta's Paper)

> **Instrução para qualquer LLM/Agente:** Leia este arquivo ao iniciar uma sessão. Itens marcados com `[ ]` estão pendentes e devem ser implementados quando solicitados. Itens marcados com `[X]` já estão 100% concluídos.

---

## 📌 Status Atual do Projeto
- **Backend:** Python 3.12 / FastAPI 0.111 (`backend/app/`) com SQLAlchemy 2.0 Async + asyncpg + Pydantic v2.
- **Frontend:** Vue 3 (Composition API) + Vite + Tailwind CSS v3 (`frontend/src/`).
- **Banco de Dados:** PostgreSQL 16 com tabelas de produtos, insumos físicos (`raw_materials_stock`), Livro Razão (`stock_movements`) e clientes.
- **WhatsApp:** Evolution API em Golang (`http://localhost:8080/manager`).
- **Painel Admin:** `http://localhost/admin` com 8 abas funcionais (Dashboard, Fila de Pedidos, Produtos, Categorias, Insumos Físicos, Livro Razão, Clientes, Integrações).

---

## 🎨 Tarefas & Melhorias Futuras (Backlog)

### 1. 🖼️ Personalizador Circular Canvas 300DPI & Categoria "Bottons Personalizados"
- [ ] **RF-MELH-01 (Botão Personalizar no Hero/Header):** Criar o botão **`🎨 Personalize com uma imagem`** posicionado ao lado do botão **`📐 Guia de Tamanhos (25mm x 38mm)`** na vitrine da loja (`StoreView.vue`).
- [ ] **RF-MELH-02 (Modal Personalizador Circular Canvas 300DPI):** Ao clicar em "Personalize com uma imagem", abrir um modal dedicado com um Canvas HTML5 onde o comprador pode:
  - Fazer upload da sua própria foto/arte a partir do celular ou computador.
  - Ajustar o zoom, reposicionar a imagem e visualizar o recorte em círculo perfeito.
  - Selecionar o diâmetro desejado (**25mm** ou **38mm**).
  - Selecionar o acabamento traseiro (**🧷 Alfinete de Metal**, **🔑 Chaveiro 2 Faces** ou **🧲 Ímã de Geladeira**).
  - Exportar a prévia circular ajustada para o carrinho e enviá-la em 300DPI para a Fila de Pedidos do Admin.
- [ ] **RF-MELH-03 (Diferenciação de Categorias):**
  - **Categoria "Bottons":** Reservada estritamente para produtos de pronta entrega com estampas já definidas e cadastradas no catálogo pelo Admin.
  - **Categoria "Bottons Personalizados":** Categoria exclusiva destinada às criações sob medida feitas via personalizador Canvas pelo comprador.

---

## 🟢 Itens Concluídos (`[X]`)

- [X] Migração da stack técnica de Node.js/React para Python FastAPI + Vue 3 Tailwind CSS.
- [X] Painel Admin com 8 abas organizadas (Fila de Pedidos na 2ª aba).
- [X] Cards independentes de integração (Evolution API com link para o Manager `8080/manager`, Mercado Pago com token/public key, e Modo Evento 24h).
- [X] Upload de imagens locais do PC no formulário do Admin com armazenamento em `/uploads/`.
- [X] Modal de visualização de bottons com alternância entre **Frente (Estampa)** e **Verso Metálico (Alfinete/Chaveiro/Ímã)**.
- [X] Autopreenchimento de dados por número de WhatsApp no Checkout.
- [X] Livro Razão de Movimentações (`stock_movements`), CMV, Perdas na Prensa e Lucro Líquido Real.
