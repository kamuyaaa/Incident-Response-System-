import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";
import adminService from "../services/adminService";

// Fix default Leaflet marker icons in Vite/React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedResponder, setSelectedResponder] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedResponderData = useMemo(
    () => responders.find((responder) => responder.id === selectedResponder) || null,
    [responders, selectedResponder]
  );

  const center = [-1.2864, 36.8172];

  useEffect(() => {
    async function loadData() {
      try {
        const [incidentsData, respondersData] = await Promise.all([
          adminService.getIncidentsQueue(),
          adminService.getResponders(),
        ]);

        setIncidents(incidentsData);
        setResponders(respondersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAssign = async () => {
    if (!selectedIncident || !selectedResponder) return;

    try {
      const response = await adminService.assignResponder(
        selectedIncident.id,
        selectedResponder
      );

      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === selectedIncident.id ? response.incident : incident
        )
      );

      setSelectedIncident(null);
      setSelectedResponder("");
    } catch (error) {
      alert(error.message);
    }
  };

  const unassignedCount = incidents.filter((i) => i.status === "Unassigned").length;
  const assignedCount = incidents.filter((i) => i.status === "Assigned").length;
  const completedCount = incidents.filter((i) => i.status === "Completed").length;

  if (loading) {
    return <div className="admin-dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Control Center</h1>
          <p>Monitor incidents, assign responders, and track dispatches.</p>
        </div>
      </div>

      <div className="admin-summary-grid">
        <div className="summary-box">
          <h3>Total Incidents</h3>
          <p>{incidents.length}</p>
        </div>

        <div className="summary-box">
          <h3>Unassigned</h3>
          <p>{unassignedCount}</p>
        </div>

        <div className="summary-box">
          <h3>Active Dispatches</h3>
          <p>{assignedCount}</p>
        </div>

        <div className="summary-box">
          <h3>Resolved</h3>
          <p>{completedCount}</p>
        </div>
      </div>

      <div className="admin-main-grid">
        <section className="panel incidents-panel">
          <div className="panel-header">
            <h2>Incoming Incidents</h2>
          </div>

          <div className="incident-list">
            {incidents.map((incident) => (
              <div key={incident.id} className="incident-card">
                <div className="incident-top">
                  <div>
                    <h3>{incident.type}</h3>
                    <p>{incident.location}</p>
                  </div>

                  <span className={`priority-badge ${incident.priority.toLowerCase()}`}>
                    {incident.priority}
                  </span>
                </div>

                <div className="incident-meta">
                  <span>{incident.id}</span>
                  <span>{new Date(incident.createdAt).toLocaleString()}</span>
                  <span className={`status-tag ${incident.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {incident.status}
                  </span>
                </div>

                <button
                  className="assign-btn"
                  onClick={() => setSelectedIncident(incident)}
                  disabled={incident.status === "Assigned"}
                >
                  {incident.status === "Assigned" ? "Already Assigned" : "Assign Responder"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel responders-panel">
          <div className="panel-header">
            <h2>Responder Tracking</h2>
          </div>

          <div className="dashboard-map-wrap">
            <MapContainer center={center} zoom={12} scrollWheelZoom className="dashboard-map">
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {incidents.map((incident, index) => (
                <Marker
                  key={incident.id}
                  position={incident.coords || (incident.latitude != null && incident.longitude != null ? [incident.latitude, incident.longitude] : [center[0] + index * 0.01, center[1] + index * 0.01])}
                >
                  <Popup>
                    <strong>{incident.type}</strong>
                    <br />
                    {incident.location}
                    <br />
                    Priority: {incident.priority}
                    <br />
                    Status: {incident.status}
                  </Popup>
                </Marker>
              ))}

              {responders.map((responder, index) => (
                <Marker
                  key={responder.id}
                  position={responder.coords || [center[0] - index * 0.01, center[1] - index * 0.01]}
                >
                  <Popup>
                    <strong>{responder.name}</strong>
                    <br />
                    {responder.unit}
                    <br />
                    {responder.location}
                    <br />
                    Status: {responder.status}
                  </Popup>
                </Marker>
              ))}

              {selectedIncident && selectedResponderData && (selectedIncident.coords || (selectedIncident.latitude != null && selectedIncident.longitude != null)) && selectedResponderData.coords && (
                <Polyline positions={[selectedResponderData.coords, selectedIncident.coords || [selectedIncident.latitude, selectedIncident.longitude]]} />
              )}
            </MapContainer>
          </div>

          <div className="responder-list">
            {responders.map((responder) => (
              <div key={responder.id} className="responder-row">
                <div>
                  <h4>{responder.name}</h4>
                  <p>
                    {responder.unit} • {responder.location}
                  </p>
                </div>

                <span className={`responder-status ${responder.status.toLowerCase()}`}>
                  {responder.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedIncident && (
        <div className="assign-modal-overlay">
          <div className="assign-modal">
            <h3>Assign Responder</h3>
            <p>
              <strong>{selectedIncident.type}</strong>
            </p>
            <p>{selectedIncident.location}</p>

            <select
              value={selectedResponder}
              onChange={(e) => setSelectedResponder(e.target.value)}
            >
              <option value="">Select responder</option>
              {responders.map((responder) => (
                <option key={responder.id} value={responder.id}>
                  {responder.name} - {responder.unit}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="confirm-assign-btn" onClick={handleAssign}>
                Confirm Assignment
              </button>

              <button
                className="cancel-assign-btn"
                onClick={() => {
                  setSelectedIncident(null);
                  setSelectedResponder("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}