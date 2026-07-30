# Roadmap Técnico: MVP E-commerce Tuta's Paper, Rota Admin & Evolution API Docker

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`
> Status: Planejado via `/reversa-plan`

## 1. Resumo da Abordagem

O plano técnico descreve a evolução da arquitetura do MVP para atender integralmente aos novos apontamentos:
1. **Infraestrutura Docker Completa com Evolution API:** Inclusão do serviço contêinerizado `evolution-api` (`atendai/evolution-api:v2.1.1`) no `docker-compose.yml` exposto na porta 8080, permitindo o escaneamento do QR Code pelo administrador e envio automático de mensagens e fotos redondas para o WhatsApp.
2. **Rota e Acesso do Painel Admin (`/admin`):** Atualização do roteador frontend (`App.jsx`) e Nginx (`Dockerfile.frontend`) para permitir navegação direta via URL `http://localhost/admin` além do acionamento pelo ícone do cadeado no header.
3. **Painel de Integrações e Controle Noturno:** Manutenção das 3 abas no Admin (Produção Noturna, Gestão de Categorias, Integrações Mercado Pago & Evolution API) com persistência no banco PostgreSQL (`store_config`).

## 2. Princípios Aplicados

- **Sem Modificação do Legado:** Todo desenvolvimento é Greenfield ancorado em `_reversa_sdd/`.
- **Deploy Simplificado via 1 Comando:** Toda a stack (Frontend Nginx, Backend Express, PostgreSQL e Evolution API WhatsApp) roda de forma totalmente integrada com um único `docker compose up -d --build`.

## 3. Decisões Técnicas

| ID | Decisão Técnica | Nível de Confidência | Justificativa |
|----|-----------------|----------------------|---------------|
| DT-01 | Adicionar serviço `evolution-api` ao `docker-compose.yml` | 🟢 | Garantir que o contêiner da Evolution API suba nativamente na porta 8080 junto com o banco PostgreSQL e o backend Express. |
| DT-02 | Roteamento Dedicado para `/admin` no Nginx e Frontend | 🟢 | Permitir que o administrador acesse a URL direta `http://localhost/admin` sem depender exclusivamente de modais no e-commerce. |
| DT-03 | Armazenamento de Configurações em `store_config` | 🟢 | Persistir no PostgreSQL as chaves `modo_evento_24h`, `mercadopago_token`, `evolution_api_url` e `evolution_api_key`. |
| DT-04 | Fila FIFO e Delay Humanizado (5-15s) Anti-Ban no WhatsApp | 🟢 | Implementar fila em memória com simulador de digitação `composing` e intervalo randômico de 5 a 15 segundos entre envios para prevenir banimento pela Meta. |

## 4. Delta Arquitetural

### Serviços no `docker-compose.yml`:
- **`postgres`**: Banco de Dados PostgreSQL 15 na porta `5432`.
- **`backend`**: API Express Node.js na porta `5000`.
- **`frontend`**: Servidor Nginx servindo o app React/Vite na porta `80`.
- **`evolution-api`**: Instância Oficial da Evolution API v2 na porta `8080` com autenticação via `apikey`.

## 5. Plano de Migração e Testes

1. Atualizar o `docker-compose.yml` para incluir a Evolution API v2.
2. Subir os contêineres: `docker compose up -d --build`.
3. Testar a rota `/admin` no navegador em `http://localhost/admin`.
4. Testar o gerenciador do WhatsApp em `http://localhost:8080/manager` e vincular o QR Code.

## 6. Riscos e Mitigações

- **Risco:** Falha de conexão inicial com a Evolution API caso a instância WhatsApp não esteja criada.
- **Mitigação:** O serviço `whatsappService.js` faz o tratamento gracioso e exibe o link direto do Evolution Manager no Admin para criação da instância `tutaspaper`.
