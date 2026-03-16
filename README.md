# Emergency Response Coordination System

Full-stack system for reporting emergencies, validating and prioritizing incidents, assigning responders, and tracking response times with alerts and audit trails.

## Overview

- **Reporters** register, log in, and create incidents with location coordinates.
- **Admins** validate and prioritize incidents, assign responders using nearest-unit recommendations.
- **Responders** receive assignments and update incident status.
- **Supervisors** view alerts and audit logs for escalation and accountability.
- The system generates alerts when response time rules are exceeded and records all actions in an immutable audit log.

## Tech Stack

| Layer     | Technology |
|----------|------------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router, Leaflet |
| Backend  | Node.js, Express 5, MongoDB (Mongoose) |
| Auth     | JWT, role-based access control |
| Maps     | Browser Geolocation, Leaflet / react-leaflet |

## Project Structure

- `frontend/` — React + Vite app; `src/api`, `src/components`, `src/context`, `src/pages`, `src/routes`
- `backend/` — Express API; `src/config`, `src/models`, `src/middleware`, `src/routes`, `src/controllers`, `src/services`
- `ARCHITECTURE.md` — Detailed architecture and folder layout

## Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: MONGO_URI, PORT (default 10000), JWT_SECRET (min 32 chars)
npm run dev
```

Seed response-time rules (required for alerts):

```bash
node scripts/seed-response-rules.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173 and proxies `/api` to the backend (default http://localhost:10000).

## Environment

**Backend (`.env`):**

- `PORT` — Server port (default 10000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing (use a long random string in production)

## User Roles

| Role       | Capabilities |
|-----------|---------------|
| REPORTER  | Register, login, create incidents, provide location |
| ADMIN     | Validate/prioritize incidents, assign responders, view alerts and audit |
| RESPONDER | View assignments, update incident/assignment status |
| SUPERVISOR| Alerts, audit log, dashboard escalation |

## API Overview

- `POST /api/auth/register` — Register (email, password, name, role)
- `POST /api/auth/login` — Login (email, password) → `{ user, token }`
- `GET /api/auth/me` — Current user (Bearer token)
- `GET/POST /api/incidents` — List, create incidents
- `GET/PATCH /api/incidents/:id` — Get, update incident (status, priority)
- `GET /api/assignments/recommend/:incidentId` — Nearest available responders
- `POST /api/assignments` — Assign responder (incidentId, responderId)
- `GET /api/assignments/my` — Responder’s assignments
- `PATCH /api/assignments/:id/status` — Update assignment status
- `GET /api/alerts`, `PATCH /api/alerts/:id/acknowledge`
- `GET /api/audit` — Paginated audit log
- `GET /api/users/responders` — List responders (admin/supervisor)

## Branching & CI/CD

- **main** — Production-ready code
- **develop** — Integration branch
- **feature/*** — Feature branches

CI runs on push/PR (see `.github/workflows/ci.yml`). Direct commits to `main` should be avoided; use Pull Requests and pass checks before merging.

## License

MIT.
