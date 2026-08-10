const db = require('../database/db');

// Listar todos os clientes compradores
async function getCustomers(req, res) {
  try {
    const result = await db.query(`
      SELECT 
        c.*,
        COALESCE(COUNT(o.id), 0) AS total_orders,
        MAX(o.created_at) AS last_order_at
      FROM customers c
      LEFT JOIN orders o ON (c.phone = o.customer_phone OR (c.cpf IS NOT NULL AND c.cpf = o.customer_cpf))
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar a lista de clientes.' });
  }
}

// Cadastrar ou atualizar cliente comprador
async function upsertCustomer(req, res) {
  try {
    const { name, phone, cpf, street, number, complement, neighborhood, city, state, zip_code } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Nome e telefone do cliente são obrigatórios.' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const id = `cust-${Date.now()}`;

    const existing = await db.query('SELECT * FROM customers WHERE phone = $1', [cleanPhone]);

    if (existing.rows.length > 0) {
      const updated = await db.query(`
        UPDATE customers
        SET name = $1, cpf = $2, street = $3, number = $4, complement = $5,
            neighborhood = $6, city = $7, state = $8, zip_code = $9
        WHERE phone = $10 RETURNING *
      `, [name, cpf || null, street || '', number || '', complement || '', neighborhood || '', city || '', state || '', zip_code || '', cleanPhone]);

      return res.json(updated.rows[0]);
    } else {
      const created = await db.query(`
        INSERT INTO customers (id, name, phone, cpf, street, number, complement, neighborhood, city, state, zip_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
      `, [id, name, cleanPhone, cpf || null, street || '', number || '', complement || '', neighborhood || '', city || '', state || '', zip_code || '']);

      return res.status(201).json(created.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar informações do cliente.' });
  }
}

// Buscar cliente por número de WhatsApp (Autopreenchimento no Checkout)
async function lookupCustomerByPhone(req, res) {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ found: false, message: 'Número de telefone é obrigatório.' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return res.json({ found: false, message: 'Número de telefone inválido.' });
    }

    const result = await db.query('SELECT * FROM customers WHERE phone LIKE $1 OR phone = $2 LIMIT 1', [`%${cleanPhone}%`, cleanPhone]);

    if (result.rows.length > 0) {
      return res.json({ found: true, customer: result.rows[0] });
    } else {
      return res.json({ found: false, message: 'Nenhum cadastro prévio encontrado para este WhatsApp.' });
    }
  } catch (error) {
    console.error('Erro na busca de cliente por telefone:', error);
    return res.status(500).json({ found: false, error: 'Erro interno ao consultar cliente.' });
  }
}

// Excluir cliente comprador por ID (Admin/Funcionário)
async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM customers WHERE id = $1', [id]);
    return res.json({ message: 'Cliente removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir cliente.' });
  }
}

module.exports = {
  getCustomers,
  upsertCustomer,
  lookupCustomerByPhone,
  deleteCustomer
};

