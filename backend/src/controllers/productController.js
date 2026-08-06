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
    const { category_id, include_inactive } = req.query;
    let queryText = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];

    if (include_inactive !== 'true') {
      queryText += ' WHERE p.is_active = TRUE';
    } else {
      queryText += ' WHERE 1=1';
    }

    if (category_id) {
      queryText += ' AND p.category_id = $' + (params.length + 1);
      params.push(category_id);
    }

    queryText += ' ORDER BY p.created_at DESC';

    const productsResult = await db.query(queryText, params);
    const products = productsResult.rows;

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

// Criar produto (Admin e Funcionário)
async function createProduct(req, res) {
  try {
    const { category_id, name, description, base_price, custom_upload_fee, is_customizable, stock_quantity, max_limit_per_order, image_url } = req.body;
    if (!name || base_price === undefined) {
      return res.status(400).json({ error: 'Nome e preço base são obrigatórios.' });
    }

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-") + '-' + Date.now();
    const id = `prod-${Date.now()}`;

    const result = await db.query(`
      INSERT INTO products (id, category_id, name, slug, description, base_price, custom_upload_fee, is_customizable, stock_quantity, max_limit_per_order, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `, [
      id,
      category_id || null,
      name,
      slug,
      description || '',
      base_price,
      custom_upload_fee || 0,
      is_customizable || false,
      stock_quantity !== undefined ? stock_quantity : 10,
      max_limit_per_order !== undefined ? max_limit_per_order : 100,
      image_url || null
    ]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro ao criar produto.' });
  }
}

// Atualizar produto / preço / estoque (Admin e Funcionário)
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, base_price, custom_upload_fee, is_customizable, stock_quantity, max_limit_per_order, image_url, is_active, category_id } = req.body;

    const currentRes = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const current = currentRes.rows[0];

    const updatedName = name !== undefined ? name : current.name;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedPrice = base_price !== undefined ? base_price : current.base_price;
    const updatedFee = custom_upload_fee !== undefined ? custom_upload_fee : current.custom_upload_fee;
    const updatedCustom = is_customizable !== undefined ? is_customizable : current.is_customizable;
    const updatedStock = stock_quantity !== undefined ? stock_quantity : current.stock_quantity;
    const updatedMaxLimit = max_limit_per_order !== undefined ? max_limit_per_order : current.max_limit_per_order;
    const updatedImage = image_url !== undefined ? image_url : current.image_url;
    const updatedActive = is_active !== undefined ? is_active : current.is_active;
    const updatedCat = category_id !== undefined ? category_id : current.category_id;

    const result = await db.query(`
      UPDATE products
      SET name = $1, description = $2, base_price = $3, custom_upload_fee = $4,
          is_customizable = $5, stock_quantity = $6, max_limit_per_order = $7, image_url = $8, is_active = $9, category_id = $10
      WHERE id = $11 RETURNING *
    `, [updatedName, updatedDesc, updatedPrice, updatedFee, updatedCustom, updatedStock, updatedMaxLimit, updatedImage, updatedActive, updatedCat, id]);

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
}

// Desativar produto (Admin)
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await db.query('UPDATE products SET is_active = FALSE WHERE id = $1', [id]);
    return res.json({ message: 'Produto desativado com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({ error: 'Erro ao excluir produto.' });
  }
}

module.exports = {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
