// Rutas API para plantas medicinales (CommonJS)
const express = require('express');
const router = express.Router();
const { queryPlantas } = require('../config/plantasDb.cjs');
const fallback = require('../data/fallbackData.cjs');

function isDbUnavailable(error) {
  if (!error) return false;
  if (error.code === 'ECONNREFUSED') return true;
  if (error.name === 'AggregateError') return true;
  if (Array.isArray(error.errors) && error.errors.some((e) => e && e.code === 'ECONNREFUSED')) return true;
  if (String(error).includes('ECONNREFUSED')) return true;
  return false;
}

// ==================== PLANTAS ====================

// Obtener todas las plantas
router.get('/plantas', async (req, res) => {
  try {
    const plantas = await queryPlantas(
      'SELECT * FROM plantas ORDER BY nombre_comun'
    );
    res.json({
      success: true,
      data: plantas,
      count: plantas.length
    });
  } catch (error) {
    console.error('Error obteniendo plantas:', error);
    if (isDbUnavailable(error)) {
      return res.json({
        success: true,
        data: fallback.plantas,
        count: fallback.plantas.length,
        source: 'fallback'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las plantas',
      error: error.message
    });
  }
});

// Obtener una planta por ID
router.get('/plantas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const planta = await queryPlantas(
      'SELECT * FROM plantas WHERE id_planta = ?',
      [id]
    );
    
    if (planta.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Planta no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: planta[0]
    });
  } catch (error) {
    console.error('Error obteniendo planta:', error);
    if (isDbUnavailable(error)) {
      const planta = fallback.plantas.find((p) => String(p.id_planta) === String(req.params.id));
      if (!planta) {
        return res.status(404).json({ success: false, message: 'Planta no encontrada' });
      }
      return res.json({ success: true, data: planta, source: 'fallback' });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la planta',
      error: error.message
    });
  }
});

// Buscar plantas por nombre
router.get('/plantas/buscar/:termino', async (req, res) => {
  try {
    const { termino } = req.params;
    const plantas = await queryPlantas(
      `SELECT * FROM plantas 
       WHERE nombre_comun LIKE ? OR nombre_cientifico LIKE ?
       ORDER BY nombre_comun`,
      [`%${termino}%`, `%${termino}%`]
    );
    
    res.json({
      success: true,
      data: plantas,
      count: plantas.length
    });
  } catch (error) {
    console.error('Error buscando plantas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar plantas',
      error: error.message
    });
  }
});

// ==================== ENFERMEDADES ====================

// Obtener todas las enfermedades
router.get('/enfermedades', async (req, res) => {
  try {
    const enfermedades = await queryPlantas(
      'SELECT * FROM enfermedades ORDER BY nombre'
    );
    res.json({
      success: true,
      data: enfermedades,
      count: enfermedades.length
    });
  } catch (error) {
    console.error('Error obteniendo enfermedades:', error);
    if (isDbUnavailable(error)) {
      return res.json({
        success: true,
        data: fallback.enfermedades,
        count: fallback.enfermedades.length,
        source: 'fallback'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las enfermedades',
      error: error.message
    });
  }
});

// Obtener una enfermedad por ID
router.get('/enfermedades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const enfermedad = await queryPlantas(
      'SELECT * FROM enfermedades WHERE id_enfermedad = ?',
      [id]
    );
    
    if (enfermedad.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enfermedad no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: enfermedad[0]
    });
  } catch (error) {
    console.error('Error obteniendo enfermedad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la enfermedad',
      error: error.message
    });
  }
});

// ==================== RELACIONES ====================

// Obtener plantas que tratan una enfermedad específica
router.get('/enfermedades/:id/plantas', async (req, res) => {
  try {
    const { id } = req.params;
    const plantas = await queryPlantas(
      `SELECT p.*
       FROM plantas p
       INNER JOIN planta_enfermedad pe ON p.id_planta = pe.id_planta
       WHERE pe.id_enfermedad = ?
       ORDER BY p.nombre_comun`,
      [id]
    );
    
    res.json({
      success: true,
      data: plantas,
      count: plantas.length
    });
  } catch (error) {
    console.error('Error obteniendo plantas para enfermedad:', error);
    if (isDbUnavailable(error)) {
      const rel = fallback.planta_enfermedad.filter((r) => String(r.id_enfermedad) === String(req.params.id));
      const plantas = rel
        .map((r) => fallback.plantas.find((p) => p.id_planta === r.id_planta))
        .filter(Boolean);
      return res.json({ success: true, data: plantas, count: plantas.length, source: 'fallback' });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las plantas',
      error: error.message
    });
  }
});

// Obtener enfermedades que trata una planta específica
router.get('/plantas/:id/enfermedades', async (req, res) => {
  try {
    const { id } = req.params;
    const enfermedades = await queryPlantas(
      `SELECT e.*
       FROM enfermedades e
       INNER JOIN planta_enfermedad pe ON e.id_enfermedad = pe.id_enfermedad
       WHERE pe.id_planta = ?
       ORDER BY e.nombre`,
      [id]
    );
    
    res.json({
      success: true,
      data: enfermedades,
      count: enfermedades.length
    });
  } catch (error) {
    console.error('Error obteniendo enfermedades de planta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las enfermedades',
      error: error.message
    });
  }
});

