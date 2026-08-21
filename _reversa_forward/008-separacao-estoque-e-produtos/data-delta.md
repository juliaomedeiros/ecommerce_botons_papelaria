# Data Delta: Separação de Insumos e Produtos

> Identificador: `008-separacao-estoque-e-produtos`
> Data: `2026-08-20`
> Feature Dir: `_reversa_forward/008-separacao-estoque-e-produtos/`

## 1. Mudanças de Esquema de Banco de Dados (PostgreSQL)

### 1.1 Nova Tabela: `raw_materials_stock`

Armazena o saldo real de insumos físicos (matéria-prima) por diâmetro e acabamento.

```sql
CREATE TABLE IF NOT EXISTS raw_materials_stock (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'diameter' ou 'finish'
    code VARCHAR(50) NOT NULL UNIQUE, -- '25mm', '38mm', 'alfinete', 'chaveiro', 'ima'
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_quantity INT NOT NULL DEFAULT 10,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 Alteração na Tabela `products`

Adição do suporte a edições limitadas e flexibilização do campo de estoque.

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_limited_edition BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_limit INT DEFAULT NULL;
-- O campo 'stock' na tabela 'products' deixa de ser obrigatório na criação do produto.
```

## 2. Seed Inicial de Dados (Insumos)

```sql
INSERT INTO raw_materials_stock (category, code, name, quantity, min_quantity)
VALUES 
    ('diameter', '25mm', 'Insumos Botton 25mm (Bases/Acetatos)', 500, 50),
    ('diameter', '38mm', 'Insumos Botton 38mm (Bases/Acetatos)', 500, 50),
    ('finish', 'alfinete', 'Acabamento Alfinete de Metal', 500, 50),
    ('finish', 'chaveiro', 'Acabamento Chaveiro', 200, 20),
    ('finish', 'ima', 'Acabamento Ímã de Geladeira', 200, 20)
ON CONFLICT (code) DO NOTHING;
```

## 3. Lógica de Consulta de Disponibilidade

Ao consultar um produto no catálogo:
- Se `is_limited_edition` for `TRUE` e `max_limit <= 0`, o produto é retornado como **Esgotado**.
- Caso contrário, a disponibilidade das variações (25mm / 38mm) é calculada diretamente da tabela `raw_materials_stock`.
