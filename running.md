# 🚀 Guia Passo a Passo: Como Executar o Sistema Tuta's Paper

> **Projeto:** Tuta's Paper — E-commerce por Categorias, Personalizador de Imagem, Painel Admin e WhatsApp Evolution Go  
> **Arquitetura:** Stack totalmente conteinerizada em 4 camadas via Docker Compose (Frontend Nginx SPA, Backend Express Node.js, PostgreSQL 16 e Evolution Go em Golang).

---

## 📋 1. Pré-requisitos

Para executar o sistema completo em seu computador local ou servidor VPS Linux, você precisará apenas do **Docker** e do **Docker Compose** instalados:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) ou Docker Engine (Linux).
* Verifique se o Docker está ativo executando no terminal:
  ```bash
  docker --version
  docker compose version
  ```

---

## 🚀 2. Como Executar via Docker Compose (Passo a Passo)

Toda a aplicação (Banco de Dados PostgreSQL, API Backend, Servidor Nginx SPA e o Motor Evolution Go do WhatsApp) foi configurada para subir unificada com um único comando.

### **Passo 1:** Abra o terminal na pasta raiz do projeto
```bash
cd C:\ProjectsCode\sistema_tutaspaper
```

### **Passo 2:** Inicie os contêineres e compile as imagens
```bash
docker compose up -d --build
```

### **Passo 3:** Verifique o status dos contêineres
```bash
docker compose ps
```

Deverão aparecer os **4 serviços** rodando com status `running` ou `healthy`:
* 🔵 `tutaspaper_frontend` (Nginx SPA Fallback na porta 80)
* 🟢 `tutaspaper_backend` (API Express Node.js na porta 5000)
* 🟣 `tutaspaper_evolution_go` (Motor WhatsApp Evolution Go em Golang na porta 8080)
* 🐘 `tutaspaper_postgres` (Banco PostgreSQL 16 na porta 5432)

---

## 🌐 3. Endereços de Acesso no Navegador (Links Diretos)

Após o início dos contêineres, acesse os serviços diretamente nos links abaixo:

| Serviço | URL de Acesso Direto | Descrição |
|---|---|---|
| 🛒 **E-commerce público** | [http://localhost](http://localhost) | Loja virtual por categorias com botão *"Personalize com uma imagem"* |
| 🔐 **Painel Admin Direto** | [http://localhost/admin](http://localhost/admin) | Painel Administrativo de Controle da Empresa |
| 📱 **Evolution Go Manager** | [http://localhost:8080/manager](http://localhost:8080/manager) | Gerenciador visual para conectar o WhatsApp via QR Code |
| ⚙️ **API REST Backend** | `http://localhost:5000/api/config` | Endpoints REST e uploads |
| 🐘 **Banco PostgreSQL** | `localhost:5432` | Banco relacional com volume persistente |

---

## 🔑 4. Credenciais de Acesso ao Painel Admin

Para acessar o Painel Administrativo Retaguarda:

1. Acesse o link direto **`http://localhost/admin`** ou clique no **ícone de Cadeado (🔒)** no topo do e-commerce.
2. Utilize as credenciais salvas no banco de dados:

* **E-mail:** `admin@tutaspapeis.com.br`
* **Senha:** `admin123`

---

## 💬 5. Conectando o WhatsApp no Evolution Go (Passo a Passo Anti-Ban)

Para vincular o número do WhatsApp da empresa e permitir o envio automático de pedidos e fotos prontas para prensa:

1. Acesse o **Evolution Manager** em **[http://localhost:8080/manager](http://localhost:8080/manager)** (ou clique no botão *"Abrir Evolution Manager"* na **Aba 3 (Integrações)** do Painel Admin).
2. Na caixa de autenticação do manager, insira a Global API Key:
   `tutas_evolution_key`
3. Selecione a instância `tutaspaper` e clique em **"QR Code"**.
4. Abra o WhatsApp no celular da empresa, vá em **Aparelhos Conectados ➔ Conectar um Aparelho** e escaneie o QR Code na tela.
5. **Mecanismo Anti-Ban Ativo:** Uma vez conectado, as notificações enviadas aos clientes e administradores passam automaticamente pela **Fila FIFO em Memória**, com sinal de *"Digitando..."* (`composing`) por 2-4 segundos e pausa randômica de **5 a 15 segundos** entre cada envio.

---

## ⚙️ 6. Funcionalidades das Abas do Painel Admin (`/admin`)

O Painel Admin é organizado em **3 Abas**:

### 📅 **Aba 1: Fila de Produção Noturna**
- Exibe todos os pedidos realizados no e-commerce.
- Mostra Nome do Cliente, Celular com WhatsApp, a **Imagem Recortada Redonda (300DPI)** formatada para prensa, link para **Download da Arte Original** e o **Prazo Registrado** (`24 horas` ou `5 dias úteis`).
- Permite alterar os status da prensa (*Pendente* ➔ *Iniciar Prensa* ➔ *Marcar como Pronto*).

### 🏷️ **Aba 2: Gestão de Categorias**
- Permite cadastrar e organizar novas categorias no e-commerce (Religiosos, Papelaria, Marcas).

### ⚙️ **Aba 3: Configurações & Integrações**
- **⚡ Modo Evento 24h:** Botão para ativar/desativar em tempo real as frases de 24h, banners chamativos e badges da loja.
- **💳 Mercado Pago:** Campo para configurar o Access Token (`APP_USR-xxxx`).
- **💬 Evolution API / WhatsApp:** Link direto para o Evolution Manager, URL da API (`http://localhost:8080`), API Key e Nome da Instância.

---

## 🧹 7. Comandos Úteis de Manutenção Docker

* **Ver os logs em tempo real:**
  ```bash
  docker compose logs -f
  ```
* **Verificar uso de CPU e Memória:**
  ```bash
  docker stats
  ```
* **Reiniciar todos os serviços:**
  ```bash
  docker compose restart
  ```
* **Reconstruir contêineres sem cache:**
  ```bash
  docker compose up -d --build --force-recreate
  ```
* **Parar os contêineres preservando os dados do banco:**
  ```bash
  docker compose down
  ```
