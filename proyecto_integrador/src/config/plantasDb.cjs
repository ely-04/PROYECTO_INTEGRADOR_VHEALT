// Configuración de conexión a la base de datos de plantas medicinales (CommonJS)
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuración para la base de datos de plantas
const plantasDbConfig = {
  host: process.env.PLANTAS_DB_HOST || 'localhost',
  port: Number(process.env.PLANTAS_DB_PORT || process.env.DB_PORT || 3306),
  user: process.env.PLANTAS_DB_USER || 'root',
  password: process.env.PLANTAS_DB_PASSWORD || '',
  database: process.env.PLANTAS_DB_NAME || process.env.DB_NAME || 'plantas'
};

// Pool de conexiones para mejor rendimiento
const plantasPool = mysql.createPool({
  ...plantasDbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para obtener conexión del pool
async function getPlantasConnection() {
  try {
    return await plantasPool.getConnection();
  } catch (error) {
    console.error('Error conectando a la base de datos de plantas:', error);
    throw error;
  }
}

// Función para ejecutar queries con manejo de errores
async function queryPlantas(sql, params = []) {
  const connection = await getPlantasConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  plantasPool,
  getPlantasConnection,
  queryPlantas,
  plantasDbConfig
};
