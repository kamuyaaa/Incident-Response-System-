import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ReportDetails.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import ReporterMenu from "../components/ReporterMenu";
import { useAuth } from "../../../shared/hooks/useAuth";
import reporterService from "../services/reporterService";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [-1.2864, 36.8172];

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onSelect(lat, lng);
    },
  });

  return null;
}

function MapAutoCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);

  return null;
}

function formatCoordinates(lat, lng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export default function ReportDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const [form, setForm] = useState({
    description: "",
    casualties: "",
    location: "",
    latitude: DEFAULT_CENTER[0],
    longitude: DEFAULT_CENTER[1],
  });

  const type = searchParams.get("type") || "general";

  const selectedPosition = useMemo(
    () => [form.latitude, form.longitude],
    [form.latitude, form.longitude]
  );

  const setCurrentLocationDetails = useCallback(async (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: `Current location (${formatCoordinates(lat, lng)})`,
    }));
    setSelectedSuggestion({
      display_name: `Current location (${formatCoordinates(lat, lng)})`,
      lat,
      lon: lng,
    });
    setLocationError("");
    setLocationSuggestions([]);

    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "json");
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lng);
      url.searchParams.set("zoom", "18");
      url.searchParams.set("addressdetails", "1");

      const response = await fetch(url.toString(), {
        headers: {
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to reverse geocode current location");
      }

      const data = await response.json();
      const displayName =
        data?.display_name || `Current location (${formatCoordinates(lat, lng)})`;

      setForm((prev) => ({
        ...prev,
        location: displayName,
      }));
      setSelectedSuggestion({ display_name: displayName, lat, lon: lng });

      const countryCode = data?.address?.country_code?.toLowerCase();
      if (countryCode === "ke") {
        setLocationStatus("Current location loaded and validated in Kenya.");
      } else {
        setLocationStatus("Current location loaded from your device.");
      }
    } catch {
      setLocationStatus(
        "Current location loaded from your device. You can refine it by searching."
      );
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Live location is unavailable in this browser. Search and pick a Kenya location."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        
       setCurrentLocationDetails(coords.latitude, coords.longitude);
      },
      () => {
        setLocationStatus(
          "Location permission not granted. Search and pick a Kenya location manually."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
   }, [setCurrentLocationDetails]);

  useEffect(() => {
    const query = form.location.trim();

    if (query.length < 3 || selectedSuggestion?.display_name === query) {
      setLocationSuggestions([]);
      setLoadingLocations(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoadingLocations(true);
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "5");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("countrycodes", "ke");
        url.searchParams.set("q", query);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: {
            "Accept-Language": "en",
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load location suggestions");
        }

        const data = await response.json();
        const suggestions = Array.isArray(data) ? data : [];
        setLocationSuggestions(suggestions);

        if (suggestions.length > 0) {
          handleLocationSelect(suggestions[0], {
            statusMessage: "Top search result pinned automatically. Adjust by tapping another suggestion or map point.",
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setLocationSuggestions([]);
        }
      } finally {
        setLoadingLocations(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [form.location, selectedSuggestion]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "location") {
      setLocationError("");
      setSelectedSuggestion(null);
    }
  };

  const handleMapSelect = async (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "json");
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lng);
      url.searchParams.set("zoom", "18");
      url.searchParams.set("addressdetails", "1");

      const response = await fetch(url.toString(), {
        headers: {
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = await response.json();
      const countryCode = data?.address?.country_code?.toLowerCase();

      if (countryCode !== "ke") {
        setLocationError("Please pick a location inside Kenya.");
        setLocationStatus("Pinned point is outside Kenya. Please pick a Kenya location.");
        setSelectedSuggestion(null);
        return;
      }

      const displayName = data?.display_name || `Pinned map location (${formatCoordinates(lat, lng)})`;

      setForm((prev) => ({
        ...prev,
        location: displayName,
      }));
      setSelectedSuggestion({ display_name: displayName, lat, lon: lng });
      setLocationError("");
      setLocationSuggestions([]);
      setLocationStatus("Location pinned and validated in Kenya.");
    } catch {
      setForm((prev) => ({
        ...prev,
        location: `Pinned map location (${formatCoordinates(lat, lng)})`,
      }));
      setSelectedSuggestion(null);
      setLocationError("Could not validate map pin. Please search and select a Kenya location from suggestions.");
      setLocationStatus("Map pin dropped. Please select a Kenya suggestion to confirm location.");
    }
  };

  const handleLocationSelect = (suggestion, options = {}) => {
    const { statusMessage = "Kenya location selected and pinned on map." } = options;
    const lat = Number(suggestion.lat);
    const lng = Number(suggestion.lon);

    setForm((prev) => ({
      ...prev,
      location: suggestion.display_name,
      latitude: lat,
      longitude: lng,
    }));
    setSelectedSuggestion(suggestion);
    setLocationSuggestions([]);
    setLocationError("");
    setLocationStatus("Kenya location selected and pinned on map.");
    setLocationStatus(statusMessage);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      await reporterService.createIncident({
        reporterId: user?.id ?? "guest",
        type,
        description: form.description,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
      });

      setShowConfirm(false);
      alert("Report submitted successfully");
      navigate("/reporter/my-reports");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="report-details-page">
        <ReporterMenu />

        <div className="report-details-card">
          <div className="report-details-header">
            <h1>Send Report</h1>
            <button
              className="close-btn"
              onClick={() => navigate("/reporter/report")}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="report-type-tag">
            Type: <span>{type}</span>
          </p>

          <form
            className="report-details-form"
            onSubmit={(e) => {
              e.preventDefault();

              if (!selectedSuggestion) {
                setLocationError("Please choose a valid Kenya location from search suggestions or map pin.");
                return;
              }

              setShowConfirm(true);
            }}
          >
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe what happened..."
              rows="5"
              value={form.description}
              onChange={handleChange}
              required
            />

            <label>Any casualties? If yes, how many?</label>
            <input
              name="casualties"
              type="text"
              placeholder="Yes, 1 person"
              value={form.casualties}
              onChange={handleChange}
            />

            <div className="location-section">
              <div className="location-section-header">
                <label htmlFor="location">Location</label>
              </div>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Search location in Kenya"
                value={form.location}
                onChange={handleChange}
                required
                autoComplete="off"
              />

              {loadingLocations && (
                <p className="location-search-state">Searching Kenya locations...</p>
              )}

              {!loadingLocations &&
                form.location.trim().length >= 3 &&
                locationSuggestions.length > 0 && (
                  <ul className="location-suggestions">
                    {locationSuggestions.map((suggestion) => (
                      <li key={suggestion.place_id}>
                        <button
                          type="button"
                          className="location-suggestion-btn"
                          onClick={() => handleLocationSelect(suggestion)}
                        >
                          {suggestion.display_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

              <p className="location-help-text">
                {locationStatus ||
                  "Search and select a Kenya location, or tap the map to pin and validate it."}
              </p>

              <div className="report-location-map-wrap">
                <MapContainer
                  center={selectedPosition}
                  zoom={15}
                  scrollWheelZoom
                  className="report-location-map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={selectedPosition} />
                  <MapAutoCenter position={selectedPosition} />
                  <MapClickHandler onSelect={handleMapSelect} />
                </MapContainer>
              </div>

              <p className="coordinates-text">
                Selected coordinates: {formatCoordinates(form.latitude, form.longitude)}
              </p>
            </div>

            {locationError && <p className="location-error">{locationError}</p>}

            <label>
              Upload Pictures / Videos <span>(optional)</span>
            </label>
            <div className="upload-box">
              <input type="file" accept="image/*,video/*" />
            </div>

            <button type="submit" className="submit-report-btn">
              SUBMIT REPORT
            </button>
          </form>
        </div>

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <div className="confirm-icon">!</div>

              <p className="confirm-text">
                Are you sure you want to
                <br />
                submit this report?
              </p>

              <button
                className="confirm-yes-btn"
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? "SUBMITTING..." : "YES"}
              </button>

              <button
                className="confirm-cancel-btn"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
