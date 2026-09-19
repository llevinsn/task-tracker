# Task Tracker

Proyecto de práctica para el curso de Claude Code (Módulo 1: gestión de sesiones largas).

## Uso

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## API

- `GET /api/tasks`
- `POST /api/tasks` `{ "title": string }`
- `PATCH /api/tasks/:id` `{ "title"?: string, "done"?: boolean }`
- `DELETE /api/tasks/:id`
