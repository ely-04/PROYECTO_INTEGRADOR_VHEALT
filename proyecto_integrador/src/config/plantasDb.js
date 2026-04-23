// Configuración de conexión a la base de datos de plantas medicinales
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para la base de datos de plantas
const plantasDbConfig = {
  host: process.env.PLANTAS_DB_HOST || 'localhost',
  user: process.env.PLANTAS_DB_USER || 'root',
  password: process.env.PLANTAS_DB_PASSWORD || '',
  database: process.env.PLANTAS_DB_NAME || 'plantas'
};

// Pool de conexiones para mejor rendimiento
const plantasPool = mysql.createPool({
  ...plantasDbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

06
// Función para obtener conexión del pool
async function getPlantasConnection() {
  try {
    return await plantasPool.getConnection();
  } catch (error) {
    console.error('Error conectando a la base de datos de plantas:', error);
    throw error;
  }8
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

export {
  plantasPool,
  getPlantasConnection,
  queryPlantas,
  plantasDbConfig
};
