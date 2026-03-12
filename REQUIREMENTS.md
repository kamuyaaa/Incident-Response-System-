# Emergency Response Coordination System – Requirements Compliance

This document maps each functional and non-functional requirement to its implementation and confirms how it is satisfied.

---

## Functional Requirements

### 1. Reporters can register and log in

- **Backend:** `POST /api/auth/register` (express-validator: email, password min 8, name, optional role). `POST /api/auth/login` returns `{ user, token }`. `GET /api/auth/me` returns current user when authenticated.
- **Frontend:** `Register.jsx` – form with name, email, password, role (default REPORTER); calls `AuthContext.register()` then auto-login. `Login.jsx` – email/password form; calls `AuthContext.login()`. Token stored in localStorage; `AuthContext` loads user from `/api/auth/me`.
- **Satisfied:** Yes.

### 2. Reporters can create incidents

- **Backend:** `POST /api/incidents` (auth + `requireRole('REPORTER','ADMIN')`). Validation: title, description, category, coordinates or latitude/longitude required. `incidentService.create()` creates incident and appends audit.
- **Frontend:** `ReportIncident.jsx` (and route `/report`, `/incidents/new`) – form with category, title, description, severity, address; requires location; submits to `INCIDENTS.create`; redirects to incident detail.
- **Satisfied:** Yes.

### 3. Reporters can provide coordinates

- **Backend:** Incidents require `coordinates [lng, lat]` or `latitude` + `longitude` (validated in routes and service). Stored as GeoJSON `Point` in `Incident.location`.
- **Frontend:** `ReportIncident.jsx` uses `LocationPicker`; state `coordinates` (lat/lng) required before submit; payload sends `coordinates: [coordinates.lng, coordinates.lat]`. `useGeolocation` supports “Use my location”.
- **Satisfied:** Yes.

### 4. Admin users can validate incidents

- **Backend:** `PATCH /api/incidents/:id/validate` (auth + `requireRole('ADMIN','SUPERVISOR')`). Calls `incidentService.update(id, { status: 'validated', validatedAt })`; status transition validated; audit appended.
- **Frontend:** `IncidentDetail.jsx` – when `canAdmin` and `incident.status === 'reported'`, shows “Validate” button and priority dropdown; validate calls `INCIDENTS.validate(id)`.
- **Satisfied:** Yes.

### 5. Admin users can prioritize incidents

- **Backend:** `PATCH /api/incidents/:id/priority` with body `{ priority }` (auth + ADMIN/SUPERVISOR). Validation: priority in low/medium/high/critical. `incidentService.update()` updates priority and audits.
- **Frontend:** Same admin block on `IncidentDetail.jsx` – priority `<select>` calls `handlePriority(value)` → `INCIDENTS.priority(id)` with selected priority.
- **Satisfied:** Yes.

### 6. Admin users can assign responders

- **Backend:** `POST /api/assignments` with `{ incidentId, responderId }` (auth + ADMIN/SUPERVISOR). `assignmentService.assign()` creates assignment (status pending), sets incident status to assigned, audits, and triggers response-time check.
- **Frontend:** `IncidentDetail.jsx` – when validated or assigned, “Assign responder” card: “Recommend nearest” calls `ASSIGNMENTS.recommend(incidentId)`, then list of responders with “Assign” calling `ASSIGNMENTS.create` with `responderId`.
- **Satisfied:** Yes.

### 7. System recommends nearest available units

- **Backend:** `dispatchService.getNearestAvailableResponders(incidentLocation, options)` – excludes busy responders (pending/accepted/en_route/on_site), filters by RESPONDER, isAvailable, optional serviceType/capabilities; haversine distance; returns sorted by distance with `distanceKm`. `GET /api/assignments/recommend/:incidentId` (ADMIN/SUPERVISOR) returns this list.
- **Frontend:** Incident detail “Recommend nearest” loads recommendations from `ASSIGNMENTS.recommend(id)` and displays responders with distance and Assign button.
- **Satisfied:** Yes.

### 8. Responders receive assignments

