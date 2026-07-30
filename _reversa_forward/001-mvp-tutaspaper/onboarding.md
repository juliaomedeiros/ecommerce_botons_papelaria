# Guia de Onboarding e Validação Humana

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`

## Passo a Passo para Teste Completo da Aplicação

### 1. Iniciar os Contêineres Docker
Execute o comando raiz no terminal do projeto:
```bash
docker compose up -d --build
```
Isso iniciará 4 serviços:
- `tutaspaper_postgres` (Porta 5432)
- `tutaspaper_backend` (Porta 5000)
- `tutaspaper_frontend` (Porta 80)
- `tutaspaper_evolution_api` (Porta 8080)

### 2. Validar o Acesso Rápido ao Painel Admin
- **No E-commerce público (`http://localhost`):** Clique no ícone de cadeado 🔒 no topo direito.
- **Ou via URL direta:** Acesse **`http://localhost/admin`**.
- Credenciais para login: `admin@tutaspapeis.com.br` / `admin123`.

### 3. Conectar a Evolution API (WhatsApp)
- No navegador, acesse **`http://localhost:8080/manager`** (ou clique no botão *"Abrir Evolution Manager"* na aba 3 do Painel Admin).
- Insira a Global API Key: `tutas_evolution_key`.
- Crie ou selecione a instância `tutaspaper` e escaneie o QR Code com o WhatsApp da empresa.

### 4. Testar o Fluxo de Compra e Notificação
- Escolha um botton, passe pelo Guia de Tamanhos e conclua o checkout com Pix.
- Verifique se a notificação e a foto circular chegaram no WhatsApp e se o pedido consta na Fila Noturna do Admin.
