# 🎨 Tuta's Paper — E-commerce de Bottons, Chaveiros & Ímãs

> **Plataforma web completa e conteinerizada para e-commerce de papelaria artesanal, bottons e produtos religiosos, com personalizador visual em tempo real, painel de controle noturno de produção e disparo de notificações via WhatsApp (Evolution Go).**

---

## 🎯 Sobre o Sistema & Objetivo

O **Tuta's Paper** é um e-commerce moderno e responsivo projetado para a venda de **bottons, chaveiros e ímãs de geladeira** nos diâmetros padronizados de **25mm** e **38mm**, além de artigos de papelaria e produtos religiosos.

### 📍 Objetivo Principal:
Proporcionar uma experiência de compra ágil e encantadora para o cliente — seja na compra de **modelos pré-prontos do catálogo** ou na **personalização com imagens próprias** — integrada a um painel administrativo que organiza a fila noturna de prensas e automatiza os avisos via WhatsApp sem risco de banimento.

---

## ✨ Principais Funcionalidades

### 🛒 1. Vitrine Focada no Catálogo & Personalização
* **Catálogo por Categorias:** Exibição organizada de modelos pré-prontos (Religiosos, Papelaria, Marcas) com foto, descrição e seleção de diâmetro e acabamento.
* **Personalize com uma Imagem:** Botão de destaque para acionar o personalizador circular com imagens enviadas pelo próprio comprador.

### 📐 2. Guia de Tamanhos Interceptador
* Exibição clara e explicativa das proporções reais de **25mm (discreto)** e **38mm (padrão)**.
* Apresentado obrigatoriamente antes de abrir o personalizador de imagem (*"Entendi, escolher meu botton"*) e como confirmação ao adicionar modelos prontos ao carrinho.

### 🎨 3. Personalizador Canvas com Zoom Ampliado
* **Edição Circular em Tempo Real:** Prévia fiel de como o botton ficará após a prensa de metal e acetato.
* **Instruções Visuais de Arraste:** Orientações para posicionar a imagem no centro do círculo.
* **Slider de Zoom de Longo Alcance (0.2x a 3.0x):** Redimensionamento amplo para imagens de qualquer resolução.
* **Exportação HD em 300DPI:** Geração automática da imagem recortada redonda para a prensa.

### ⚙️ 4. Variantes de Produto Flexíveis
* Escolha de diâmetro: **25mm (2,5 cm)** ou **38mm (3,8 cm)**.
* Escolha de acabamento: **Alfinete de Metal**, **Chaveiro** ou **Ímã de Geladeira**.

### ⚡ 5. Flag de Modo Evento 24h no Admin
* O administrador ativa ou desativa o **Modo Evento 24h** em tempo real no painel.
* **Modo Evento Ativo:** Exibe banner chamativo no topo da loja, altera a frase do Hero para *"Seu botton em 24 Horas"* e inclui badges expressas nos produtos.
* **Modo Evento Desativado:** Mantém a frase do dia a dia e informa o prazo padrão de **5 dias úteis** no Checkout.

### 💳 6. Checkout Mercado Pago
* Pagamento seguro e transparente com **Pix (QR Code / Copia e Cola)** e **Cartão de Crédito**.

### 🔐 7. Painel Administrativo Completo (`/admin`)
Acessível direto pelo botão de cadeado no topo da loja ou navegando pela URL **`http://localhost/admin`**:
* **📅 Fila Noturna de Produção:** Tabela contendo Nome do Cliente, Telefone, Imagem Recortada Redonda, Link para Imagem Original, Prazo Registrado e Botões de Status (*Iniciar Prensa* / *Pronto para Envio*).
* **🏷️ Gestão de Categorias:** Cadastro e atualização das categorias do catálogo.
* **📦 Gestão de Estoque Central de Insumos:** Controle por par de diâmetro x acabamento (`25mm_alfinete`, `38mm_alfinete`, etc.) sem necessidade de digitação manual de estoque por produto.
* **📜 Livro Razão de Estoque (`stock_movements`):** Registro imutável de todas as compras de matérias-primas, saídas automáticas por vendas e perdas de prensagem com cálculo financeiro.
* **⚙️ Painel de Integrações:** Gerenciamento das chaves do Mercado Pago, Evolution API e alternância do Modo Evento 24h.

