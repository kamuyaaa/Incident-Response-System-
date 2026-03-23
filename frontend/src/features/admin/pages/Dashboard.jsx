import "./Dashboard.css";
import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";

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

const mockIncidents = [
  {
    id: "INC-1001",
    type: "Medical Emergency",
    location: "TRM, Thika Road",
    priority: "High",
    status: "Unassigned",
    time: "3 mins ago",
    coords: [-1.2186, 36.8856],
  },
  {
    id: "INC-1002",
    type: "Fire & Rescue",
    location: "Eastleigh, Nairobi",
    priority: "Critical",
    status: "Assigned",
    time: "8 mins ago",
    coords: [-1.2756, 36.8523],
  },
  {
    id: "INC-1003",
    type: "Road & Transport",
    location: "Muthaiga Roundabout",
    priority: "Medium",
    status: "Unassigned",
    time: "12 mins ago",
    coords: [-1.2445, 36.8348],
  },
];

const mockResponders = [
  {
    id: "R-01",
    name: "Jack Doe",
    unit: "Ambulance 2",
    status: "Available",
    location: "TRM Area",
    coords: [-1.2202, 36.8817],
  },
  {
    id: "R-02",
    name: "Mary Wanjiru",
    unit: "Fire Unit 1",
    status: "Dispatched",
    location: "Eastleigh",
    coords: [-1.2734, 36.8571],
  },
  {
    id: "R-03",
    name: "Kevin Otieno",
    unit: "Traffic Unit 4",
    status: "Available",
    location: "CBD",
    coords: [-1.2867, 36.8172],
  },
];

export default function Dashboard() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedResponder, setSelectedResponder] = useState("");

  const selectedResponderData = useMemo(
    () => mockResponders.find((responder) => responder.id === selectedResponder) || null,
    [selectedResponder]
  );

  const center = [-1.2864, 36.8172];

  const handleAssign = () => {
    if (!selectedIncident || !selectedResponder) return;

    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === selectedIncident.id
          ? {
              ...incident,
              status: "Assigned",
            }
          : incident
      )
    );

    setSelectedIncident(null);
    setSelectedResponder("");
  };

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
          <p>24</p>
        </div>

        <div className="summary-box">
          <h3>Unassigned</h3>
          <p>7</p>
        </div>

        <div className="summary-box">
          <h3>Active Dispatches</h3>
          <p>11</p>
        </div>

        <div className="summary-box">
          <h3>Resolved Today</h3>
          <p>6</p>
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
                  <span>{incident.time}</span>
                  <span className={`status-tag ${incident.status.toLowerCase()}`}>
                    {incident.status}
                  </span>
                </div>

                <button
                  className="assign-btn"
                  onClick={() => setSelectedIncident(incident)}
                  disabled={incident.status === "Assigned"}
                >
                  {incident.status === "Assigned"
                    ? "Already Assigned"
                    : "Assign Responder"}
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
            <MapContainer
              center={center}
              zoom={12}
              scrollWheelZoom={true}
              className="dashboard-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {incidents.map((incident) => (
                <Marker key={incident.id} position={incident.coords}>
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

              {mockResponders.map((responder) => (
                <Marker key={responder.id} position={responder.coords}>
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

              {selectedIncident && selectedResponderData && (
                <Polyline positions={[selectedResponderData.coords, selectedIncident.coords]} />
              )}
            </MapContainer>
          </div>

          <div className="responder-list">
            {mockResponders.map((responder) => (
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
              {mockResponders
                .filter((r) => r.status === "Available")
                .map((responder) => (
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