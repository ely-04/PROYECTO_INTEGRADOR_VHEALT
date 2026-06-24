const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const plantasRoutes = require('./routes/plantasRoutes.cjs');
const authRoutes = require('./routes/authRoutes.cjs');
const chatRoutes = require('./routes/chatRoutes.cjs');
const logicRoutes = require('./routes/logicRoutes.cjs');

const app = express();

function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY && String(process.env.GEMINI_API_KEY).trim());
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de plantas / auth / chat / lógica Prolog',
    timestamp: new Date().toISOString(),
    chatMode: hasGeminiKey() ? 'gemini+database' : 'database',
    geminiConfigured: hasGeminiKey(),
    chatApiVersion: 4,
    logicEngine: 'tau-prolog',
  });
});

app.use('/api/logica', logicRoutes);
app.use('/api', plantasRoutes);
app.use('/api', authRoutes);
app.use('/api', chatRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

module.exports = app;
