# V-HEALT

Aplicación web con **React (Vite)** en `front/` y **API Express** en `back/` para consultar **plantas medicinales** y **enfermedades**, con **inicio de sesión (JWT)**, **asistente de chat** (búsqueda en tu base `plantas`) y UI actualizada.

## Estructura del repositorio

```
proyecto_integrador/
├── front/                 # React + Vite (UI)
│   ├── src/
│   ├── public/
│   └── package.json
├── back/                  # Express (API)
│   ├── src/
│   │   ├── server.cjs
│   │   ├── config/
│   │   ├── routes/
│   │   └── data/
│   ├── scripts/           # Utilidades (setup BD legado)
│   ├── database/          # SQL de referencia / migraciones antiguas
│   └── package.json
├── api/                   # Entrada serverless para Vercel
│   └── index.cjs
├── vercel.json            # Configuración de deploy
├── .env                   # Config compartida (no subir a Git)
└── README.md
```

- **`front/`** — Vite + React, Tailwind, rutas, chatbot flotante.
- **`back/`** — Express, MySQL (`mysql2`), rutas `/api/plantas`, `/api/auth/*`, `/api/chat`.
- **`.env` en la raíz** (junto a `front` y `back`) — variables del API (puerto, MySQL `PLANTAS_*`, `JWT_SECRET`).

Carpetas como `generated-pdfs/`, `document-archive/`, `keys/`, `ssl/` en la raíz (si existen) son **artefactos o datos antiguos**; no son necesarias para `npm run dev:full`. Puedes ignorarlas o borrarlas si ya no las usas.

## Requisitos

- Node.js 20+ (recomendado LTS; Vite 7 pide versiones recientes)
- (Opcional) MySQL con la base **`plantas`**. Si MySQL no responde, el catálogo sigue con **datos fallback**; el chat también puede usar fallback.

## Instalación

En la **raíz** del proyecto (carpeta que contiene `front` y `back`):

```bash
npm install
```

Esto instala el monorepo (workspaces) y las dependencias de `front` y `back`.

## Variables de entorno

Copia la plantilla y edita:

```bash
copy .env.example .env
```

Revisa al menos: `PLANTAS_DB_*`, `JWT_SECRET` (obligatorio en producción) y, si aplica, contraseña de MySQL.

## Ejecutar en desarrollo

**Opción A — API y web a la vez:**

```bash
npm run dev:full
```

**Opción B — dos terminales**

Terminal 1 (API, puerto 3000 por defecto):

```bash
npm run server
```

Terminal 2 (Vite, puerto 5173):

```bash
npm run dev
```

- Frontend: <http://localhost:5173> (Vite reenvía `/api` al backend).
- Backend: <http://localhost:3000> — comprobar: <http://localhost:3000/api/health>

## Registro e inicio de sesión

- Ruta en la app: **Iniciar sesión** → registro o login.
- En la base `plantas`, el API crea la tabla **`app_users`** la primera vez que hace falta.
- El token JWT se guarda en el navegador (`localStorage`).

## Asistente (chatbot)

Botón flotante **💬** → `POST /api/chat` (requiere iniciar sesión).

El asistente combina **Google Gemini** con consultas a tu base **`plantas`**:

1. Busca coincidencias en el catálogo (tolera errores de ortografía y signos `¿?`).
2. Envía ese contexto a **Gemini** para redactar la respuesta en lenguaje natural.
3. Si la pregunta no es sobre plantas del catálogo, responde que no puede ayudar.
4. Si Gemini falla o no hay `GEMINI_API_KEY`, usa respuesta directa de la base de datos.

### Configurar Gemini (5 minutos)

1. Entra a [Google AI Studio](https://aistudio.google.com/apikey).
2. Crea una **API Key**.
3. En tu `.env` local (o en Vercel → Environment Variables):

```env
GEMINI_API_KEY=tu_clave_aqui
GEMINI_MODEL=gemini-2.0-flash
```

4. Reinicia el servidor (`npm run server`) o redeploy en Vercel.
5. Comprueba: `http://localhost:3000/api/health` → debe decir `"geminiConfigured": true`.

Preguntas de prueba: `¿qué es la manzanilla?`, `manzanila`, `jengibre`.

## Build (solo frontend)

```bash
npm run build
```

Salida: `front/dist/`.

## Deploy en Vercel

1. Sube el repositorio a GitHub (carpeta raíz del monorepo: la que contiene `front/`, `back/`, `api/` y `vercel.json`).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. **Root Directory:** deja la carpeta del monorepo (`proyecto_integrador` si el repo tiene un nivel extra).
4. Vercel detecta `vercel.json` automáticamente (`build` → `front/dist`, API en `/api`).
5. En **Settings → Environment Variables**, agrega:

| Variable | Descripción |
|----------|-------------|
| `JWT_SECRET` | Secreto largo y aleatorio (obligatorio) |
| `PLANTAS_DB_HOST` | Host de MySQL en la nube (no `localhost`) |
| `PLANTAS_DB_PORT` | `3306` |
| `PLANTAS_DB_USER` | Usuario MySQL |
| `PLANTAS_DB_PASSWORD` | Contraseña MySQL |
| `PLANTAS_DB_NAME` | `plantas` |
| `GEMINI_API_KEY` | Clave de [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | `gemini-2.0-flash` (opcional) |

6. **Deploy**. La app quedará en `https://tu-proyecto.vercel.app`.
7. Comprueba: `https://tu-proyecto.vercel.app/api/health`

**Nota:** No definas `VITE_API_URL` en Vercel; front y API comparten el mismo dominio.

**MySQL en la nube:** Railway, Aiven o cualquier host con acceso remoto. Sin MySQL, el sitio funciona con datos fallback (útil para la demo, pero el login real necesita BD).

### Desarrollo local (igual que antes)

```bash
npm run dev:full
```

## Base de datos opcional (legado)

- **`npm run setup:legacy-db`** — crea la base **`vhealth`** y usuarios demo con `back/scripts/setup_mysql_database.cjs`. Es independiente del login actual (`app_users` en la base **`plantas`**).
- **`setup_database.bat`** — mismo script en Windows.

## Otros

- Scripts SQL sueltos están en **`back/database/`** (referencia / histórico).
- El archivo **`.env` no se sube** a Git; usa `.env.example` como referencia.
