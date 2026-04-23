// Script para probar la conexión a la base de datos de plantas
const { queryPlantas, plantasDbConfig } = require('./src/config/plantasDb.cjs');

async function testConnection() {
  console.log('🌿 PROBANDO CONEXIÓN A BASE DE DATOS DE PLANTAS 🌿\n');
  console.log('📝 Configuración:');
  console.log(`   Host: ${plantasDbConfig.host}`);
  console.log(`   Database: ${plantasDbConfig.database}`);
  console.log(`   User: ${plantasDbConfig.user}\n`);

  try {
    // Test 1: Contar plantas
    console.log('📊 Test 1: Contando plantas...');
    const plantas = await queryPlantas('SELECT COUNT(*) as total FROM plantas');
    console.log(`✅ Total de plantas: ${plantas[0].total}\n`);

    // Test 2: Contar enfermedades
    console.log('📊 Test 2: Contando enfermedades...');
    const enfermedades = await queryPlantas('SELECT COUNT(*) as total FROM enfermedades');
    console.log(`✅ Total de enfermedades: ${enfermedades[0].total}\n`);

    // Test 3: Obtener estructura de la tabla plantas
    console.log('📊 Test 3: Verificando estructura de tabla plantas...');
    const estructura = await queryPlantas('DESCRIBE plantas');
    console.log('✅ Columnas encontradas:');
    console.table(estructura.map(col => ({ Column: col.Field, Type: col.Type, Null: col.Null })));

    // Test 4: Obtener algunas plantas de ejemplo
    console.log('\n📊 Test 4: Obteniendo primeras 5 plantas...');
    const ejemploPlantas = await queryPlantas(
      'SELECT * FROM plantas LIMIT 5'
    );
    console.log('✅ Plantas encontradas:');
    console.table(ejemploPlantas);

    // Test 5: Obtener algunas enfermedades de ejemplo
    console.log('\n📊 Test 5: Obteniendo primeras 5 enfermedades...');
    const ejemploEnfermedades = await queryPlantas(
      'SELECT * FROM enfermedades LIMIT 5'
    );
    console.log('✅ Enfermedades encontradas:');
    console.table(ejemploEnfermedades);

    // Test 6: Verificar relaciones
    console.log('\n📊 Test 6: Verificando relaciones...');
    const relaciones = await queryPlantas(
      'SELECT COUNT(*) as total FROM planta_enfermedad'
    );
    console.log(`✅ Total de relaciones planta-enfermedad: ${relaciones[0].total}\n`);

    // Test 7: Obtener información completa de una planta
    if (ejemploPlantas.length > 0) {
      const primeraPlanta = ejemploPlantas[0];
      const plantaId = primeraPlanta[Object.keys(primeraPlanta).find(key => 
        key.toLowerCase().includes('id') || key === Object.keys(primeraPlanta)[0]
      )];
      const plantaNombre = primeraPlanta.nombre_comun || primeraPlanta.nombre || Object.values(primeraPlanta)[1];
      
      console.log(`📊 Test 7: Obteniendo info completa de planta (${plantaNombre})...`);
      
      const enfermedadesPlanta = await queryPlantas(
        `SELECT e.*
         FROM enfermedades e
         INNER JOIN planta_enfermedad pe ON e.id_enfermedad = pe.id_enfermedad
         WHERE pe.id_planta = ?`,
        [plantaId]
      );
      
      console.log(`✅ Enfermedades que trata (${enfermedadesPlanta.length}):`);
      if (enfermedadesPlanta.length > 0) {
        console.table(enfermedadesPlanta.slice(0, 3));
      } else {
        console.log('   (No se encontraron enfermedades asociadas)');
      }
    }

    console.log('\n✨ TODOS LOS TESTS PASARON EXITOSAMENTE ✨');
    console.log('✅ La conexión a la base de datos de plantas funciona correctamente\n');

  } catch (error) {
    console.error('❌ ERROR EN LOS TESTS:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verifica que XAMPP/MySQL esté corriendo');
    console.error('   2. Verifica que la base de datos "plantas" existe');
    console.error('   3. Verifica las credenciales en el archivo .env');
    console.error('   4. Verifica que las tablas existen en la base de datos\n');
  } finally {
    process.exit(0);
  }
}

testConnection();