- **Backend:** Assignments created with status `pending`. `GET /api/assignments/my` (RESPONDER) returns list by responder; populated incidentId and assignedBy. Responder sees assignments on dashboard and assignment panel.
- **Frontend:** `ResponderDashboard.jsx` and `AssignmentPanel.jsx` (route `/assignments`) fetch `ASSIGNMENTS.my`; display list with link to `/incidents/:id`. Dashboard also shows recent assignments from dashboard API.
- **Satisfied:** Yes.

### 9. Responders update incident status

- **Backend:** `PATCH /api/assignments/:id/status` (RESPONDER) with `{ status }` (pending|accepted|en_route|on_site|completed|declined). `assignmentService.updateStatus()` enforces transitions, sets acceptedAt/completedAt, syncs incident status (e.g. in_progress when en_route/on_site, resolved when completed). `PATCH /api/incidents/:id` (RESPONDER allowed) for direct incident status where applicable. Both paths append audit.
- **Frontend:** `IncidentDetail.jsx` – for the current user’s assignment, `AssignmentActionButtons`: Accept/Decline (pending), En route (accepted → sets incident in_progress), On site (en_route), Resolved (on_site → completed + incident resolved). Calls `ASSIGNMENTS.status(assignmentId)` and optionally incident update.
- **Satisfied:** Yes.

### 10. System generates alerts when incidents exceed defined response time

- **Backend:** `alertService.checkResponseTime(incident)` uses incident `responseThresholdMinutes`, or `responseDeadline`, or `ResponseTimeRule` by priority; creates `Alert` (type `response_time_exceeded`) when overdue and not already alerted; audit entry for alert. Called after create/update/assignment changes. Optional scheduler can run `runOverdueCheck()` for all open incidents. `GET /api/alerts` (ADMIN/SUPERVISOR), `PATCH /api/alerts/:id/acknowledge`.
- **Frontend:** Admin dashboard shows overdue count and “Overdue alerts” panel from `ALERTS.list?acknowledged=false`. `Alerts.jsx` (/alerts) lists and acknowledges alerts.
- **Satisfied:** Yes.

### 11. System records all user actions with timestamps

- **Backend:** `auditService.append(actorId, actorRole, action, entityType, entityId, details)` writes to `AuditLog` (timestamp default Date.now). Used for: register, login, incident_create, incident_update, assignment_create, assignment_status_update, alert_generated. No update/delete on audit records (append-only). `GET /api/audit` with filters (resource, entityType, actorId, from, to, page, limit) returns `{ data: entries, meta }`.
- **Frontend:** `Activity.jsx` (/activity) fetches `AUDIT.list` with entityType filter and pagination; displays action, entity type, id, timestamp, actor role. Admin dashboard “Activity” panel shows recent audit entries.
- **Satisfied:** Yes.

---

## Non-Functional Requirements

### 1. Role-based access control

- **Backend:** `requireRole(...allowedRoles)` middleware on all protected routes. Auth middleware validates JWT and sets `req.user`. Routes: incidents create (REPORTER, ADMIN), list/get (all authenticated), update/validate/priority (ADMIN, RESPONDER, SUPERVISOR as needed); assignments recommend/assign (ADMIN, SUPERVISOR), my (RESPONDER), status (RESPONDER), listByIncident (ADMIN, SUPERVISOR, RESPONDER); alerts and audit (ADMIN, SUPERVISOR); dashboard and users/responders (per-role in service or ADMIN/SUPERVISOR).
- **Frontend:** `ProtectedRoute` checks `user` and `allowedRoles`; redirects to login or dashboard. Header and routes show/hide Report, Manage, Assignments, Alerts, Activity by role. Dashboard component switches to AdminDashboard, ResponderDashboard, or ReporterDashboard by role.
- **Satisfied:** Yes.

### 2. Fast dispatch recommendation design

- **Backend:** `dispatchService.getNearestAvailableResponders` uses a single query for available responders (with index on role/availability), in-memory haversine and sort, optional limit (default 10). No N+1; one incident fetch + one responder query per recommend call.
- **Satisfied:** Yes.

### 3. Near-real-time dashboard update design

