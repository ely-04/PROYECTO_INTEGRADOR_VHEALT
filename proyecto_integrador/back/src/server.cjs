const app = require('./app.cjs');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API lista en http://localhost:${PORT} (pid ${process.pid})`);
  // eslint-disable-next-line no-console
  console.log('Chat: consultas al catálogo de plantas' + (process.env.GEMINI_API_KEY ? ' + Google Gemini.' : ' (sin GEMINI_API_KEY).'));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(
      `\nERROR: el puerto ${PORT} ya está en uso. Suele quedar un Node viejo.\n` +
        'En PowerShell (Windows): netstat -ano | findstr :3000\n' +
        'Luego: taskkill /PID <número_de_la_última_columna> /F\n'
    );
  } else {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  process.exit(1);
});
