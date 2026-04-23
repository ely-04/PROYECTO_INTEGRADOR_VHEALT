# V-HEALT

Aplicación web con **React (Vite)** + **API Express** para consultar **plantas medicinales** y **enfermedades**.

## Requisitos

- Node.js (recomendado: LTS)
- (Opcional) MySQL si quieres conectar a tu BD real. Si MySQL no está activo, la API usa **datos fallback** para que el proyecto funcione igual.

## Instalación

```bash
npm install
```

## Variables de entorno (opcional)

Si vas a usar MySQL, copia el archivo `.env.example` a `.env` y edítalo:

```bash
cp .env.example .env
```

## Ejecutar en desarrollo

En una terminal (backend):

```bash
npm run server
```

En otra terminal (frontend):

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## Build

```bash
npm run build
```

## Notas para repositorio

- El archivo `.env` **no se sube** (se usa `.env.example` como plantilla).
- Artefactos y archivos generados (keys/ssl/db/pdfs) están ignorados en `.gitignore`.
