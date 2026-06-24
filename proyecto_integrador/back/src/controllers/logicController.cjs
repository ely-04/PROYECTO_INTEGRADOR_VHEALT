/**
 * =============================================================================
 * V-HEALT — Controlador del módulo de programación lógica (Prolog)
 * Archivo: logicController.cjs
 *
 * Responsabilidad: puente entre Express (Node.js) y la base de conocimiento Prolog.
 * Motor utilizado: tau-prolog (intérprete Prolog en JavaScript puro).
 *
 * Flujo de inferencia expuesto al cliente HTTP:
 *   1. Recibir paciente + síntoma (query string).
 *   2. Cargar knowledge_base.pl en una sesión Prolog.
 *   3. Ejecutar la meta: recomendar_todas(Paciente, Sintoma, Plantas).
 *   4. Parsear la lista de plantas unificada y enriquecer con metadatos.
 *   5. Devolver JSON con recomendaciones y trazabilidad de la consulta.
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const tau = require('tau-prolog');

/** Ruta absoluta al archivo .pl (hechos + reglas Horn). */
const KNOWLEDGE_BASE_PATH = path.join(__dirname, '../../prolog/knowledge_base.pl');

/** Síntomas válidos según hechos alivia/2 en la base de conocimiento. */
const SINTOMAS_VALIDOS = new Set([
  'dolor_estomago',
  'insomnio',
  'ansiedad_leve',
  'nausea',
  'mareo',
  'irritacion_piel',
  'quemadura_leve',
  'sequedad_piel',
]);

/** Pacientes válidos según hechos paciente/1. */
const PACIENTES_VALIDOS = new Set(['ana', 'luis', 'maria', 'carlos']);

/**
 * Normaliza identificadores recibidos por HTTP al formato átomo Prolog
 * (minúsculas, guiones bajos, sin espacios).
 */
