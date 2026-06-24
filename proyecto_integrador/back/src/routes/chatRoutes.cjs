const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const { queryPlantas } = require('../config/plantasDb.cjs');
const fallback = require('../data/fallbackData.cjs');
const { requireAuth } = require('../middleware/authMiddleware.cjs');
const {
  buildChatReply,
  buildGeminiContext,
  precheckMessage,
} = require('../utils/chatSearch.cjs');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const SYSTEM_PROMPT = `Eres el asistente de V-HEALT sobre plantas medicinales.
- Responde en español, claro y breve.
- Usa SOLO el "Contexto del catálogo" que recibes; no inventes plantas ni datos médicos.
- Si el contexto no alcanza, di que no encontraste esa planta en el catálogo.
- Si la pregunta no es sobre plantas medicinales del catálogo, responde: "No puedo responder a eso. Solo puedo ayudarte con consultas básicas sobre plantas medicinales de nuestro catálogo."
- Recuerda que la información es educativa y no sustituye consulta médica profesional.`;

function isDbUnavailable(error) {
  if (!error) return false;
  if (error.code === 'ECONNREFUSED') return true;
  if (error.name === 'AggregateError') return true;
  if (Array.isArray(error.errors) && error.errors.some((e) => e && e.code === 'ECONNREFUSED')) {
    return true;
  }
  return String(error).includes('ECONNREFUSED');
}

async function loadPlantasCatalog() {
  try {
    const plantas = await queryPlantas(
      `SELECT id_planta, nombre_comun, nombre_cientifico, descripcion, precauciones
       FROM plantas
       ORDER BY nombre_comun`
    );
    return { plantas, source: 'database' };
  } catch (error) {
    if (isDbUnavailable(error)) {
      return { plantas: fallback.plantas, source: 'fallback' };
    }
    throw error;
  }
}

function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY && String(process.env.GEMINI_API_KEY).trim());
}

async function askGemini(userMessage, contextBlock) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  const model = String(GEMINI_MODEL).replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

  const userContent = `${contextBlock}\n\n---\nPregunta del usuario:\n${userMessage}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      generationConfig: {
        maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 1024),
        temperature: Number(process.env.GEMINI_TEMPERATURE || 0.7),
      },
    }),
  });

  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini no devolvió JSON (${res.status})`);
  }

  if (!res.ok) {
    const msg = data.error?.message || rawText.slice(0, 200);
    const err = new Error(msg || `Gemini HTTP ${res.status}`);
    if (res.status === 429 || /RESOURCE_EXHAUSTED|quota|rate limit|429/i.test(String(msg))) {
      err.code = 'QUOTA_EXCEEDED';
    }
    throw err;
  }

  const candidate = data.candidates?.[0];
  if (!candidate) {
    const block = data.promptFeedback?.blockReason;
    throw new Error(block ? `Contenido bloqueado (${block})` : 'Sin candidatos en la respuesta');
  }

  const parts = candidate.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p) => (p && p.text ? p.text : '')).join('')
    : '';
  const trimmed = String(text).trim();
  if (!trimmed) {
    throw new Error('Respuesta vacía del modelo');
  }
  return trimmed;
}

router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body || {};
    const text = String(message || '').trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Escribe el nombre de una planta o una pregunta básica sobre el catálogo.',
      });
    }

    const { plantas, source: catalogSource } = await loadPlantasCatalog();
    const precheck = precheckMessage(text, plantas);

    if (precheck.skipGemini) {
      return res.json({
        success: true,
        reply: precheck.reply,
        results: precheck.results || [],
        source: precheck.source,
        catalogSource,
        geminiConfigured: hasGeminiKey(),
      });
    }

    const useGemini = hasGeminiKey();
    let llmFailure = null;

    if (useGemini) {
      try {
        const contextBlock = buildGeminiContext(precheck.matches || []);
        const reply = await askGemini(text, contextBlock);
        return res.json({
          success: true,
          reply,
          results: (precheck.matches || []).slice(0, 5),
          source: 'gemini',
          catalogSource,
          geminiConfigured: true,
        });
      } catch (err) {
        console.error('Gemini:', err.message);
        llmFailure = err.code === 'QUOTA_EXCEEDED' ? 'quota_exceeded' : 'api_error';
      }
    }

    const fallbackReply = buildChatReply(text, plantas);
    return res.json({
      success: true,
      reply: fallbackReply.reply,
      results: fallbackReply.results,
      source: fallbackReply.source,
      catalogSource,
      geminiConfigured: useGemini,
      ...(llmFailure && { llmFailure }),
    });
  } catch (error) {
    console.error('chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el asistente',
      error: error.message,
    });
  }
});

module.exports = router;
