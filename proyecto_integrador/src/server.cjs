const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());

const plantasRoutes = require('./routes/plantasRoutes.cjs');
app.use('/api', plantasRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de plantas/enfermedades funcionando',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ API lista en http://localhost:${PORT}`);
});

