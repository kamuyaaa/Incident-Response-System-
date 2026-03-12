# Demo Seed Data – Summary

## Counts

| Entity | Count |
|--------|--------|
| **Demo users** | 12 total (2 admin/supervisor, 3 reporters, 7 responders) |
| **Incidents** | 55 |
| **Assignments** | ~36 (for incidents in status assigned / in_progress / resolved) |
| **Alerts** | Up to 8 (overdue response-time alerts for open incidents) |
| **Audit log entries** | 65 (40 incident_created + 25 assignment_create) |

### Demo users

- **Admins:** `admin@demo.com`, `supervisor@demo.com` (password: `Admin123!` / `Supervisor123!`)
- **Reporters:** `reporter@demo.com`, `reporter2@demo.com`, `reporter3@demo.com` (password: `Reporter123!`)
- **Responders:**  
  - Ambulance: `ambulance1@demo.com`, `ambulance2@demo.com`  
  - Fire: `fire1@demo.com`, `fire2@demo.com`  
  - Police: `police1@demo.com`, `police2@demo.com`  
  - General: `responder@demo.com`  
  (password: `Responder123!`)

### Incidents

- **Categories:** Fire, Medical Emergency, Road Accident, Security Threat, Rescue Request
- **Priorities:** low, medium, high, critical
- **Statuses:** reported, validated, assigned, in_progress, resolved, cancelled (spread across incidents)
- **Locations:** Three coordinate clusters (downtown, north, south) with small random offsets
- **Timestamps:** Reported times spread over the last 48 hours and last 5 days
- **Status history:** Each incident has a timeline (reported → validated → assigned → in_progress → resolved where applicable)
- **Guest reports:** Some incidents use `guestReporter` (name/phone) instead of an authenticated reporter

### Assignments

- Created for incidents in status **assigned**, **in_progress**, or **resolved**
- Assignment statuses: pending, accepted, en_route, on_site, completed
- Responders chosen at random from the demo responder pool (ambulance, fire, police, general)

### Alerts

- **Overdue alerts** for incidents that are still open (reported/validated) and past their response threshold
- Type: `response_time_exceeded`; some acknowledged, some not

### Audit log

- **incident_created** for the first 40 incidents
- **assignment_create** for the first 25 assignments  
Timestamps match incident/assignment creation.

---

## Where seed data lives

| What | Where |
|------|--------|
| **Seed script** | `backend/scripts/seed-demo-data.js` |
| **Reset API** | `POST /api/demo/reset` (auth + ADMIN or SUPERVISOR) |
| **Reset button** | Admin Dashboard (top right) |
| **Demo user seed (legacy)** | `backend/scripts/seed-demo-users.js` (only creates 3 users; full demo uses `seed-demo-data.js`) |

---

## How to reset

### Option 1: From the app (recommended for demos)

1. Log in as **Admin** or **Supervisor** (e.g. `admin@demo.com` / `Admin123!`).
2. Open **Dashboard** (or **Manage**).
3. Click **Reset Demo Data** in the top-right.
4. Confirm. The backend wipes all incidents, assignments, alerts, and audit logs, then re-seeds. The page reloads data automatically.

### Option 2: From the command line

```bash
cd backend
node scripts/seed-demo-data.js
```

This connects to MongoDB (using `MONGODB_URI` or `MONGO_URI` from `.env`, or `mongodb://localhost:27017/ers`), **deletes all incidents, assignments, alerts, and audit logs**, creates demo users if missing, then seeds 55 incidents, assignments, alerts, and audit entries. It does **not** delete existing users so logins keep working.

### Important

- **Reset is destructive:** It removes **all** incidents, assignments, alerts, and audit logs in the database. Use only in demo/dev environments.
- After reset, **live-tracking demo state** in the browser (e.g. `localStorage` key `ers-demo-tracking`) still refers to old incident IDs. For a clean tracking demo, open an incident that has an assignment and use the tracking view; new simulation state will be created for the new IDs.
