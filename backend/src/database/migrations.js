const db = require('./db');

async function runMigrations() {
  console.log('🔄 Executando Migrations no PostgreSQL...');

  try {
    // 1. Tabela de Categorias
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela de Produtos
    await db.query(`
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
    `);

    // 3. Tabela de Variações do Produto (25mm / 38mm x Alfinete / Chaveiro / Ímã)
    await db.query(`
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
    `);

    // 4. Tabela de Pedidos
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        customer_name VARCHAR(120) NOT NULL,
        customer_email VARCHAR(120),
        customer_phone VARCHAR(20) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending',
        production_status VARCHAR(20) DEFAULT 'pending',
        mercadopago_payment_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Tabela de Itens do Pedido
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(36) REFERENCES products(id) ON DELETE SET NULL,
        variation_id VARCHAR(36) REFERENCES product_variations(id) ON DELETE SET NULL,
        diameter VARCHAR(10) NOT NULL,
        finish_type VARCHAR(20) NOT NULL,
        image_source VARCHAR(20) NOT NULL,
        original_image_url TEXT,
        cropped_image_url TEXT,
        crop_data TEXT,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL
      );
    `);

    // 6. Tabela de Usuários Admin
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'funcionario',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Adicionar coluna role se admin_users já existia sem ela e garantir admin Master
    await db.query(`
      ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'funcionario';
      UPDATE admin_users SET role = 'admin' WHERE email = 'admin@tutaspapeis.com.br';
    `);

    // 7. Tabela de Clientes Compradores
    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        cpf VARCHAR(20),
        street VARCHAR(255),
        number VARCHAR(50),
        complement VARCHAR(100),
        neighborhood VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Tabela de Configurações Globais da Loja
    await db.query(`
      CREATE TABLE IF NOT EXISTS store_config (
        key VARCHAR(50) PRIMARY KEY,
        value VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO store_config (key, value)
      VALUES 
        ('modo_evento_24h', 'false'),
        ('modo_24h', 'false'),
        ('mp_environment', 'sandbox')
      ON CONFLICT (key) DO NOTHING;
    `);

    // Adicionar colunas de estoque, limite por compra e personalização em products se não existirem
    await db.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 10;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS max_limit_per_order INT DEFAULT 100;
    `);

    // Adicionar colunas adicionais na tabela orders se não existirem
    await db.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_deadline VARCHAR(50) DEFAULT '5 dias úteis';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id VARCHAR(36) REFERENCES customers(id) ON DELETE SET NULL;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS pdf_url TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_deducted BOOLEAN DEFAULT FALSE;
    `);

    console.log('✅ Migrations executadas com sucesso no PostgreSQL!');
  } catch (error) {
    console.error('❌ Erro nas migrations PostgreSQL:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations().then(() => process.exit(0));
}

module.exports = { runMigrations };
