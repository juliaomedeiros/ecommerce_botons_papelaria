const db = require('../database/db');

// Listar todos os clientes compradores
async function getCustomers(req, res) {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
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

module.exports = {
  getCustomers,
  upsertCustomer
};
