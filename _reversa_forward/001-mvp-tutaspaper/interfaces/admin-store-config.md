# Especificação de Contrato: GET /api/config & POST /api/admin/config

> Identificador: `001-mvp-tutaspaper`
> Contrato: `HTTP Rest Config Controller`

## Endpoints

### 1. `GET /api/config`
Retorna as configurações públicas e URLs de integrações da loja.

**Response (200 OK):**
```json
{
  "modo_evento_24h": true,
  "default_delivery_days": 5,
  "mercadopago_token": "APP_USR-...",
  "evolution_api_url": "http://localhost:8080",
  "evolution_api_key": "tutas_evolution_key",
  "evolution_instance_name": "tutaspaper",
  "evolution_manager_url": "http://localhost:8080/manager"
}
```

### 2. `POST /api/admin/config`
Atualiza as configurações e chaves de integração. Exige Bearer Token JWT do Admin.

**Request Payload:**
```json
{
  "modo_evento_24h": true,
  "mercadopago_token": "APP_USR-xxxx",
  "evolution_api_url": "http://localhost:8080",
  "evolution_api_key": "tutas_evolution_key",
  "evolution_instance_name": "tutaspaper"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Configurações atualizadas com sucesso!"
}
```
