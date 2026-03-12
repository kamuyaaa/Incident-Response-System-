# Emergency Response Coordination System — Frontend

React, Vite, Tailwind CSS, React Router, Framer Motion, and light React Three Fiber. Emergency-focused, mobile-first, red accent on neutral surfaces.

---

## Frontend pages

| Page | Route | Description |
|------|--------|-------------|
| **Home** | `/` | Landing with hero, CTA to login/register or dashboard. Optional R3F background. |
| **Login** | `/login` | Email/password login. |
| **Register** | `/register` | Name, email, password, role (Reporter). |
| **Dashboard** | `/dashboard` | Role-based: Reporter / Admin / Responder. Summary from `GET /api/dashboard`, recent incidents, assignments (responder), overdue alerts (admin). |
| **Report Incident** | `/report`, `/incidents/new` | Create incident: title, category, description, priority, address, location (map + geolocation), optional evidence (camera/file). |
| **Incident Detail** | `/incidents/:id` | View incident, map; reporter sees own; admin: validate, prioritize, recommend/assign responders; responder: update assignment/incident status. |
| **Incidents** | `/incidents` | List incidents (role-filtered). Link to report. |
| **Admin – Incident Management** | `/manage` | Admin/supervisor list with status/priority filters. Links to incident detail. |
| **Assignment Panel** | `/assignments` | Responder: list assignments, status filter, link to incident detail. |
| **Map** | `/map` | Map of all incidents with coordinates. |
| **Alerts** | `/alerts` | Admin/supervisor: overdue alerts, acknowledge filter, acknowledge action. |
| **Activity** | `/activity` | Admin/supervisor: audit log with entity type filter and pagination. |

---

## Reusable components

### Layout
- **Header** — Logo, nav (Dashboard, Incidents, Map; Responder: Assignments; Admin/Supervisor: Manage, Alerts, Activity), user/role, logout.
- **PageLayout** — Sticky page title, optional subtitle, optional actions slot, main content area. Framer Motion fade-in.

### UI
- **Button** — Primary, secondary, ghost, danger. Framer Motion tap.
- **Input** — Label, error, `input-field` styling.
- **Card** — Rounded container with border. Motion fade-in.
- **LoadingSpinner** / **LoadingScreen** — Spinner and full-screen loading state.
- **EmptyState** — Icon, title, description, optional action.
- **ErrorBanner** — Error message and optional dismiss.

### Incident
- **StatusBadge** — Incident/assignment status pill.
- **PriorityBadge** — Priority text style.
- **EvidenceCapture** — Camera capture and file picker for images; stores data URLs in state (evidence not sent to API unless backend supports it).

### Map
- **LocationPicker** — “Use my location”, click-to-set map, coordinates display. Used in Report Incident.
- **IncidentMap** — Leaflet map, incident markers, optional fit-bounds.

### Hero (R3F)
- **HeroScene** — Canvas with transparent background.
- **HeroBackground** — Subtle rotating sphere (emissive), used only on Home.

---

## Routes

| Path | Auth | Roles | Component |
|------|------|--------|-----------|
| `/` | no | — | Home |
| `/login` | no | — | Login |
| `/register` | no | — | Register |
| `/dashboard` | yes | any | Dashboard |
| `/report` | yes | REPORTER, ADMIN | ReportIncident |
| `/incidents/new` | yes | REPORTER, ADMIN | ReportIncident |
| `/incidents` | yes | any | Incidents |
| `/incidents/:id` | yes | any | IncidentDetail |
| `/map` | yes | any | MapView |
| `/manage` | yes | ADMIN, SUPERVISOR | IncidentManagement |
| `/assignments` | yes | RESPONDER | AssignmentPanel |
| `/alerts` | yes | ADMIN, SUPERVISOR | Alerts |
| `/activity` | yes | ADMIN, SUPERVISOR | Activity |
| `*` | — | — | Navigate to `/` |

---

## Backend endpoints used

| Method | Path | Used by |
|--------|------|---------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | AuthContext |
| GET | `/api/dashboard` | Dashboard |
| GET | `/api/incidents` | Incidents, IncidentManagement, MapView |
| GET | `/api/incidents/:id` | IncidentDetail |
| POST | `/api/incidents` | ReportIncident |
| PATCH | `/api/incidents/:id` | IncidentDetail (status update) |
| PATCH | `/api/incidents/:id/validate` | IncidentDetail (admin validate) |
| PATCH | `/api/incidents/:id/priority` | IncidentDetail (admin priority) |
| GET | `/api/assignments/recommend/:incidentId` | IncidentDetail (admin) |
| POST | `/api/assignments` | IncidentDetail (admin assign) |
| GET | `/api/assignments/my` | Dashboard, AssignmentPanel |
| PATCH | `/api/assignments/:id/status` | IncidentDetail (responder) |
| GET | `/api/assignments/incident/:incidentId` | IncidentDetail |
| GET | `/api/alerts` | Alerts |
| PATCH | `/api/alerts/:id/acknowledge` | Alerts |
| GET | `/api/audit` | Activity |

Evidence (camera/file) is captured in the Report Incident UI and kept in component state; it is not sent to the backend unless an evidence/attachment API is added later.
