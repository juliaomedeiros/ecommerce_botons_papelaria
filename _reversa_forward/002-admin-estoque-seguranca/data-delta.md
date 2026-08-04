# Data Delta: Feature 002 (Estrutura de Dados e Migrações PostgreSQL)

> Identificador: `002-admin-estoque-seguranca`
> Data: `2026-08-03`

## 1. Novas Tabelas e Extensões

### Tabela `products` (Nova)
```sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'Geral',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    customization_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    stock_quantity INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `customers` (Nova)
```sql
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    cpf VARCHAR(20), -- Opcional inicialmente
    street VARCHAR(255),
    number VARCHAR(50),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Extensão da Tabela `users`
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'funcionario';
```

### Extensão da Tabela `store_config`
```sql
ALTER TABLE store_config ADD COLUMN IF NOT EXISTS modo_24h BOOLEAN DEFAULT FALSE;
ALTER TABLE store_config ADD COLUMN IF NOT EXISTS mp_environment VARCHAR(20) DEFAULT 'sandbox';
```

### Extensão da Tabela `orders`
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id INT REFERENCES customers(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_phone VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pdf_url TEXT;
```

## 2. Índices e Desempenho

```sql
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
```