- **Backend:** Dashboard API returns current counts and recent data in one call. No built-in push; clients poll.
- **Frontend:** Admin dashboard and Responder dashboard poll (e.g. every 15–20s) to refresh summary, incidents, alerts, audit, assignments. Loading and error states shown.
- **Satisfied:** Yes (polling-based near-real-time).

### 4. High-availability-oriented structure

- **Backend:** Stateless API; DB and auth are single points of dependency. Error handler returns consistent JSON errors. No in-memory session state; JWT used.
- **Frontend:** Centralized API client with token; error handling and loading states on fetches.
- **Satisfied:** Yes (stateless, consistent errors; further HA would be infra/DB replication).

### 5. Strong input validation

- **Backend:** express-validator on routes: auth (email, password length, name, role enum); incidents (title, description, category, coordinates or lat/lng, optional priority/severity/dates); assignments (MongoId, status enums); alerts (param id); audit (query params). `handleValidation` returns 400 with details on failure. Services validate status transitions (`statusTransitions.js`) and business rules (e.g. “incident already has active assignment”).
- **Frontend:** Report form uses zod + react-hook-form; required location; other forms use controlled inputs and API error messages.
- **Satisfied:** Yes.

### 6. Modular expansion support

- **Backend:** Routes per domain (auth, incidents, assignments, alerts, audit, users, dashboard); services (incident, assignment, alert, audit, dispatch, dashboard); shared middleware (auth, rbac, validate, errorHandler). New features can add routes and services without changing existing ones.
- **Frontend:** Pages by feature; shared components (layout, UI, map, incident); API endpoints and client centralized. New flows can add pages and endpoints.
- **Satisfied:** Yes.

### 7. Immutable audit logs

- **Backend:** `AuditLog` model has no update/delete in code; `auditService` only `append` and `list`. Logs are append-only with timestamp and actor/action/entity/details.
- **Satisfied:** Yes.

### 8. Data consistency

- **Backend:** Status transitions enforced in code (`validateIncidentStatusTransition`, `validateAssignmentStatusTransition`). Assignment completion updates incident status and resolvedAt; en_route/on_site set incident in_progress. Single assignment per incident enforced (no second active assignment). Audit written after successful operations.
- **Frontend:** After mutations (validate, priority, assign, assignment status), incident and assignments are refetched so UI reflects server state.
- **Satisfied:** Yes.

---

## API Route and Response Consistency

- **Auth:** `POST /api/auth/register` → `{ user }`; `POST /api/auth/login` → `{ user, token }`; `GET /api/auth/me` → `{ user }`.
- **Incidents:** List `GET /api/incidents` → `{ data: items, meta }`; get/create/update/validate/priority → `{ data: incident }`.
- **Assignments:** recommend → `{ data: responders }`; create → `{ data: assignment }`; my, listByIncident → `{ data: list }`; status → `{ data: assignment }`.
- **Alerts:** list → `{ data: items, meta }`; acknowledge → `{ data: alert }`.
- **Audit:** list → `{ data: entries, meta }`.
- **Dashboard:** `GET /api/dashboard` → `{ data: summary }` (role-specific).
- **Users:** `GET /api/users/responders` → `{ data: users }`.
- **Errors:** `{ error: string }` (and optional `details` for validation).

Frontend uses a single API base (`/api`); all endpoints use paths relative to it (e.g. `/auth/register` → `/api/auth/register`). Response payloads are used consistently (e.g. `res.data`, `res.meta`).

---

## Cleanup and Consistency Changes Made

1. **assignmentService:** Fixed assignment status check for syncing incident to in_progress: use `en_route` and `on_site` (not `in_progress`).
2. **incidentController.validate:** Pass `new Date()` for `validatedAt` instead of ISO string for consistent Date handling.
3. **Duplicate responders API:** Removed `GET /api/responders` (and `routes/responders.js`); only `GET /api/users/responders` is used (frontend already uses `USERS.responders`).
4. **Dead frontend pages removed:** `Assignments.jsx` (replaced by AssignmentPanel and ResponderDashboard), `AuditLog.jsx` (Activity page is the audit UI), `NewIncident.jsx` (ReportIncident used for /report and /incidents/new).

No AI or Cursor attribution was added anywhere in the codebase.
