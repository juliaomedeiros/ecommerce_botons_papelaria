# Data Delta: Modificações de Dados e Consultas

## 1. Tabela `customers` (Clientes/Compradores)
- **Operação de Upsert no Checkout:**
  Ao finalizar o pedido, o sistema executa a instrução SQL de inserção ou atualização com base no número de telefone (`phone` / `whatsapp`):
  ```sql
  INSERT INTO customers (name, phone, cpf, street, number, neighborhood, city, state, zip_code, complement, total_orders, last_order_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, NOW())
  ON CONFLICT (phone) DO UPDATE SET
    name = EXCLUDED.name,
    cpf = EXCLUDED.cpf,
    street = EXCLUDED.street,
    number = EXCLUDED.number,
    neighborhood = EXCLUDED.neighborhood,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    complement = EXCLUDED.complement,
    total_orders = customers.total_orders + 1,
    last_order_at = NOW();
  ```

## 2. Consulta de Autopreenchimento (`GET /api/customers/lookup`)
- **Query Indexada:**
  ```sql
  SELECT name, phone, cpf, street, number, neighborhood, city, state, zip_code, complement
  FROM customers
  WHERE phone = $1
  LIMIT 1;
  ```

## 3. Armazenamento de Uploads de Imagens de Produtos
- As imagens enviadas via upload físico no Admin continuarão salvas no diretório conteinerizado `/app/uploads` e servidas publicamente pela rota `/uploads/<filename>`.
