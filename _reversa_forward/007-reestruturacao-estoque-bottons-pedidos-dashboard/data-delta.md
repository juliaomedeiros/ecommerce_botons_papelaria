# Delta de Dados (Data Delta): Feature 007

> Identificador: `007-reestruturacao-estoque-bottons-pedidos-dashboard`
> Data: `2026-08-10`

---

## 1. Estruturas Existentes no PostgreSQL

### Tabela `products`
```sql
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  custom_upload_fee DECIMAL(10,2) DEFAULT 0.00,
  image_url TEXT,
  is_customizable BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `product_variations`
```sql
CREATE TABLE IF NOT EXISTS product_variations (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
  diameter VARCHAR(10) NOT NULL, -- '25mm' | '38mm'
  finish_type VARCHAR(20) NOT NULL, -- 'alfinete' | 'chaveiro' | 'ima'
  price_override DECIMAL(10,2),
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Delta de Consultas SQL (Queries Ajustadas)

### A. Listar Clientes Compradores (`customerController.js`)
```sql
SELECT 
  id, name, phone, cpf, street, number, complement, 
  neighborhood, city, state, zip_code, total_orders, last_order_at, created_at
FROM customers
ORDER BY created_at DESC;
```

### B. Listar Fila de Pedidos em Ordem Cronológica FIFO (`orderController.js`)
```sql
SELECT 
  o.*,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', oi.id,
      'product_id', oi.product_id,
      'diameter', oi.diameter,
      'finish_type', oi.finish_type,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'total_price', oi.total_price,
      'cropped_image_url', oi.cropped_image_url,
      'original_image_url', oi.original_image_url
    )
  ) AS items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.production_status = 'pending'
GROUP BY o.id
ORDER BY o.created_at ASC; -- Pedido mais antigo no topo (FIFO)
```

### C. Métricas Consolidadas do Dashboard (`orderController.js`)
```sql
SELECT 
  COALESCE(SUM(total_amount), 0) AS total_revenue,
  COUNT(id) AS total_orders,
  (SELECT COUNT(*) FROM orders WHERE production_status = 'pending') AS pending_orders,
  (SELECT COALESCE(SUM(stock_quantity), 0) FROM product_variations) AS total_stock_items
FROM orders
WHERE payment_status = 'approved';
```
