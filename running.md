# Guia Passo a Passo: Como Executar o Sistema Tuta's Paper

> **Projeto:** Tuta's Paper — E-commerce por Categorias, Fast-Food de Bottons, Checkout Mercado Pago e Painel Admin Noturno  
> **Arquitetura:** Conteinerizada em 3 camadas via Docker Compose com PostgreSQL persistente.

---

## 📋 1. Pré-requisitos

Para executar o sistema completo em seu computador ou servidor VPS Linux, você precisará apenas do **Docker** e do **Docker Compose** instalados:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) ou Docker Engine (Linux).
* Verifique se o Docker está ativo executando no terminal:
  ```bash
  docker --version
  docker compose version
  ```

---

## 🚀 2. Como Executar via Docker Compose (Modo Recomendado)

Toda a aplicação (Banco de Dados PostgreSQL, API Backend e Frontend Web) foi configurada para subir unificada com um único comando.

### **Passo 1:** Abra o terminal na pasta raiz do projeto
```bash
cd C:\ProjectsCode\sistema_tutaspaper
```

### **Passo 2:** Inicie os contêineres em segundo plano
```bash
docker compose up -d
```

> **Nota:** Na primeira execução, o Docker irá baixar a imagem do PostgreSQL 16 Alpine, construir o backend Node.js e compilar o frontend React/Nginx. O processo leva cerca de 1 a 2 minutos.

### **Passo 3:** Verifique se todos os contêineres estão rodando
```bash
docker compose ps
```
Deverão aparecer 3 serviços com status `running` ou `healthy`:
- `tutaspaper_postgres` (PostgreSQL 16)
- `tutaspaper_backend` (API Express Node.js)
- `tutaspaper_frontend` (Nginx + App React)

---

## 🌐 3. Endereços de Acesso no Navegador

Após o início dos contêineres, acesse os serviços nos seguintes URLs:

| Serviço | URL de Acesso | Descrição |
|---|---|---|
| **E-commerce & Personalizador** | `http://localhost:80` (ou `http://localhost`) | Loja pública com vitrine por categorias e Fast-Food de bottons |
| **API Backend REST** | `http://localhost:5000/api/health` | Endpoints da API e envio de uploads de imagens |
| **Banco PostgreSQL** | `localhost:5432` | Banco relacional persistente via volume `postgres_data` |

---

## 🔑 4. Credenciais de Acesso ao Painel Admin Retaguarda

Para acessar o Painel Administrativo Noturno de Gestão de Estoque, Categorias e Fila de Produção de Bottons:

1. Acesse o e-commerce em `http://localhost`.
2. Clique no **ícone de Cadeado (🔒)** no canto superior direito do cabeçalho.
3. Utilize as credenciais padrão salvas na semente do banco de dados:

* **E-mail:** `admin@tutaspapeis.com.br`
* **Senha:** `admin123`

---

## 🧪 5. Roteiro de Teste do Fluxo Completo (Passo a Passo)

Para testar todas as funcionalidades do sistema como cliente e como administrador:

### **Como Cliente (E-commerce):**
1. **Navegar pelas Categorias:** Na tela principal, alterne entre as abas *"Bottons, Chaveiros & Ímãs"*, *"Artigos Religiosos"* e *"Materiais de Papelaria"*.
2. **Personalizar Botton:** Clique em **"Personalizar Agora"** ou **"Fast-Food de Bottons"**.
3. **Enviar Foto & Ajustar Recorte:** Clique em **"Enviar Foto"**, escolha uma imagem no seu computador/celular, e use o mouse para arrastar a foto e os botões de zoom (`+` / `-`) para enquadrar no círculo.
4. **Consultar Guia de Tamanhos:** Clique no botão **"Guia de Tamanhos"** e leia a explicação comparativa de **25mm (2,5 cm)** vs **38mm (3,8 cm)**.
5. **Escolher Diâmetro e Acabamento:** Selecione o tamanho desejado (**25mm** ou **38mm**) e o acabamento (**Alfinete**, **Chaveiro** ou **Ímã**).
6. **Adicionar ao Carrinho & Checkout:** Defina a quantidade, clique em **"Adicionar ao Carrinho"**, preencha os dados do cliente e conclua a simulação de pagamento via **Pix** ou **Cartão Mercado Pago**.

### **Como Gestor / Administrador (Painel Retaguarda):**
1. Acesse o Painel Admin via **🔒 Acesso Admin**.
2. Faça login com `admin@tutaspapeis.com.br` / `admin123`.
3. Na aba **"Fila de Produção Noturna"**, visualize o pedido realizado com a foto recortada em alta definição e as especificações da prensa (ex: *10x 38mm Chaveiro*).
4. Clique no botão **"Baixar Arte HD 300DPI"** para obter o PNG pronto para impressão.
5. Alterne o status do pedido (*Pendente* ➔ *Iniciar Prensa* ➔ *Marcar como Pronto*).
6. Na aba **"Gestão de Categorias"**, cadastre novas categorias para sincronização imediata no e-commerce.

---

## 🛠️ 6. Execução Local sem Docker (Opcional para Desenvolvimento)

Se você desejar executar o projeto em modo de desenvolvimento local fora do Docker:

### **Backend (Terminal 1):**
```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

### **Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```
Acesse o frontend em `http://localhost:3000`.

---

## 🧹 7. Comandos Úteis de Manutenção Docker

* **Ver os logs em tempo real:**
  ```bash
  docker compose logs -f
  ```
* **Reiniciar os serviços:**
  ```bash
  docker compose restart
  ```
* **Parar os contêineres preservando os dados:**
  ```bash
  docker compose down
  ```
* **Parar e limpar totalmente os volumes do banco de dados:**
  ```bash
  docker compose down -v
  ```
