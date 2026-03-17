import { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AssignResponder.css";

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

const incidents = [
  {
    id: "INC-1001",
    type: "Medical Emergency",
    location: "TRM Mall, Nairobi",
    priority: "High",
    coords: [-1.2186, 36.8856],
  },
  {
    id: "INC-1002",
    type: "Fire & Rescue",
    location: "Eastleigh, Nairobi",
    priority: "Critical",
    coords: [-1.2756, 36.8523],
  },
];

const responders = [
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
    status: "Available",
    location: "Eastleigh",
    coords: [-1.2734, 36.8571],
  },
  {
    id: "R-03",
    name: "Kevin Otieno",
    unit: "Traffic Unit 4",
    status: "Dispatched",
    location: "CBD",
    coords: [-1.2867, 36.8172],
  },
];

export default function AssignResponder() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedResponderId, setSelectedResponderId] = useState("");

  const selectedResponder = useMemo(
    () => responders.find((r) => r.id === selectedResponderId) || null,
    [selectedResponderId]
  );

  const center = [-1.2864, 36.8172]; // Nairobi

  const handleAssign = () => {
    if (!selectedIncident || !selectedResponder) return;

    alert(
      `${selectedResponder.name} assigned to ${selectedIncident.type} at ${selectedIncident.location}`
    );

    setSelectedIncident(null);
    setSelectedResponderId("");
  };

  return (
    <div className="assign-page">
      <div className="assign-header">
        <h1>Assign Responders</h1>
        <p>Select an incident and dispatch a responder.</p>
      </div>

      <div className="assign-grid">
        <section className="assign-panel">
          <h2>Unassigned Incidents</h2>

          <div className="incident-list">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`incident-card ${
                  selectedIncident?.id === incident.id ? "active" : ""
                }`}
                onClick={() => setSelectedIncident(incident)}
              >
                <h3>{incident.type}</h3>
                <p>{incident.location}</p>
                <span className={`priority ${incident.priority.toLowerCase()}`}>
                  {incident.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="assign-panel">
          <h2>Available Responders</h2>

          <div className="responder-list">
            {responders.map((responder) => (
              <div
                key={responder.id}
                className={`responder-card ${
                  selectedResponderId === responder.id ? "selected" : ""
                }`}
              >
                <div>
                  <h4>{responder.name}</h4>
                  <p>
                    {responder.unit} • {responder.location}
                  </p>
                </div>

                <span
                  className={`responder-status ${responder.status.toLowerCase()}`}
                >
                  {responder.status}
                </span>

                {responder.status === "Available" && (
                  <button
                    onClick={() => setSelectedResponderId(responder.id)}
                    className="select-btn"
                  >
                    Select
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="assign-panel map-panel">
          <h2>Responder Tracking</h2>

          <div className="real-map-wrap">
            <MapContainer
              center={center}
              zoom={12}
              scrollWheelZoom={true}
              className="real-map"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
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
                  </Popup>
                </Marker>
              ))}

              {responders.map((responder) => (
                <Marker key={responder.id} position={responder.coords}>
                  <Popup>
                    <strong>{responder.name}</strong>
                    <br />
                    {responder.unit}
                    <br />
                    Status: {responder.status}
                  </Popup>
                </Marker>
              ))}

              {selectedIncident && selectedResponder && (
                <Polyline
                  positions={[selectedResponder.coords, selectedIncident.coords]}
                />
              )}
            </MapContainer>
          </div>

          {selectedIncident && (
            <div className="selection-summary">
              <p>
                <strong>Incident:</strong> {selectedIncident.type}
              </p>
              <p>
                <strong>Location:</strong> {selectedIncident.location}
              </p>
              <p>
                <strong>Responder:</strong>{" "}
                {selectedResponder ? selectedResponder.name : "Not selected"}
              </p>
            </div>
          )}

          {selectedIncident && selectedResponder && (
            <button className="dispatch-btn" onClick={handleAssign}>
              Dispatch Responder
            </button>
          )}
        </section>
      </div>
    </div>
  );
}