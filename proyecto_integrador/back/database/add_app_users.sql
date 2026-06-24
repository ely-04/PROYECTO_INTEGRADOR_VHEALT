-- =============================================================================
-- V-HEALT — Tabla de usuarios para login/registro (asistente IA)
-- Base de datos: `plantas` (misma que el catálogo, ver PLANTAS_DB_NAME en .env)
--
-- NOTA: Esta tabla también se crea sola al registrar o iniciar sesión
--       (función ensureUsersTable en authRoutes.cjs).
--       Ejecuta este script solo si quieres crearla manualmente en phpMyAdmin.
-- =============================================================================

USE plantas;

CREATE TABLE IF NOT EXISTS app_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña cifrada con bcrypt (nunca texto plano)',
  full_name     VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_app_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar
DESCRIBE app_users;
