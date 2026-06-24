/**
 * Crea la base de datos de demostración `vhealth` y usuarios de prueba (opcional / legado).
 * Uso: node back/scripts/setup_mysql_database.cjs
 * Carga variables desde el `.env` en la raíz del monorepo.
 */
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'vhealth';

async function createDatabase() {
  let connection;
  try {
    console.log('Conectando a MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('Conectado.');

    console.log(`Creando base de datos ${DB_NAME}...`);
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${DB_NAME} 
       DEFAULT CHARACTER SET utf8mb4 
       DEFAULT COLLATE utf8mb4_unicode_ci`
    );
    await connection.execute(`USE ${DB_NAME}`);

    console.log('Creando tabla users...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'usuario') DEFAULT 'usuario',
        activo BOOLEAN DEFAULT TRUE,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_rol (rol),
        INDEX idx_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    await connection.execute(createTableSQL);

    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');

    if (existingUsers[0].count > 0) {
      console.log('Ya existen usuarios en la base.');
      const [users] = await connection.execute('SELECT id, nombre, email, rol FROM users');
      console.table(users);
    } else {
      console.log('Creando usuarios de prueba...');
      const adminPassword = await bcrypt.hash('Admin123!', 12);
      const userPassword = await bcrypt.hash('User123!', 12);
      const users = [
        ['Administrador V-Health', 'admin@vhealth.com', adminPassword, 'admin'],
        ['Usuario Demo', 'user@vhealth.com', userPassword, 'usuario'],
        ['Dr. Juan Pérez', 'doctor@vhealth.com', userPassword, 'usuario'],
        ['María García', 'maria@vhealth.com', userPassword, 'usuario'],
      ];
      const insertSQL = 'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
      for (const user of users) {
        await connection.execute(insertSQL, user);
        console.log(`Usuario creado: ${user[1]}`);
      }
    }

    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_usuarios,
        SUM(CASE WHEN rol = 'admin' THEN 1 ELSE 0 END) as administradores,
        SUM(CASE WHEN rol = 'usuario' THEN 1 ELSE 0 END) as usuarios_regulares,
        SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as usuarios_activos
      FROM users
    `);
    console.log('\nEstadísticas:');
    console.table(stats[0]);
    console.log('\nListo. Credenciales de prueba: admin@vhealth.com / Admin123! — user@vhealth.com / User123!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada.');
    }
  }
}

createDatabase();
