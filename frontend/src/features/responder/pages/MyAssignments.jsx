import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./MyAssignments.css";
import ResponderMenu from "../components/ResponderMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../../../shared/hooks/useAuth";
import responderService from "../services/responderService";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function buildExternalDirectionsUrl(currentLocation, incidentLocation) {
  const destination = `${incidentLocation.latitude},${incidentLocation.longitude}`;

  if (currentLocation) {
    const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${destination}`;
}

export default function MyAssignments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [navigationStatus, setNavigationStatus] = useState("Allow location access to draw directions from your device to the incident.");

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await responderService.getAssignments(user.id);
        setAssignments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadAssignments();
    }
  }, [user]);

  const assignedCount = assignments.length;
  const inProgressCount = assignments.filter(
    (incident) => incident.status === "In Progress"
  ).length;
  const completedCount = assignments.filter(
    (incident) => incident.status === "Completed"
  ).length;

  const activeIncident = useMemo(() => {
    return (
      assignments.find((incident) => incident.status === "In Progress") ||
      assignments.find((incident) => incident.status === "Assigned") ||
      assignments[0]
    );
  }, [assignments]);

 const incidentPosition = activeIncident?.latitude != null && activeIncident?.longitude != null
    ? [activeIncident.latitude, activeIncident.longitude]
    : null;
  const responderPosition = currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null;
  const mapCenter = responderPosition || incidentPosition || [-1.2864, 36.8172];

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setNavigationStatus("This browser does not support device location.");
      return;
    }

    setNavigationStatus("Requesting your current location...");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setNavigationStatus("Device location captured. Route preview is ready.");
      },
      () => {
        setNavigationStatus("Location access was denied. Please allow location access to navigate from your current position.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNavigate = () => {
    if (activeIncident?.latitude == null || activeIncident?.longitude == null) {
      setNavigationStatus("This incident does not have map coordinates yet.");
      return;
    }

    if (!currentLocation) {
      requestCurrentLocation();
      return;
    }

    window.open(
      buildExternalDirectionsUrl(currentLocation, activeIncident),
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return <PhoneFrame><div className="responder-dashboard">Loading assignments...</div></PhoneFrame>;
  }

  return (
    <PhoneFrame>
      <div className="responder-dashboard">
        <ResponderMenu />

        <div className="responder-header">
          <h2>Hi {user?.name || "Responder"},</h2>
          <p>Here’s your incident summary</p>
        </div>

        {activeIncident && (
          <div className="priority-alert">
            <div className="priority-alert-text">
              <h3>Priority Incident</h3>
              <p>{activeIncident.type} — {activeIncident.location}</p>
            </div>
            <button
              className="priority-alert-btn"
              onClick={() => navigate("/responder/updates")}
            >
              Respond
            </button>
          </div>
        )}

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-text">
              <h3>ASSIGNED INCIDENTS</h3>
              <span className="summary-number blue">{assignedCount}</span>
            </div>
            <div className="summary-icon blue-bg">📋</div>
          </div>

          <div className="summary-card">
            <div className="summary-text">
              <h3>IN PROGRESS</h3>
              <span className="summary-number orange">{inProgressCount}</span>
            </div>
            <div className="summary-icon orange-bg">🕒</div>
          </div>

          <div className="summary-card">
            <div className="summary-text">
              <h3>RESOLVED INCIDENTS</h3>
              <span className="summary-number green">{completedCount}</span>
            </div>
            <div className="summary-icon green-bg">✅</div>
          </div>
        </div>

        {activeIncident && (
          <div className="active-incident-card">
            <div className="section-top">
              <h3>Active Incident</h3>
              <span className="incident-badge">{activeIncident.priority || "Active"}</span>
            </div>

            <h4>{activeIncident.type}</h4>
            <p className="incident-meta">📍 {activeIncident.location}</p>
            <p className="incident-meta">
              ⏱ Reported {new Date(activeIncident.createdAt).toLocaleString()}
            </p>

            <div className="navigation-panel">
              <div className="navigation-panel-header">
                <strong>Responder navigation</strong>
                <button className="secondary-btn compact-btn" onClick={requestCurrentLocation}>
                  Use my location
                </button>
              </div>
              <p className="incident-meta">{navigationStatus}</p>
              {incidentPosition && (
                <div className="assignment-map-wrap">
                  <MapContainer key={mapCenter.join(",")} center={mapCenter} zoom={14} scrollWheelZoom className="assignment-map">
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={incidentPosition} />
                    {responderPosition && <Marker position={responderPosition} />}
                    {responderPosition && <Polyline positions={[responderPosition, incidentPosition]} />}
                  </MapContainer>
                </div>
              )}
            </div>

            <div className="incident-actions">
              <button onClick={() => navigate("/responder/updates")}>
                Open Incident
              </button>
              <button className="secondary-btn" onClick={handleNavigate}>Navigate</button>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h3>Quick Actions</h3>

          <div className="quick-actions-grid">
            <button onClick={() => navigate("/responder/updates")}>View Assignments</button>
            <button onClick={() => navigate("/responder/updates")}>Update Status</button>
            <button className="secondary-btn">Call Admin</button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}