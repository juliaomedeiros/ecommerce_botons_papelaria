const db = require('./db');
const bcrypt = require('bcryptjs');

async function resetAllData() {
  console.log('🧹 Limpando dados do banco PostgreSQL para testes do zero...');
  
  try {
    // 1. Limpar tabelas operacionais e de testes
    await db.query('TRUNCATE TABLE order_items CASCADE;');
    await db.query('TRUNCATE TABLE orders CASCADE;');
    await db.query('TRUNCATE TABLE customers CASCADE;');
    await db.query('TRUNCATE TABLE product_variations CASCADE;');
    await db.query('TRUNCATE TABLE products CASCADE;');
    await db.query('TRUNCATE TABLE categories CASCADE;');
    await db.query('TRUNCATE TABLE admin_users CASCADE;');

    console.log('🗑️ Tabelas de pedidos, clientes, produtos e variações limpas com sucesso.');

    // 2. Recriar usuário Administrador Master de fábrica (para permitir login no Admin)
    const hash = await bcrypt.hash('admin123', 10);
    await db.query(`
      INSERT INTO admin_users (id, name, email, password_hash, role)
      VALUES ('admin-uuid-001', 'Administrador Tutas', 'admin@tutaspapeis.com.br', $1, 'admin')
    `, [hash]);
    console.log('👤 Usuário Administrador de fábrica recriado: admin@tutaspapeis.com.br / admin123');

    // 3. Recriar categorias padrão vazias de produtos
    const defaultCategories = [
      { id: 'cat-bottons-001', name: 'Bottons', slug: 'bottons', description: 'Bottons, Chaveiros e Ímãs de catálogo com estampas exclusivas', display_order: 1 },
      { id: 'cat-custom-002', name: 'Bottons Personalizados', slug: 'bottons-personalizados', description: 'Crie o seu botton personalizado com sua própria foto ou logo', display_order: 2 },
      { id: 'cat-religiosos-003', name: 'Artigos Religiosos', slug: 'artigos-religiosos', description: 'Terços, imagens, medalhas e artigos de fé', display_order: 3 },
      { id: 'cat-papelaria-004', name: 'Materiais de Papelaria', slug: 'materiais-papelaria', description: 'Cadernos, agendas, canetas e artigos de papelaria', display_order: 4 }
    ];

    for (const c of defaultCategories) {
      await db.query(`
        INSERT INTO categories (id, name, slug, description, display_order)
        VALUES ($1, $2, $3, $4, $5)
      `, [c.id, c.name, c.slug, c.description, c.display_order]);
    }
    console.log('📁 Categorias padrão reinicializadas.');

    console.log('✅ Banco de dados resetado com sucesso! Pronto para os novos testes.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco de dados:', error);
    process.exit(1);
  }
}

resetAllData();
