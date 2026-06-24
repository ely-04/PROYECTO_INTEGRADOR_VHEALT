/**
 * Búsqueda de plantas para el chatbot: normaliza texto, tolera errores ortográficos
 * y detecta preguntas fuera del alcance (solo catálogo de plantas medicinales).
 */

const STOP = new Set([
  'el',
  'la',
  'de',
  'que',
  'y',
  'a',
  'en',
  'un',
  'una',
  'es',
  'son',
  'por',
  'para',
  'con',
  'los',
  'las',
  'del',
  'al',
  'me',
  'mi',
  'tu',
  'su',
  'se',
  'le',
  'lo',
  'como',
  'cual',
  'cuales',
  'cuál',
  'cuáles',
  'donde',
  'dónde',
  'cuando',
  'cuándo',
  'hay',
  'tiene',
  'tienen',
  'puede',
  'puedo',
  'quiero',
  'saber',
  'dime',
  'sobre',
  'algo',
  'alguna',
  'algun',
  'algún',
  'este',
  'esta',
  'estos',
  'estas',
  'ese',
  'esa',
  'muy',
  'mas',
  'más',
  'tan',
  'bien',
  'favor',
  'ayuda',
  'ayudame',
  'ayúdame',
  'informacion',
  'información',
  'decir',
  'explicar',
  'explicame',
  'explícame',
  'cuentame',
  'cuéntame',
  'sirve',
  'uso',
  'usos',
  'nombre',
  'llama',
  'llaman',
  'conoces',
  'conoce',
  'sabes',
  'sabe',
]);

const PLANT_TOPIC = new Set([
  'planta',
  'plantas',
  'medicinal',
  'medicinales',
  'hierba',
  'hierbas',
  'infusion',
  'infusión',
  'te',
  'té',
  'propiedad',
  'propiedades',
  'beneficio',
  'beneficios',
  'natural',
  'naturales',
  'remedio',
  'remedios',
  'catalogo',
  'catálogo',
  'botanica',
  'botánica',
  'aromatica',
  'aromática',
  'cientifico',
  'científico',
  'precaucion',
  'precaución',
  'precauciones',
  'contraindicacion',
  'contraindicación',
  'descripcion',
  'descripción',
  'ficha',
]);

const OFF_TOPIC = new Set([
  'clima',
  'tiempo',
  'temperatura',
  'futbol',
  'fútbol',
  'deporte',
  'deportes',
  'bitcoin',
  'cripto',
  'politica',
  'política',
  'presidente',
  'elecciones',
  'python',
  'javascript',
  'codigo',
  'código',
  'programar',
  'programacion',
  'programación',
  'pelicula',
  'película',
  'peliculas',
  'musica',
  'música',
  'cancion',
  'matematica',
  'matemática',
  'calculo',
  'cálculo',
  'suma',
  'resta',
  'multiplicacion',
  'historia',
  'guerra',
  'pais',
  'país',
  'capital',
  'receta',
  'cocina',
  'pizza',
  'hamburguesa',
  'amor',
  'novio',
  'novia',
  'cita',
  'trabajo',
  'sueldo',
  'dinero',
  'banco',
  'hipoteca',
  'videojuego',
  'juego',
  'netflix',
  'youtube',
  'tiktok',
  'instagram',
  'facebook',
  'whatsapp',
  'inteligencia',
  'artificial',
  'chatgpt',
  'gemini',
]);

const GREETING_ONLY = new Set([
  'hola',
  'hey',
  'buenas',
  'buenos',
  'dias',
  'tardes',
  'noches',
  'saludos',
  'gracias',
  'ok',
  'vale',
  'entendido',
]);

const OUT_OF_SCOPE_REPLY =
  'No puedo responder a eso. Solo puedo ayudarte con consultas básicas sobre plantas medicinales de nuestro catálogo (nombre, descripción y precauciones).';

const HELP_REPLY =
  'Puedo ayudarte con plantas de nuestro catálogo. Escribe el nombre de una planta, por ejemplo: manzanilla, jengibre o lavanda. También entiendo pequeños errores de ortografía.';

