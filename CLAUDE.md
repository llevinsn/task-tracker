# Task Tracker

## Módulos
- CommonJS (`require`/`module.exports`) en todo el proyecto. No uses `import`/`export`.

## Backend
- Las rutas van en `src/routes/<recurso>.js`, un router de Express por recurso, montado en `server.js`.
- IMPORTANT: nunca leas ni escribas `data/tasks.json` desde una ruta. Todo acceso a los datos pasa por las funciones de `src/store.js` (`getTasks`, `addTask`, `updateTask`, `deleteTask`).
- Los IDs de tareas se generan con `crypto.randomUUID()`, no con contadores incrementales.
- Errores de validación: responde `res.status(400).json({ error: '...' })`, no lances excepciones sin capturar.
- Recurso no encontrado: `res.status(404).json({ error: '...' })`.

## Frontend
- `public/` es JS vanilla sin build tooling. No agregues bundlers, frameworks ni dependencias de frontend.
- `app.js` habla con la API solo vía `fetch`, sin librerías HTTP.