// Obtener propiedades de una planta
router.get('/plantas/:id/propiedades', async (req, res) => {
  try {
    const { id } = req.params;
    const propiedades = await queryPlantas(
      `SELECT pr.*
       FROM propiedades pr
       INNER JOIN planta_propiedad pp ON pr.id_propiedad = pp.id_propiedad
       WHERE pp.id_planta = ?
       ORDER BY pr.nombre`,
      [id]
    );
    
    res.json({
      success: true,
      data: propiedades,
      count: propiedades.length
    });
  } catch (error) {
    console.error('Error obteniendo propiedades de planta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las propiedades',
      error: error.message
    });
  }
});

// ==================== PROPIEDADES ====================

// Obtener todas las propiedades
router.get('/propiedades', async (req, res) => {
  try {
    const propiedades = await queryPlantas(
      'SELECT * FROM propiedades ORDER BY nombre'
    );
    res.json({
      success: true,
      data: propiedades,
      count: propiedades.length
    });
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las propiedades',
      error: error.message
    });
  }
});

// ==================== CATEGORÍAS ====================

// Obtener todas las categorías de plantas
router.get('/categorias-plantas', async (req, res) => {
  try {
    const categorias = await queryPlantas(
      'SELECT * FROM categoria_plantas ORDER BY nombre_categoria'
    );
    res.json({
      success: true,
      data: categorias,
      count: categorias.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías de plantas:', error);
    if (isDbUnavailable(error)) {
      return res.json({
        success: true,
        data: fallback.categoria_plantas,
        count: fallback.categoria_plantas.length,
        source: 'fallback'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error.message
    });
  }
});

// Obtener todas las categorías de enfermedades
router.get('/categorias-enfermedades', async (req, res) => {
  try {
    const categorias = await queryPlantas(
      'SELECT * FROM categorias_enfermedades ORDER BY nombre'
    );
    res.json({
      success: true,
      data: categorias,
      count: categorias.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías de enfermedades:', error);
    if (isDbUnavailable(error)) {
      return res.json({
        success: true,
        data: fallback.categorias_enfermedades,
        count: fallback.categorias_enfermedades.length,
        source: 'fallback'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error.message
    });
  }
});

// ==================== USOS PRINCIPALES ====================

// Obtener usos principales de una planta
router.get('/plantas/:id/usos', async (req, res) => {
  try {
    const { id } = req.params;
    const usos = await queryPlantas(
      'SELECT * FROM usos_principales WHERE id_planta = ? ORDER BY id_uso',
      [id]
    );
    
    res.json({
      success: true,
      data: usos,
      count: usos.length
    });
  } catch (error) {
    console.error('Error obteniendo usos de planta:', error);
    if (isDbUnavailable(error)) {
      const usos = fallback.usos_principales.filter((u) => String(u.id_planta) === String(req.params.id));
      return res.json({ success: true, data: usos, count: usos.length, source: 'fallback' });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usos',
      error: error.message
    });
  }
});

// ==================== INFORMACIÓN COMPLETA ====================

// Obtener información completa de una planta (con todas sus relaciones)
router.get('/plantas/:id/completa', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener información básica de la planta
    const [planta] = await queryPlantas(
      'SELECT * FROM plantas WHERE id_planta = ?',
      [id]
    );
    
    if (!planta) {
      return res.status(404).json({
        success: false,
        message: 'Planta no encontrada'
      });
    }
    
    // Obtener enfermedades relacionadas
    const enfermedades = await queryPlantas(
      `SELECT e.*
       FROM enfermedades e
       INNER JOIN planta_enfermedad pe ON e.id_enfermedad = pe.id_enfermedad
       WHERE pe.id_planta = ?`,
      [id]
    );
    
    // Obtener propiedades
    const propiedades = await queryPlantas(
      `SELECT pr.*
       FROM propiedades pr
       INNER JOIN planta_propiedad pp ON pr.id_propiedad = pp.id_propiedad
       WHERE pp.id_planta = ?`,
      [id]
    );
    
    // Obtener usos principales
    const usos = await queryPlantas(
      'SELECT * FROM usos_principales WHERE id_planta = ? ORDER BY id_uso',
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...planta,
        enfermedades,
        propiedades,
        usos
      }
    });
  } catch (error) {
    console.error('Error obteniendo información completa de planta:', error);
    if (isDbUnavailable(error)) {
      const planta = fallback.plantas.find((p) => String(p.id_planta) === String(req.params.id));
      if (!planta) {
        return res.status(404).json({ success: false, message: 'Planta no encontrada' });
      }
      const rel = fallback.planta_enfermedad.filter((r) => r.id_planta === planta.id_planta);
      const enfermedades = rel
        .map((r) => fallback.enfermedades.find((e) => e.id_enfermedad === r.id_enfermedad))
        .filter(Boolean);
      const usos = fallback.usos_principales.filter((u) => u.id_planta === planta.id_planta);

      return res.json({
        success: true,
        data: {
          ...planta,
          enfermedades,
          propiedades: [],
          usos,
        },
        source: 'fallback'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la información completa',
      error: error.message
    });
  }
});

module.exports = router;
