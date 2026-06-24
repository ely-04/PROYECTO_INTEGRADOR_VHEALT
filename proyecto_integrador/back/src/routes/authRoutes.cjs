const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryPlantas } = require('../config/plantasDb.cjs');
const { validateSecurePassword } = require('../utils/passwordValidator.cjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cambia-este-secreto-en-produccion';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

async function ensureUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS app_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  await queryPlantas(sql, []);
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, fullName: user.full_name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

router.post('/auth/register', async (req, res) => {
  try {
    await ensureUsersTable();
    const { email, password, fullName } = req.body || {};
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, contraseña y nombre completo son obligatorios',
      });
    }
    const normalizedEmail = String(email).trim().toLowerCase();

    const passwordCheck = validateSecurePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña no cumple los requisitos de seguridad.',
        passwordErrors: passwordCheck.failures,
      });
    }

    const existing = await queryPlantas(
      'SELECT id FROM app_users WHERE email = ?',
      [normalizedEmail]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cuenta con ese correo',
      });
    }
    const passwordHash = await bcrypt.hash(String(password), 12);
    await queryPlantas(
      'INSERT INTO app_users (email, password_hash, full_name) VALUES (?, ?, ?)',
      [normalizedEmail, passwordHash, String(fullName).trim()]
    );
    const rows = await queryPlantas(
      'SELECT id, email, full_name FROM app_users WHERE email = ?',
      [normalizedEmail]
    );
    const user = rows[0];
    const token = signToken(user);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
  } catch (error) {
    console.error('register:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar',
      error: error.message,
    });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    await ensureUsersTable();
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios',
      });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const rows = await queryPlantas(
      'SELECT id, email, full_name, password_hash FROM app_users WHERE email = ?',
      [normalizedEmail]
    );
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas',
      });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas',
      });
    }
    const token = signToken(user);
    return res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
  } catch (error) {
    console.error('login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
});

router.get('/auth/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        fullName: payload.fullName,
      },
    });
  } catch {
    return res.status(401).json({ success: false, message: 'Sesión inválida' });
  }
});

module.exports = router;
