/**
 * Middleware JWT — protege rutas que requieren sesión (p. ej. chatbot IA).
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cambia-este-secreto-en-produccion';

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Debes iniciar sesión para usar el asistente de IA.',
        code: 'AUTH_REQUIRED',
      });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Sesión inválida o expirada. Inicia sesión de nuevo.',
      code: 'AUTH_INVALID',
    });
  }
}

module.exports = { requireAuth };