const GREETING_REPLY =
  'Hola. Soy el asistente de V-HEALT. Pregúntame por una planta medicinal del catálogo, por ejemplo: ¿qué es la manzanilla?';

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[¿?¡!.,;:()[\]"""''—\-_/\\@#$%&*+=<>|~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(normalized) {
  return normalized
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function maxEditDistance(wordLen) {
  if (wordLen <= 4) return 1;
  if (wordLen <= 8) return 2;
  return 3;
}

function plantNameVariants(plant) {
  const raw = [
    plant.nombre_comun,
    plant.nombre_cientifico,
    ...(String(plant.nombre_comun || '').split(/\s+/)),
    ...(String(plant.nombre_cientifico || '').split(/\s+/)),
  ];
  return [...new Set(raw.map((n) => normalizeText(n)).filter((n) => n.length > 2))];
}

function termMatchesName(term, name) {
  if (!term || !name) return false;
  if (name.includes(term) || term.includes(name)) return true;

  const dist = levenshtein(term, name);
  const limit = maxEditDistance(Math.min(term.length, name.length));
  return dist <= limit;
}

function scorePlantMatch(normalizedMessage, terms, plant) {
  const names = plantNameVariants(plant);
  let best = Infinity;

  for (const term of terms) {
    for (const name of names) {
      if (termMatchesName(term, name)) {
        return 0;
      }
      const dist = levenshtein(term, name);
      const limit = maxEditDistance(Math.min(term.length, name.length));
      if (dist <= limit) {
        best = Math.min(best, dist);
      }
    }
  }

  for (const name of names) {
    if (normalizedMessage.includes(name)) {
      return 0;
    }
  }

  return best;
}

function findMatchingPlantas(message, plantas) {
  const normalized = normalizeText(message);
  const terms = tokenize(normalized);
  if (!plantas.length) return [];

  const scored = plantas
    .map((plant) => ({
      plant,
      score: scorePlantMatch(normalized, terms, plant),
    }))
    .filter((item) => item.score < Infinity)
    .sort((a, b) => a.score - b.score || a.plant.nombre_comun.localeCompare(b.plant.nombre_comun));

  if (!scored.length) return [];

  const bestScore = scored[0].score;
  return scored
    .filter((item) => item.score <= bestScore + 1 && item.score <= maxEditDistance(8))
    .slice(0, 5)
    .map((item) => item.plant);
}

function isGreetingOnly(normalized) {
  const words = normalized.split(' ').filter(Boolean);
  if (!words.length) return false;
  return words.every((w) => GREETING_ONLY.has(w));
}

function isOffTopic(terms, matches, normalized) {
  if (matches.length > 0) return false;
  if (!terms.length) return false;
  if (isGreetingOnly(normalized)) return false;
  if (terms.some((t) => PLANT_TOPIC.has(t))) return false;
  if (terms.some((t) => OFF_TOPIC.has(t))) return true;
  if (terms.length >= 2) return true;
  return false;
}

function formatPlantReply(plant, extra = []) {
  const lines = [
    `**${plant.nombre_comun}** (*${plant.nombre_cientifico || 'sin nombre científico'}*)`,
    '',
  ];

  if (plant.descripcion) {
    lines.push(`**Descripción:** ${plant.descripcion}`);
  }
  if (plant.precauciones) {
    lines.push(`**Precauciones:** ${plant.precauciones}`);
  }

  lines.push('');
  lines.push('Esta información es educativa y no sustituye la consulta con un profesional de la salud.');
  lines.push('Puedes ver la ficha completa en la sección **Plantas medicinales**.');

  if (extra.length > 0) {
    lines.push('');
    lines.push(
      `También encontré: ${extra
        .slice(0, 3)
        .map((p) => p.nombre_comun)
        .join(', ')}.`
    );
  }

  return lines.join('\n');
}

function buildChatReply(message, plantas) {
  const normalized = normalizeText(message);

  if (!normalized) {
    return { reply: HELP_REPLY, results: [], source: 'help' };
  }

  if (isGreetingOnly(normalized)) {
    return { reply: GREETING_REPLY, results: [], source: 'greeting' };
  }

  const terms = tokenize(normalized);
  const matches = findMatchingPlantas(message, plantas);

  if (isOffTopic(terms, matches, normalized)) {
    return { reply: OUT_OF_SCOPE_REPLY, results: [], source: 'out_of_scope' };
  }

  if (matches.length > 0) {
    const [first, ...rest] = matches;
    return {
      reply: formatPlantReply(first, rest),
      results: matches.slice(0, 5),
      source: 'database',
    };
  }

  if (terms.some((t) => PLANT_TOPIC.has(t))) {
    return {
      reply:
        'No encontré esa planta en nuestro catálogo. Revisa la ortografía o prueba con otro nombre, por ejemplo: manzanilla, jengibre o lavanda.',
      results: [],
      source: 'not_found',
    };
  }

  return { reply: OUT_OF_SCOPE_REPLY, results: [], source: 'out_of_scope' };
}

function buildGeminiContext(matches) {
  if (!matches.length) {
    return 'Contexto del catálogo: no hay coincidencias claras para esta consulta. Si no puedes responder con datos del catálogo, dilo con claridad.';
  }
  const lines = matches.map((p) => {
    const parts = [`- ${p.nombre_comun} (${p.nombre_cientifico || 'sin nombre científico'})`];
    if (p.descripcion) parts.push(`  Descripción: ${p.descripcion}`);
    if (p.precauciones) parts.push(`  Precauciones: ${p.precauciones}`);
    return parts.join('\n');
  });
  return `Contexto del catálogo de plantas medicinales (usa SOLO esta información):\n${lines.join('\n')}`;
}

function precheckMessage(message, plantas) {
  const normalized = normalizeText(message);

  if (!normalized) {
    return { skipGemini: true, reply: HELP_REPLY, results: [], source: 'help' };
  }

  if (isGreetingOnly(normalized)) {
    return { skipGemini: true, reply: GREETING_REPLY, results: [], source: 'greeting' };
  }

  const terms = tokenize(normalized);
  const matches = findMatchingPlantas(message, plantas);

  if (isOffTopic(terms, matches, normalized)) {
    return { skipGemini: true, reply: OUT_OF_SCOPE_REPLY, results: [], source: 'out_of_scope' };
  }

  return { skipGemini: false, matches, terms, normalized };
}

module.exports = {
  normalizeText,
  tokenize,
  findMatchingPlantas,
  buildChatReply,
  buildGeminiContext,
  precheckMessage,
  OUT_OF_SCOPE_REPLY,
  HELP_REPLY,
  GREETING_REPLY,
};