---

## 🛠️ Tecnologias, Bibliotecas & Dependências

### 💻 Frontend (Interface & Experiência do Usuário)
* **[Vue 3 (Composition API)](https://vuejs.org/):** Framework progressivo de altíssima performance para interfaces reativas.
* **[Vite 5.2](https://vitejs.dev/):** Ferramenta de build de última geração com HMR instantâneo.
* **[Tailwind CSS v3](https://tailwindcss.com/):** Framework CSS utilitário para design responsivo, elegante e leve (redução de 64% no bundle JS/CSS).
* **[Pinia 2.1](https://pinia.vuejs.org/):** Gerenciador de estado oficial e previsível do Vue.
* **[Vue Router 4.3](https://router.vuejs.org/):** Roteamento SPA desacoplado para `/` (Loja) e `/admin` (Painel Administrativo).
* **[Lucide Vue Next](https://lucide.dev/):** Ícones vetoriais modernos e performáticos.
* **HTML5 Canvas API:** Engine gráfica nativa no navegador para ajuste, zoom e exportação circular em 300DPI (`toDataURL('image/png')`).

### ⚙️ Backend (API RESTful de Alta Performance)
* **[Python 3.12](https://www.python.org/):** Linguagem de programação moderna, concisa e de alto nível.
* **[FastAPI 0.111](https://fastapi.tiangolo.com/):** Framework web assíncrono moderno com suporte nativo a **Pydantic v2** e OpenAPI/Swagger automático.
* **[Uvicorn 0.30](https://www.uvicorn.org/):** Servidor ASGI assíncrono de altíssima velocidade para produção.
* **[SQLAlchemy 2.0 Async](https://www.sqlalchemy.org/):** ORM assíncrono robusto alimentado pelo driver **`asyncpg`**.
* **[PyJWT & Passlib (Bcrypt)](https://pyjwt.readthedocs.io/):** Autenticação JWT segura com salted password hashing para os administradores.

### 📱 Engine de WhatsApp & Banco de Dados
* **[Evolution Go (evoapicloud/evolution-go)](https://github.com/evolution-foundation/evolution-go):** Engine de WhatsApp reescrita em Golang (~30MB RAM) com simulação de digitação e delay humanizado anti-ban.
* **[PostgreSQL 16](https://www.postgresql.org/):** Banco de dados relacional que armazena os produtos, insumos físicos e o **Livro Razão (`stock_movements`)**.

---

## 🚀 Como Executar o Projeto & Endereços de Acesso

Toda a infraestrutura do projeto roda em contêineres Docker com um único comando:

### 1. Executar no Docker:
```bash
docker compose up -d --build
```

### 2. Mapeamento Completo de Portas e URLs:

| Serviço | Porta | URL de Acesso | Descrição |
|---------|-------|---------------|-----------|
| 🛒 **E-commerce público** | `80` | `http://localhost` | Vitrine pública em Vue 3 + Tailwind CSS |
| 🔐 **Painel Admin Direto** | `80` | `http://localhost/admin` | Painel de controle em Vue 3 + Pinia |
| 📄 **Documentação Swagger API** | `5000` | `http://localhost:5000/docs` | Swagger UI interativo do FastAPI |
| ⚙️ **Backend REST API** | `5000` | `http://localhost:5000/api/health` | API Python 3.12 / FastAPI 0.111 |
| 📱 **Evolution Go Manager** | `8080` | `http://localhost:8080/manager` | Painel QR Code do WhatsApp |
| 🐘 **PostgreSQL Database** | `5432` | `localhost:5432` | Banco de dados relacional |

### 🔄 Guia de Navegação Direta na Aplicação:
- **Para ir da Loja ao Admin:** Clique no ícone de **Cadeado (Acesso Admin)** no cabeçalho ou navegue diretamente para `http://localhost/admin`.
- **Para ir do Admin à Loja:** Clique no botão **`Voltar ao E-commerce`** no cabeçalho do painel para retornar instantaneamente à vitrine em `http://localhost`.

### 🔑 Credenciais Padrão do Admin:
* **E-mail:** `admin@tutaspapeis.com.br`
* **Senha:** `admin123`

---

## 📄 Licença

Este projeto é mantido pelo **Tuta's Paper**. Todos os direitos reservados.
