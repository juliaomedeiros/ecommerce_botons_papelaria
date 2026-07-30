const db = require('../database/db');

// Listar todas as categorias ativas
async function getCategories(req, res) {
  try {
    const result = await db.query('SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order ASC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ error: 'Erro ao listar categorias.' });
  }
}

// Criar nova categoria (Admin)
async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-");
    const id = `cat-${Date.now()}`;

    const result = await db.query(`
      INSERT INTO categories (id, name, slug, description)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [id, name, slug, description || '']);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
}

// Listar produtos (opcional por categoria)
async function getProducts(req, res) {
  try {
    const { category_id } = req.query;
    let queryText = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
    `;
    const params = [];

    if (category_id) {
      queryText += ' AND p.category_id = $1';
      params.push(category_id);
    }

    queryText += ' ORDER BY p.created_at DESC';

    const productsResult = await db.query(queryText, params);
    const products = productsResult.rows;

    // Buscar variações para cada produto
    for (const prod of products) {
      const vars = await db.query('SELECT * FROM product_variations WHERE product_id = $1 ORDER BY diameter, finish_type', [prod.id]);
      prod.variations = vars.rows;
    }

    return res.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ error: 'Erro ao listar produtos.' });
  }
}

// Criar produto (Admin)
async function createProduct(req, res) {
  try {
    const { category_id, name, description, base_price, custom_upload_fee, is_customizable } = req.body;
    if (!name || !base_price) {
      return res.status(400).json({ error: 'Nome e preço base são obrigatórios.' });
    }

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-");
    const id = `prod-${Date.now()}`;

    const result = await db.query(`
      INSERT INTO products (id, category_id, name, slug, description, base_price, custom_upload_fee, is_customizable)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [id, category_id || null, name, slug, description || '', base_price, custom_upload_fee || 0, is_customizable || false]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro ao criar produto.' });
  }
}

module.exports = {
  getCategories,
  createCategory,
  getProducts,
  createProduct
};
