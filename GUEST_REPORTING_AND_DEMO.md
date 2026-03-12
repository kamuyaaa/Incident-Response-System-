# Guest Reporting and Demo Credentials – Implementation Summary

## Updated routes

### Public (no authentication)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/incidents/report` | Guest report: submit emergency with type, description, severity, coordinates, optional guestReporter (name, phone), optional media URLs. Rate limited (20 requests per 15 min per IP). |
| POST | `/api/incidents/report/upload` | Upload one image for guest report. Max 5MB, JPEG/PNG/GIF/WebP. Returns `{ data: { url: "/uploads/..." } }`. Same rate limit as report. |

### Unchanged

- All other incident routes remain as before (`POST /api/incidents` for authenticated reporters, etc.).
- Static uploads served at `GET /uploads/:filename` from the backend.

---

## Schema changes

### Incident model (`backend/src/models/Incident.js`)

- **reporterId**: `required: false` (was `true`). Incidents can be created without an authenticated reporter.
- **guestReporter**: new sub-document  
  - `name`: String (optional)  
  - `phone`: String (optional)  
  At least one of `reporterId` or `guestReporter` must be present (enforced in pre-validate). `guestReporter` can be `{}` for anonymous guests.
- **media**: new array of `{ url: String, type: String }` (optional). Used for image URLs (e.g. from the upload endpoint).

Coordinates are unchanged: stored as GeoJSON `Point` with `coordinates: [longitude, latitude]`. The guest report API accepts `coordinates: { latitude, longitude }` or top-level `latitude`/`longitude`.

---

## Frontend changes

### New page

- **GuestReport** (`/report/guest`): public emergency report form.
  - Location: `LocationPicker` with auto geolocation and manual map selection.
  - Required: type (dropdown), description (textarea).
  - Optional: severity, guest name, guest phone, up to 5 images (upload via `/api/incidents/report/upload`, then attached to the report).
  - Submit to `POST /api/incidents/report`. On success, shows reference ID and links to “Log in to track” and “Back to home”.

### Home page

- Primary CTA for unauthenticated users: **Report Emergency** (links to `/report/guest`).
- Secondary: **Log in**, **Register**.
- Short line: “Report as guest (no account) or log in to track incidents.”

### Login page

- **Demo accounts** block: three clickable cards (Admin, Responder, Reporter) that fill email and password. Copy button for email.
- **Continue as guest** button below the block, linking to `/report/guest`, with short explanation.

### Incident detail

- Subtitle and timeline “Reported by” support both authenticated reporter and guest: `reporterId?.name` or `guestReporter?.name` or `guestReporter?.phone` (shown as “Guest (phone)” when only phone is set).

### API / config

- **Endpoints**: `INCIDENTS.report = '/incidents/report'`, `INCIDENTS.reportUpload = '/incidents/report/upload'`.
- Guest report and upload use the existing `api.post` and `apiUpload`; no token is sent when the user is not logged in.

---

## Seed users (demo credentials)

Seed script: `backend/scripts/seed-demo-users.js`. Run with:

```bash
cd backend && npm run seed:demo
```

Creates users only if they do not exist (by email). Passwords are hashed with bcrypt (10 rounds).

| Role      | Email               | Password      |
|-----------|---------------------|---------------|
| Admin     | admin@demo.com      | Admin123!     |
| Responder | responder@demo.com  | Responder123! |
| Reporter  | reporter@demo.com   | Reporter123!  |

---

## How guest reporting works

1. **Entry**: User goes to Home or Login and chooses **Report Emergency** or **Continue as guest** → `/report/guest`.
2. **Form**: User sets location (geolocation or map), type, description, optional severity, optional name/phone, optional images (uploaded first, then sent as URLs in the report).
3. **Submit**: Frontend sends `POST /api/incidents/report` with JSON (no auth). Backend:
   - Rate limits (20 per 15 min per IP).
   - Validates and sanitizes input.
   - Builds incident with `guestReporter` (or `{}`), no `reporterId`, and optional `media`.
   - Appends audit entry: `action: "incident_created"`, `actorId: null`, `actorRole: "guest"`, incident id and timestamp.
   - Runs response-time alert check.
4. **Response**: Returns `201` and the created incident (including `_id`). Frontend shows the reference ID and suggests logging in to track.
5. **Images**: Optional. User selects file → `POST /api/incidents/report/upload` (multipart, field `file`) → backend checks type and size (≤5MB), saves under `backend/uploads`, returns `{ url: "/uploads/..." }`. Frontend adds that URL to `media` and sends it in the report payload.

---

## Security

- **Validation**: express-validator on `/report`: type/category, description length, severity enum, coordinates, guestReporter and media structure and lengths.
- **Sanitization**: `utils/sanitize.js` trims and length-limits strings, strips control characters. Applied to guest report body before create.
- **Rate limiting**: `express-rate-limit` on both `/report` and `/report/upload`: 20 requests per 15 minutes per IP; 429 with message when exceeded.
- **Image upload**: Multer with 5MB limit; file filter allows only image MIME types (JPEG, PNG, GIF, WebP). Error response for oversized or invalid type.

---

## Audit logging

- Every incident create (authenticated or guest) produces an audit log entry:
  - **action**: `"incident_created"`
  - **entityType**: `"Incident"`
  - **entityId**: incident id
  - **timestamp**: set by the server
  - **actor**: for guests, `actorId: null`, `actorRole: "guest"`; for authenticated users, `actorId: user id`, `actorRole: user role` (e.g. `"REPORTER"`).
- Details payload includes title, category, and for guests optionally `guestReporter`.

---

## Files touched

**Backend**

- `src/models/Incident.js` – optional `reporterId`, `guestReporter`, `media`; pre-validate “reporter or guest”.
- `src/services/incidentService.js` – `parseCoordinates` (supports object lat/lng), `createGuestReport`, audit `incident_created`.
- `src/controllers/incidentController.js` – `guestReport`, `guestReportUpload`.
- `src/routes/incidents.js` – guest validation, rate limit, sanitize middleware; `POST /report`, `POST /report/upload`.
- `src/utils/sanitize.js` – new; `sanitizeGuestReport`.
- `src/middleware/upload.js` – new; multer 5MB, image-only, disk storage under `uploads/`.
- `src/app.js` – serve static `uploads/`, `path` require.
- `scripts/seed-demo-users.js` – new; bcrypt demo users.
- `package.json` – `express-rate-limit`, `multer`; script `seed:demo`.

**Frontend**

- `src/api/endpoints.js` – `INCIDENTS.report`, `INCIDENTS.reportUpload`.
- `src/pages/GuestReport.jsx` – new guest report form and success view.
- `src/pages/Home.jsx` – Report Emergency CTA, guest hint.
- `src/pages/Login.jsx` – demo accounts block, Continue as guest.
- `src/pages/IncidentDetail.jsx` – subtitle and timeline “by” for guestReporter.
- `src/App.jsx` – route ` /report/guest` → `GuestReport` (public).

**Other**

- `.gitignore` – `backend/uploads`.
