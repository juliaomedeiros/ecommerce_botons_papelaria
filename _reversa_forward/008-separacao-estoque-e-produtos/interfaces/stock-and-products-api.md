# Interface API: Stock & Products API

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/008-separacao-estoque-e-produtos/`

## 1. Endpoints de Estoque Central de Insumos (`/api/admin/stock`)

### 1.1 GET `/api/admin/stock`
Retorna a lista completa de insumos físicos e seus saldos.

**Autenticação:** JWT Admin  
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "category": "diameter",
    "code": "25mm",
    "name": "Insumos Botton 25mm (Bases/Acetatos)",
    "quantity": 500,
    "min_quantity": 50
  },
  {
    "id": 2,
    "category": "diameter",
    "code": "38mm",
    "name": "Insumos Botton 38mm (Bases/Acetatos)",
    "quantity": 350,
    "min_quantity": 50
  }
]
```

### 1.2 PUT `/api/admin/stock`
Atualiza a quantidade de um insumo físico específico.

**Autenticação:** JWT Admin  
**Request Body:**
```json
{
  "code": "25mm",
  "quantity": 600
}
```
**Response (200 OK):**
```json
{
  "message": "Estoque de insumo atualizado com sucesso",
  "code": "25mm",
  "new_quantity": 600
}
```

## 2. Endpoints de Produtos (`/api/products`)

### 2.1 POST `/api/products` (Cadastro Simplificado)
**Autenticação:** JWT Admin  
**Request Body:**
```json
{
  "title": "Botton Nossa Senhora de Fátima",
  "category_id": 1,
  "price": 12.50,
  "allowed_diameters": ["25mm", "38mm"],
  "allowed_finishes": ["alfinete", "chaveiro", "ima"],
  "is_limited_edition": false,
  "max_limit": null
}
```
*Obs: O campo `stock` não é enviado no payload do produto.*
