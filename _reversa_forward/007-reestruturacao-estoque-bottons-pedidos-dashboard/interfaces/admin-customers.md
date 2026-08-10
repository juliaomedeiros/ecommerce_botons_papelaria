# Contrato de Interface: Admin Clientes & Dashboard API

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`

---

## 1. `GET /api/admin/customers`

Recupera a lista consolidada de clientes compradores salvos no banco PostgreSQL.

### Autenticação
- `Header Authorization: Bearer <token>` (Requer role `admin` ou `funcionario`)

### Response Success (`200 OK`)
```json
[
  {
    "id": "cust-1723321455",
    "name": "Maria Silva",
    "phone": "83999999999",
    "cpf": "123.456.789-00",
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 101",
    "neighborhood": "Centro",
    "city": "João Pessoa",
    "state": "PB",
    "zip_code": "58000-000",
    "total_orders": 3,
    "last_order_at": "2026-08-10T16:00:00.000Z",
    "created_at": "2026-08-10T15:00:00.000Z"
  }
]
```

---

## 2. `GET /api/admin/dashboard-stats`

Recupera as métricas agregadas do topo do Dashboard executadas via SQL no PostgreSQL.

### Response Success (`200 OK`)
```json
{
  "total_revenue": 1450.50,
  "total_orders": 24,
  "pending_orders": 3,
  "total_stock_items": 450
}
```
