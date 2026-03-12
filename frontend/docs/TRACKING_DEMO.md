# Live tracking demo – implementation summary

## How the simulation works

- **Storage**: Simulation state is stored in `localStorage` under the key `ers-demo-tracking`, keyed by incident ID. Each entry holds responder position, stage, timeline, responder type, and related ids.
- **Creation**: When an incident has a location and at least one assignment, `getOrCreateSimulation(incidentId, incident, assignment)` runs. If no simulation exists, it creates one with the responder at a random point **about 1.8–2.4 km** from the incident. Responder type is derived from incident category (Fire → fire truck, Medical/Accident → ambulance, Crime → police).
- **Advancement**: **Once per page load**, `advanceSimulation(incidentId, onStageChange)` is called. It:
  1. Moves the responder toward the incident by a **fixed step** of `STEP_DEGREES` (0.012°, ~1.3 km).
  2. Updates stage by distance and time:
     - **assigned** → **en_route** on first move
     - **en_route** → **near_scene** when distance ≤ 0.3 km
     - **en_route** / **near_scene** → **on_site** when distance ≤ 0.05 km (responder snaps to incident)
     - **on_site** → **resolving** after 2 ticks at on_site
     - **resolving** → **resolved** on the next tick
  3. Appends to the timeline and persists to `localStorage`.
  4. Calls `onStageChange(incidentId, newStage)` when the stage changes; the app uses this to sync backend assignment/incident status (`en_route`, `on_site`, `completed`/`resolved`).
- **Stability**: When stage is **resolved**, no further movement or stage changes occur; the simulation is read-only.

## Refresh-based movement calculation

- **One advance per load**: Each time the incident detail (or any page that mounts the tracking logic) loads, the responder is moved **once** toward the incident by `STEP_DEGREES` in lat/lng.
- **Step size**: `STEP_DEGREES = 0.012` approximates ~1.3 km per step (using ~111 km per degree latitude and a rough longitude factor).
- **ETA**: `getTrackingDisplay()` estimates remaining “steps” as `distanceKm / (STEP_DEGREES * 111 * 0.7)` and converts to minutes using `SECONDS_PER_STEP = 45` (seconds per step).
- **Progress**: Progress 0–100 is derived from remaining distance assuming an initial distance of ~2 km: `progress = (2 - distanceKm) / 2 * 100`, clamped.

## Files added

| Path | Purpose |
|------|--------|
| `frontend/src/services/trackingSimulation.js` | Simulation logic: create, advance, persist, get display (distance, ETA, progress, timeline). |
| `frontend/src/components/tracking/TrackingMap.jsx` | Map with incident marker, responder marker, polyline between them, ETA/distance/stage overlay, fit bounds. |
| `frontend/src/components/tracking/TrackingCard.jsx` | Tracking card: responder type, status chip, live indicator, progress bar, distance/ETA, timeline. |
| `frontend/docs/TRACKING_DEMO.md` | This summary. |

## Files changed

| Path | Change |
|------|--------|
| `frontend/src/pages/IncidentDetail.jsx` | Import tracking service and components; after loading incident and assignments, run getOrCreateSimulation and advanceSimulation once per incident per load; sync backend on stage change (en_route, on_site, resolved); render TrackingCard and TrackingMap when simulation exists, otherwise IncidentMap. |

## Pages that support tracking

- **Reporter**: Incident detail (when the incident has an assignment and simulation exists).
- **Admin**: Incident detail / dashboard (same incident detail page with tracking when simulation exists).
- **Responder**: Incident detail (responder sees the same tracking UI for their assigned incident).

All use the same `IncidentDetail` page; no separate tracking route was added.
