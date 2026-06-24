/**
 * =============================================================================
 * V-HEALT — Rutas del módulo de programación lógica (Prolog)
 * Archivo: logicRoutes.cjs
 *
 * Prefijo montado en server.cjs: app.use('/api/logica', logicRoutes)
 * =============================================================================
 */

const express = require('express');
const { recomendar, infoBase } = require('../controllers/logicController.cjs');

const router = express.Router();

/**
 * GET /api/logica/recomendar?paciente=ana&sintoma=dolor_estomago
 *
 * Expone la inferencia del sistema experto:
 *   - Entrada: paciente (átomo) + síntoma (átomo).
 *   - Salida: lista de plantas que cumplen las reglas Horn de la BC.
 */
router.get('/recomendar', recomendar);

/**
 * GET /api/logica/base
 * Metadatos de la base de conocimiento (predicados, pacientes, síntomas).
 */
router.get('/base', infoBase);

module.exports = router;
