# Interface API: Stock Movements API (Livro Razão)

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/009-historico-e-razao-de-estoque/`

## 1. Endpoints de Movimentação de Estoque

### 1.1 POST `/api/admin/raw-materials-stock/movements`
Registra uma nova movimentação no Livro Razão (ENTRADA, PERDA_PRENSA ou AJUSTE).

**Autenticação:** JWT Admin  
**Request Body:**
```json
{
  "raw_material_code": "38mm_alfinete",
  "movement_type": "ENTRADA",
  "quantity": 500,
  "total_cost": 150.00,
  "supplier_info": "Fornecedor Brasil Lote #10",
  "notes": "Compra de matéria-prima"
}
```

### 1.2 GET `/api/admin/raw-materials-stock/movements`
Retorna a lista paginada/cronológica de todas as movimentações.

**Autenticação:** JWT Admin  
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "movement_type": "ENTRADA",
    "raw_material_code": "38mm_alfinete",
    "raw_material_name": "Botton 38mm - Alfinete de Metal",
    "quantity": 500,
    "previous_quantity": 0,
    "new_quantity": 500,
    "total_cost": "150.00",
    "unit_cost": "0.3000",
    "supplier_info": "Fornecedor Brasil Lote #10",
    "notes": "Compra de matéria-prima",
    "created_at": "2026-08-20T19:10:00.000Z"
  }
]
```