function normalizarAtomo(valor) {
  return String(valor || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Promisifica session.consult/2 de tau-prolog.
 * Carga en memoria los HECHOS y REGLAS del archivo .pl (fase de aserción).
 */
function consultarBase(session, codigoProlog) {
  return new Promise((resolve, reject) => {
    session.consult(codigoProlog, {
      success: () => resolve(),
      error: (err) => reject(new Error(`Error al cargar knowledge_base.pl: ${err}`)),
    });
  });
}

/**
 * Ejecuta una meta Prolog y recopila TODAS las soluciones (backtracking).
 *
 * Proceso de INFERENCIA (backward chaining / resolución SLD):
 *   - session.query/2 lanza la meta (p. ej. recomendar_todas(ana, tos, L)).
 *   - session.answers/2 itera: unifica variables, aplica reglas Horn y hechos.
 *   - Cada success devuelve una sustitución (answer) hasta agotar alternativas.
 */
function ejecutarConsulta(session, meta) {
  return new Promise((resolve, reject) => {
    const sustituciones = [];

    session.query(meta, {
      success: () => {
        const pedirSiguiente = () => {
          session.answer({
            success: (answer) => {
              sustituciones.push(answer);
              pedirSiguiente();
            },
            fail: () => resolve(sustituciones),
            error: (err) => reject(new Error(`Error en inferencia: ${err}`)),
            limit: () => resolve(sustituciones),
          });
        };
        pedirSiguiente();
      },
      error: (err) => reject(new Error(`Meta Prolog inválida: ${err}`)),
    });
  });
}

/**
 * Convierte un término Prolog (objeto Term de tau-prolog) a JavaScript.
 * Soporta átomos, listas Prolog (./2) y listas vacías [].
 */
function terminoAJs(term) {
  if (term === null || term === undefined) return null;
  if (typeof term === 'string') return term;

  // Objeto Term de tau-prolog: { id, args, ... }
  if (typeof term === 'object' && term.id === '[]') {
    return [];
  }

  if (typeof term === 'object' && term.id === '.' && Array.isArray(term.args)) {
    const [head, tail] = term.args;
    const cola = terminoAJs(tail);
    return [terminoAJs(head), ...(Array.isArray(cola) ? cola : [])];
  }

  if (typeof term === 'object' && term.id && Array.isArray(term.args) && term.args.length === 0) {
    return term.id;
  }

  if (typeof term === 'object' && term.id) {
    return String(term.id);
  }

  return String(term);
}

/**
 * Extrae la lista de plantas de la sustitución devuelta por recomendar_todas/3.
 * tau-prolog devuelve un objeto Substitution con links: { Plantas: Term }.
 */
function extraerPlantasDeRespuesta(session, answer) {
  if (!answer) return [];

  const links = answer.links || answer;
  const plantasTerm = links.Plantas ?? links.plantas;

  if (plantasTerm) {
    const lista = terminoAJs(plantasTerm);
    return Array.isArray(lista) ? lista.filter(Boolean) : lista ? [lista] : [];
  }

  const formateado = session.format_answer(answer);
  const match = formateado.match(/Plantas\s*=\s*\[(.*)\]/i);
  if (!match || !match[1].trim()) return [];
  return match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Consulta auxiliar: obtiene la familia botánica de una planta (hecho planta/2).
 */
async function obtenerFamilia(session, nombrePlanta) {
  const meta = `planta(${nombrePlanta}, Familia).`;
  const respuestas = await ejecutarConsulta(session, meta);
  if (!respuestas.length) return null;
  const links = respuestas[0].links || respuestas[0];
  return terminoAJs(links.Familia);
}

/**
 * Consulta auxiliar: síntomas que alivia una planta (hechos alivia/2).
 */
async function obtenerSintomasPlanta(session, nombrePlanta) {
  const meta = `alivia(${nombrePlanta}, Sintoma).`;
  const respuestas = await ejecutarConsulta(session, meta);
  const sintomas = [];
  for (const ans of respuestas) {
    const links = ans.links || ans;
    const s = terminoAJs(links.Sintoma);
    if (s) sintomas.push(s);
  }
  return sintomas;
}

/**
 * GET /api/logica/recomendar?paciente=ana&sintoma=dolor_estomago
 *
 * Punto de entrada HTTP: orquesta carga de BC + inferencia + respuesta JSON.
 */
async function recomendar(req, res) {
  try {
    const paciente = normalizarAtomo(req.query.paciente);
    const sintoma = normalizarAtomo(req.query.sintoma);

    if (!paciente || !sintoma) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros requeridos: paciente y sintoma (query string).',
        ejemplo: '/api/logica/recomendar?paciente=ana&sintoma=dolor_estomago',
      });
    }

    if (!PACIENTES_VALIDOS.has(paciente)) {
      return res.status(400).json({
        success: false,
        message: `Paciente "${paciente}" no existe en la base de conocimiento.`,
        pacientesDisponibles: [...PACIENTES_VALIDOS],
      });
    }

    if (!SINTOMAS_VALIDOS.has(sintoma)) {
      return res.status(400).json({
        success: false,
        message: `Síntoma "${sintoma}" no está modelado en la base de conocimiento.`,
        sintomasDisponibles: [...SINTOMAS_VALIDOS],
      });
    }

    // --- Fase 1: lectura del archivo Prolog (hechos + reglas Horn en disco) ---
    const codigoProlog = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8');

    // --- Fase 2: creación de sesión e carga (assert) de la base de conocimiento ---
    const session = tau.create();
    await consultarBase(session, codigoProlog);

    // --- Fase 3: construcción de la META a demostrar por inferencia ---
    // Predicado principal: recomendar_todas/3 (regla con findall/3 en knowledge_base.pl)
    const meta = `recomendar_todas(${paciente}, ${sintoma}, Plantas).`;

    // --- Fase 4: backward chaining — el motor aplica reglas apto/2 y recomendar/3 ---
    const respuestas = await ejecutarConsulta(session, meta);

    let nombresPlantas = [];
    if (respuestas.length > 0) {
      nombresPlantas = extraerPlantasDeRespuesta(session, respuestas[0]);
    }

    // Enriquecer cada planta con familia y síntomas (consultas a hechos planta/2, alivia/2)
    const recomendaciones = [];
    for (const pl of nombresPlantas) {
      const familia = await obtenerFamilia(session, pl);
      const sintomasQueAlivia = await obtenerSintomasPlanta(session, pl);
      recomendaciones.push({
        planta: pl,
        familia_botanica: familia,
        alivia: sintomasQueAlivia,
        apta_para_paciente: true,
        razon: `Inferida por regla Horn recomendar/3: apto(${paciente}, ${pl}) ∧ alivia(${pl}, ${sintoma}).`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        paciente,
        sintoma,
        recomendaciones,
        total: recomendaciones.length,
      },
      inferencia: {
        motor: 'tau-prolog',
        tipo: 'backward chaining (SLD resolution)',
        meta_ejecutada: meta,
        reglas_aplicadas: ['apto/2', 'recomendar/3', 'recomendar_todas/3'],
        explicacion:
          'El motor demostró apto(Paciente,Planta) comprobando planta/2, paciente/1 y negación de alergia/2; luego alivia(Planta,Sintoma).',
      },
    });
  } catch (error) {
    console.error('[logicController] recomendar:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al ejecutar el motor de inferencia Prolog.',
      error: error.message,
    });
  }
}

/**
 * GET /api/logica/base
 * Expone metadatos de la BC (útil para documentación y frontend).
 */
async function infoBase(req, res) {
  try {
    const codigoProlog = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8');
    const session = tau.create();
    await consultarBase(session, codigoProlog);

    return res.status(200).json({
      success: true,
      data: {
        archivo: 'prolog/knowledge_base.pl',
        pacientes: [...PACIENTES_VALIDOS],
        sintomas: [...SINTOMAS_VALIDOS],
        plantas: ['manzanilla', 'jengibre', 'aloe_vera'],
        predicados: {
          hechos: ['planta/2', 'alivia/2', 'paciente/1', 'alergia/2'],
          reglas_horn: ['apto/2', 'recomendar/3', 'recomendar_todas/3'],
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  recomendar,
  infoBase,
  normalizarAtomo,
};
