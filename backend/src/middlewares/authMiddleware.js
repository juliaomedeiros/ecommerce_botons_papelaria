const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'tutaspaper_super_secret_jwt_key_2026';

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Se o token não tiver o role preenchido, buscar no banco
    if (!decoded.role) {
      const userRes = await db.query('SELECT role FROM admin_users WHERE id = $1', [decoded.id]);
      decoded.role = (userRes.rows[0] && userRes.rows[0].role) ? userRes.rows[0].role : 'funcionario';
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const userRole = req.user.role || 'funcionario';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: `Acesso restrito a ${allowedRoles.join(' ou ')}.` });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};
