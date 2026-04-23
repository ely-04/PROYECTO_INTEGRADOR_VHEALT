// Script para documentar la estructura de la base de datos de plantas
const { queryPlantas } = require('./src/config/plantasDb.cjs');

async function documentDatabase() {
  console.log('📚 DOCUMENTACIÓN DE LA BASE DE DATOS DE PLANTAS\n');

  const tablas = [
    'plantas',
    'enfermedades',
    'propiedades',
    'planta_enfermedad',
    'planta_propiedad',
    'usos_principales',
    'categoria_plantas',
    'categorias_enfermedades'
  ];

  for (const tabla of tablas) {
    try {
      console.log(`\n📋 TABLA: ${tabla}`);
      console.log('='.repeat(60));
      
      const estructura = await queryPlantas(`DESCRIBE ${tabla}`);
      console.table(estructura.map(col => ({
        Columna: col.Field,
        Tipo: col.Type,
        Nulo: col.Null,
        Clave: col.Key,
        Default: col.Default
      })));
      
      const [count] = await queryPlantas(`SELECT COUNT(*) as total FROM ${tabla}`);
      console.log(`\n📊 Total de registros: ${count.total}`);
      
    } catch (error) {
      console.error(`❌ Error con tabla ${tabla}:`, error.message);
    }
  }

  console.log('\n\n✅ Documentación completada');
  process.exit(0);
}

documentDatabase();
