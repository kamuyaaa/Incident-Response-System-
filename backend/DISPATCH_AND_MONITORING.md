# Dispatch Intelligence and Incident Monitoring

Summary of extensions for nearest-unit recommendation, overdue alerts, immutable audit logging, and validation.

---

## 1. Nearest available unit recommendation

### Logic
- **Dispatch service** (`src/services/dispatchService.js`):
  - **getBusyResponderIds()**: Returns responder IDs currently on an assignment (pending, accepted, en_route, on_site).
  - **getNearestAvailableResponders(incidentLocation, options)**:
    - Filters: role=RESPONDER, isAvailable=true, not in busy list, has valid coordinates.
    - Optional: **serviceType** (e.g. fire, medical, police, hazard, rescue, general). Matches responders with that serviceType or `general`.
    - Optional: **capabilities** (array of strings). Matches responders whose `capabilities` array contains any of the given values.
    - Distance: **Haversine formula** (km). Results sorted by distance and **ranked** (rank 1, 2, …).
    - Returns: list of responders with `distanceKm`, `rank`, `coordinates: { latitude, longitude }`, `serviceType`, `capabilities`.
  - **VALID_SERVICE_TYPES**: `['general', 'fire', 'medical', 'police', 'hazard', 'rescue']` for validation and future multi-service expansion.

### Responder model (User)
- **serviceType**: string, default `'general'`.
- **capabilities**: array of strings (e.g. `['hazmat', 'rope']`).
- **isAvailable**: boolean.
- **location**: GeoJSON Point (coordinates).

### API
- `GET /api/assignments/recommend/:incidentId?limit=10&serviceType=fire&capabilities=first_aid`
  - Validated: `limit` 1–50, `serviceType` in VALID_SERVICE_TYPES.

---

## 2. Automatic overdue incident alerts

### Thresholds
- **Per incident**: `responseThresholdMinutes` or `responseDeadline` (elapsed time from reportedAt to deadline).
- **Fallback**: **ResponseTimeRule** by incident priority (e.g. critical 15 min, high 30 min).

### Logic (`src/services/alertService.js`)
- **getThresholdMinutes(incident)**: Uses incident’s responseThresholdMinutes or computes minutes from responseDeadline.
- **getThresholdFromRule(priority)**: Reads ResponseTimeRule for that priority.
- **isOverdue(incident)**: Resolved/cancelled → false; else elapsed vs threshold (incident first, then rule).
- **createOverdueAlertIfNeeded(incident)**: If open and overdue and no existing overdue alert for that incident → create Alert + **audit log** (action `alert_generated`, entityType Alert).
- **checkResponseTime(incident)**: Wrapper around createOverdueAlertIfNeeded (used after incident create/update).
- **runOverdueCheck()**: Finds all non-resolved, non-cancelled incidents and runs createOverdueAlertIfNeeded for each. **Reusable** entry point for batch checks.

### Scheduler (`src/services/scheduler.js`)
- **startOverdueAlertScheduler()**: Runs **runOverdueCheck()** every **60 seconds** (configurable via OVERDUE_CHECK_INTERVAL_MS).
- Started in **server.js** after DB connect.
- Alerts are visible to admin/supervisor via existing `GET /api/alerts` and dashboard.

---

## 3. Immutable audit logging

### Schema (`src/models/AuditLog.js`)
- **Append-only**: No update/delete in service; only **append** and **list**.
- Fields: **timestamp**, **actorId**, **actorRole**, **action**, **entityType**, **entityId**, **details** (plus legacy resource/resourceId/payload for compatibility).
- Indexes: timestamp, resource+resourceId, entityType+entityId.

### Service (`src/services/auditService.js`)
- **append(actorId, actorRole, action, entityType, entityId, details)**:
  - Writes one new document with timestamp, actor, action, entity type, entity id, details.
  - Sets resource=entityType, resourceId=entityId, payload=details for backward compatibility.

### Logged actions
- **incident_create**, **incident_update** (includes validate/prioritize/status changes).
- **assignment_create**, **assignment_status_update**.
- **alert_generated** (system; actorId/actorRole null).
- **register**, **login** (User).

---

## 4. Input validation and status transitions

### Status transitions (`src/utils/statusTransitions.js`)
- **Incident**: reported → validated | cancelled; validated → assigned | cancelled; assigned → in_progress | cancelled; in_progress → resolved | cancelled; resolved/cancelled → no transition.
- **Assignment**: pending → accepted | declined; accepted → en_route | declined; en_route → on_site; on_site → completed; completed/declined → no transition.

### Enforcement
- **incidentService.update()**: Calls **validateIncidentStatusTransition(from, to)** before applying status change; throws 400 if invalid.
- **assignmentService.updateStatus()**: Calls **validateAssignmentStatusTransition(from, to)** before applying; throws 400 if invalid.

### Route validation
- **Recommend**: param `incidentId` (MongoId), query `limit` (1–50), `serviceType` (VALID_SERVICE_TYPES), `capabilities` (optional).
- Existing validators on incident create/update, assignment create/status, auth, etc., unchanged; strong validation on all relevant inputs.

---

## Files changed

| File | Change |
|------|--------|
| `src/models/User.js` | Added serviceType, capabilities; index role+isAvailable+serviceType. |
| `src/models/AuditLog.js` | Added entityType, entityId, details; index entityType+entityId. |
| `src/services/dispatchService.js` | Rewritten: options (limit, serviceType, capabilities), Haversine, ranked list, getBusyResponderIds, VALID_SERVICE_TYPES. |
| `src/services/alertService.js` | Refactored: getThresholdMinutes, getThresholdFromRule, isOverdue, createOverdueAlertIfNeeded, runOverdueCheck; audit on alert create. |
| `src/services/auditService.js` | append() now takes (actorId, actorRole, action, entityType, entityId, details); list filters entityType/entityId. |
| `src/services/scheduler.js` | **New**: startOverdueAlertScheduler, stopOverdueAlertScheduler, 60s interval. |
| `src/services/incidentService.js` | validateIncidentStatusTransition() before status update. |
| `src/services/assignmentService.js` | validateAssignmentStatusTransition() before status update. |
| `src/utils/statusTransitions.js` | **New**: INCIDENT_TRANSITIONS, ASSIGNMENT_TRANSITIONS, validate* functions. |
| `src/controllers/assignmentController.js` | recommend: pass options (limit, serviceType, capabilities). |
| `src/controllers/usersController.js` | listResponders: select serviceType, capabilities. |
| `src/controllers/auditController.js` | list: filters entityType, entityId. |
| `src/routes/assignments.js` | recommend: query validation limit, serviceType. |
| `server.js` | startOverdueAlertScheduler() after connectDB. |

---

## Assumptions

- **Responders** are Users with role RESPONDER; availability and location are maintained elsewhere (e.g. mobile app or admin UI). Default serviceType `general` so existing responders keep working.
- **ResponseTimeRule** collection is seeded (e.g. via `scripts/seed-response-rules.js`); otherwise only incident-level responseThresholdMinutes/responseDeadline apply.
- **Overdue check** runs every 60s; no distributed lock—single-instance deployment assumed. For multiple instances, consider a single worker or external cron calling an internal endpoint.
- **Audit** logs are never updated or deleted; retention/archiving can be added separately.
- **Status transitions** are strict; no “reopen” from resolved/cancelled in this implementation (can be extended in statusTransitions.js).
- **Geographic distance** is Haversine; sufficient for “nearest” ranking. No routing or drive-time used.
