import { useEffect, useMemo, useState } from "react";
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

export default function AssignResponder() {
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedResponderId, setSelectedResponderId] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedResponder = useMemo(
    () => responders.find((r) => r.id === selectedResponderId) || null,
    [responders, selectedResponderId]
  );

  const center = [-1.2864, 36.8172];

  useEffect(() => {
    async function loadData() {
      try {
        const [incidentData, responderData] = await Promise.all([
          adminService.getIncidentsQueue("?status=Unassigned"),
          adminService.getResponders(),
        ]);

        setIncidents(incidentData);
        setResponders(responderData);
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
      await adminService.assignResponder(selectedIncident.id, selectedResponder.id);

      setIncidents((prev) =>
        prev.filter((incident) => incident.id !== selectedIncident.id)
      );

      alert(
        `${selectedResponder.name} assigned to ${selectedIncident.type} at ${selectedIncident.location}`
      );

      setSelectedIncident(null);
      setSelectedResponderId("");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="assign-page">Loading assignment data...</div>;
  }

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

                <button
                  onClick={() => setSelectedResponderId(responder.id)}
                  className="select-btn"
                >
                  Select
                </button>
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
                    Status: {responder.status}
                  </Popup>
                </Marker>
              ))}

              {selectedIncident && selectedResponder && (selectedIncident.coords || (selectedIncident.latitude != null && selectedIncident.longitude != null)) && selectedResponder.coords && (
                <Polyline positions={[selectedResponder.coords, selectedIncident.coords || [selectedIncident.latitude, selectedIncident.longitude]]} />
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