const db = require('./db');
const bcrypt = require('bcryptjs');

async function runSeed() {
  console.log('🌱 Executando Seed de dados iniciais...');
  try {
    const adminExists = await db.query('SELECT id FROM admin_users WHERE email = $1', ['admin@tutaspapeis.com.br']);
    if (adminExists.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await db.query(`
        INSERT INTO admin_users (id, name, email, password_hash, role)
        VALUES ('admin-uuid-001', 'Administrador Tutas', 'admin@tutaspapeis.com.br', $1, 'admin')
      `, [hash]);
      console.log('👤 Usuário Administrador de fábrica criado: admin@tutaspapeis.com.br / admin123 (role: admin)');
    } else {
      await db.query(`UPDATE admin_users SET role = 'admin' WHERE email = $1`, ['admin@tutaspapeis.com.br']);
      console.log('👤 Usuário admin@tutaspapeis.com.br atualizado com role = admin');
    }

    // 2. Categorias Iniciais
    await db.query(`
      UPDATE categories 
      SET slug = 'bottons', name = 'Bottons', description = 'Bottons, Chaveiros e Ímãs de catálogo com estampas exclusivas'
      WHERE id = 'cat-bottons-001';
    `);

    const defaultCategories = [
      { id: 'cat-bottons-001', name: 'Bottons', slug: 'bottons', description: 'Bottons, Chaveiros e Ímãs de catálogo com estampas exclusivas', display_order: 1 },
      { id: 'cat-custom-002', name: 'Bottons Personalizados', slug: 'bottons-personalizados', description: 'Crie o seu botton personalizado com sua própria foto ou logo', display_order: 2 },
      { id: 'cat-religiosos-003', name: 'Artigos Religiosos', slug: 'artigos-religiosos', description: 'Terços, imagens, medalhas e artigos de fé', display_order: 3 },
      { id: 'cat-papelaria-004', name: 'Materiais de Papelaria', slug: 'materiais-papelaria', description: 'Cadernos, agendas, canetas e artigos de papelaria', display_order: 4 }
    ];

    for (const c of defaultCategories) {
      const existsId = await db.query('SELECT id FROM categories WHERE id = $1', [c.id]);
      const existsSlug = await db.query('SELECT id FROM categories WHERE slug = $1', [c.slug]);

      if (existsId.rows.length === 0 && existsSlug.rows.length === 0) {
        await db.query(`
          INSERT INTO categories (id, name, slug, description, display_order)
          VALUES ($1, $2, $3, $4, $5)
        `, [c.id, c.name, c.slug, c.description, c.display_order]);
      } else {
        await db.query(`
          UPDATE categories
          SET name = $1, slug = $2, description = $3, display_order = $4
          WHERE id = $5 OR slug = $2
        `, [c.name, c.slug, c.description, c.display_order, c.id]);
      }
    }

    // 3. Produto Botton Fast-Food com Variações
    const prodBotton = await db.query('SELECT id FROM products WHERE slug = $1', ['botton-personalizado-fastfood']);
    let prodId = 'prod-fastfood-001';
    if (prodBotton.rows.length === 0) {
      await db.query(`
        INSERT INTO products (id, category_id, name, slug, description, base_price, custom_upload_fee, is_customizable)
        VALUES ('prod-fastfood-001', 'cat-bottons-001', 'Botton / Chaveiro / Ímã Personalizado Fast-Food', 'botton-personalizado-fastfood', 'Personalização rápida com prévia circular e produção em até 24h', 5.00, 1.50, TRUE)
      `);
    }

    // Variações (25mm e 38mm x Alfinete, Chaveiro, Ímã)
    const variations = [
      { id: 'var-25-alfinete', diameter: '25mm', finish: 'alfinete', price: 5.00, stock: 500, sku: 'BOT-25-ALF' },
      { id: 'var-25-chaveiro', diameter: '25mm', finish: 'chaveiro', price: 7.00, stock: 300, sku: 'BOT-25-CHV' },
      { id: 'var-25-ima', diameter: '25mm', finish: 'ima', price: 6.50, stock: 250, sku: 'BOT-25-IMA' },
      { id: 'var-38-alfinete', diameter: '38mm', finish: 'alfinete', price: 6.00, stock: 600, sku: 'BOT-38-ALF' },
      { id: 'var-38-chaveiro', diameter: '38mm', finish: 'chaveiro', price: 8.50, stock: 400, sku: 'BOT-38-CHV' },
      { id: 'var-38-ima', diameter: '38mm', finish: 'ima', price: 8.00, stock: 350, sku: 'BOT-38-IMA' },
    ];

    for (const v of variations) {
      const vExists = await db.query('SELECT id FROM product_variations WHERE id = $1', [v.id]);
      if (vExists.rows.length === 0) {
        await db.query(`
          INSERT INTO product_variations (id, product_id, diameter, finish_type, price_override, stock_quantity, sku)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [v.id, prodId, v.diameter, v.finish, v.price, v.stock, v.sku]);
      }
    }

    console.log('✅ Seed de dados executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed().then(() => process.exit(0));
}

module.exports = { runSeed };
