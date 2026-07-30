# Delta de Dados: Tabela store_config e Evolution API

> Identificador: `001-mvp-tutaspaper`
> Data: `2026-07-30`

## Diff Conceitual sobre o Banco PostgreSQL

### Tabela `store_config`
- `key VARCHAR(50) PRIMARY KEY`
- `value VARCHAR(255) NOT NULL`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

Chaves gerenciadas:
- `modo_evento_24h` (`'true'` | `'false'`)
- `mercadopago_token` (`'APP_USR-...'`)
- `evolution_api_url` (`'http://localhost:8080'`)
- `evolution_api_key` (`'tutas_evolution_key'`)
- `evolution_instance_name` (`'tutaspaper'`)

### Tabela `orders`
- Coluna adicionada: `delivery_deadline VARCHAR(50) DEFAULT '5 dias úteis'`
