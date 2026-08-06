const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tutaspaper_super_secret_jwt_key_2026';

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const result = await db.query('SELECT * FROM admin_users WHERE email = $1 AND is_active = TRUE', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role || 'funcionario' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'funcionario' }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar autenticação.' });
  }
}

async function getAdminUsers(req, res) {
  try {
    const result = await db.query('SELECT id, name, email, role, is_active, created_at FROM admin_users ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários admin:', error);
    return res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
}

async function createAdminUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const existing = await db.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Já existe um usuário cadastrado com este e-mail.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = `user-${Date.now()}`;
    const userRole = role || 'funcionario';

    const result = await db.query(`
      INSERT INTO admin_users (id, name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING id, name, email, role, is_active, created_at
    `, [id, name, email, passwordHash, userRole]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
}

async function deleteAdminUser(req, res) {
  try {
    const { id } = req.params;
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Você não pode excluir seu próprio usuário conectado.' });
    }
    await db.query('DELETE FROM admin_users WHERE id = $1', [id]);
    return res.json({ message: 'Usuário removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir usuário admin:', error);
    return res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
}

function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

module.exports = {
  login,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  verifyTokenMiddleware
};
