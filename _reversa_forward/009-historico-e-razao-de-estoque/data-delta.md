# Data Delta: Tabela de Livro Razão de Estoque

> Identificador: `009-historico-e-razao-de-estoque`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/009-historico-e-razao-de-estoque/`

## 1. Nova Tabela: `stock_movements`

```sql
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    movement_type VARCHAR(30) NOT NULL, -- 'ENTRADA', 'SAIDA_VENDA', 'PERDA_PRENSA', 'AJUSTE'
    raw_material_code VARCHAR(50) NOT NULL REFERENCES raw_materials_stock(code) ON DELETE CASCADE,
    quantity INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    total_cost DECIMAL(10,2) DEFAULT 0.00,
    unit_cost DECIMAL(10,4) DEFAULT 0.0000,
    supplier_info VARCHAR(255),
    notes TEXT,
    order_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Índices de Desempenho

```sql
CREATE INDEX IF NOT EXISTS idx_stock_movements_code ON stock_movements(raw_material_code);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);
```
