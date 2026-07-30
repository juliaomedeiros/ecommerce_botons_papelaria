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
Acessível direto pelo botão de cadeado no topo do site ou pela URL **`http://localhost/admin`**:
* **📅 Fila Noturna de Produção:** Tabela contendo Nome do Cliente, Telefone, Imagem Recortada Redonda, Link para Imagem Original, Prazo Registrado e Botões de Status (*Iniciar Prensa* / *Pronto para Envio*).
* **🏷️ Gestão de Categorias:** Cadastro e atualização das categorias do catálogo.
* **⚙️ Painel de Integrações:** Gerenciamento das chaves do Mercado Pago, Evolution API e alternância do Modo Evento.

### 🛡️ 8. Notificações WhatsApp & Mecanismo Anti-Ban (Evolution Go)
* Integração com o **Evolution Go** (`evoapicloud/evolution-go`), motor de alta performance em Go (Golang) com baixo consumo de memória RAM (~30MB).
* **Fila FIFO em Memória:** Mensagens enfileiradas sequencialmente sem disparos em rajada.
* **Simulador de Digitação (`composing`):** Envia o sinal *"Digitando..."* por 2 a 4 segundos antes de cada envio.
* **Delay Humanizado Aleatório:** Pausas randômicas de **5 a 15 segundos** entre cada mensagem para total segurança contra bloqueios da Meta/WhatsApp.

---

## 🛠️ Tecnologias, Bibliotecas & Dependências

Abaixo está o detalhamento completo de todas as tecnologias e bibliotecas utilizadas no ecossistema da aplicação:

### 💻 Frontend (Interface & Experiência do Usuário)
* **[React 18.3](https://react.dev/):** Biblioteca JavaScript para construção de interfaces reativas baseadas em componentes.
* **[React DOM 18.3](https://react.dev/):** Renderizador do React para manipulação no navegador.
* **[Vite 5.2](https://vitejs.dev/):** Ferramenta de build moderna e bundler de alta performance.
* **[Lucide React 0.380](https://lucide.dev/):** Conjunto de ícones vetoriais elegantes e leves.
* **HTML5 Canvas API:** Engine gráfica no navegador para manipulação, zoom (`0.2x-3.0x`), arraste e exportação das prévias redondas em 300DPI (`toDataURL('image/png')`).
* **Vanilla CSS3 (Design System Customizado):** Utilização das variáveis de cor oficiais (`#173440` e `#3fb9c8`), efeito Glassmorphism, badges responsivos e animações fluidas.

### ⚙️ Backend (API REST & Regras de Negócio)
* **[Node.js 18](https://nodejs.org/):** Ambiente de execução JavaScript no servidor.
* **[Express 4.19](https://expressjs.com/):** Framework web minimalista para construção de endpoints RESTful e middlewares.
* **[pg 8.11 (PostgreSQL Client)](https://node-postgres.com/):** Driver oficial para comunicação e queries assíncronas com o PostgreSQL.
* **[jsonwebtoken 9.0 (JWT)](https://jwt.io/):** Geração e validação de tokens cifrados para autenticação segura do Painel Admin (expiração de 24h).
* **[bcryptjs 2.4](https://github.com/dcodeIO/bcrypt.js):** Criptografia de via única (hash salted) para armazenar senhas de acesso do administrador com segurança.
* **[multer 1.4](https://github.com/expressjs/multer):** Middleware para gerenciamento de uploads de imagens multipart/form-data.
* **[cors 2.8](https://github.com/expressjs/cors):** Controle de políticas de compartilhamento de recursos entre origens (CORS).
* **[canvas 2.11 (Node-Canvas)](https://github.com/Automattic/node-canvas):** Biblioteca nativa baseada em Cairo e Pango para manipulação server-side de gráficos e imagens.
* **[dotenv 16.4](https://github.com/motdotla/dotenv):** Carregador de variáveis de ambiente para configuração isolada da aplicação.

### 📱 Engine de WhatsApp & Banco de Dados
* **[Evolution Go (evoapicloud/evolution-go)](https://github.com/evolution-foundation/evolution-go):** Motor de comunicação com o WhatsApp reescrito em **Golang (Go)** com consumo de RAM ~30MB, suporte a presença `composing` e gerenciador visual via QR Code.
* **[PostgreSQL 16 (Alpine)](https://www.postgresql.org/):** Banco de dados relacional robusto para armazenamento de pedidos, itens, variações, usuários admin e a tabela de configurações `store_config`.

### 🐳 Infraestrutura & DevOps
* **[Docker & Docker Compose 3.8](https://www.docker.com/):** Conteinerização e orquestração de 4 contêineres (`frontend`, `backend`, `postgres` e `evolution_go`) executáveis via 1 único comando.
* **[Nginx (Alpine)](https://nginx.org/):** Servidor web de alta performance com suporte a **SPA Fallback Routing** (`try_files $uri $uri/ /index.html`), permitindo navegação direta em rotas como `/admin`.

---

## 🚀 Como Executar o Projeto

Toda a infraestrutura do projeto roda em contêineres Docker com um único comando:

### 1. Clonar o repositório e rodar o Docker:
```bash
docker compose up -d --build
```

### 2. Endereços de Acesso:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🛒 **E-commerce público** | `http://localhost` | Loja virtual e personalizador público |
| 🔐 **Painel Admin Direto** | `http://localhost/admin` | Painel de controle da empresa |
| 📱 **Evolution Go Manager** | `http://localhost:8080/manager` | Painel de conexão do WhatsApp via QR Code |

### 🔑 Credenciais Padrão do Admin:
* **E-mail:** `admin@tutaspapeis.com.br`
* **Senha:** `admin123`

---

## 📄 Licença

Este projeto é mantido pelo **Tuta's Paper**. Todos os direitos reservados.
