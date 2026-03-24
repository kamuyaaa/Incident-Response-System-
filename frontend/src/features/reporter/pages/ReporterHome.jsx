import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ReporterHome.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReporterMenu from "../components/ReporterMenu";

export default function ReporterHome() {
  const navigate = useNavigate();
  const [locationLabel, setLocationLabel] = useState("Getting your location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLabel("Location unavailable on this browser");
      return;
    }

    const updateLocation = async (lat, lng) => {
      try {
        const url = new URL("https://nominatim.openstreetmap.org/reverse");
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("lat", String(lat));
        url.searchParams.set("lon", String(lng));

        const response = await fetch(url.toString(), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Reverse geocode failed");
        }

        const data = await response.json();
        const address = data?.address;

        const area =
          address?.suburb || address?.neighbourhood || address?.city_district || address?.city || address?.town;
        const region = address?.city || address?.county || address?.state;

        if (area && region) {
          setLocationLabel(`${area}, ${region}`);
          return;
        }

        if (data?.display_name) {
          setLocationLabel(data.display_name.split(",").slice(0, 2).join(", "));
          return;
        }
      } catch {
        // Ignore geocode failures and show coordinates fallback.
      }

      setLocationLabel(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setLocationLabel("Enable location access to show current location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return (
    <PhoneFrame>
      <div className="reporter-home">
        <ReporterMenu />

        <h1 className="reporter-title">
          Need an emergency
          <br />
          service?
        </h1>

        <div className="location-card">
          <div className="location-left">
            <div className="location-icon">📍</div>
            <div className="location-text">
              <h3>Current Location</h3>
              <p>{locationLabel}</p>
            </div>
          </div>

          <button className="change-location-btn">
            Change
          </button>
        </div>

        <div
          className="report-button"
          onClick={() => navigate("/reporter/report")}
        >
          REPORT
          <br />
          INCIDENT
        </div>

        <p className="or-text">OR</p>

        <button
          className="call-btn"
          onClick={() => {
            window.location.href = "tel:999";
          }}
        >
          📞 EMERGENCY CALL
        </button>

        <div className="quick-report">
          <h2 className="quick-title">Quick Report</h2>

          <div className="quick-grid">
            <div
              className="quick-card assault"
              onClick={() => navigate("/reporter/report?type=assault")}
            >
              <div className="quick-icon">👊</div>
              <p>ASSAULT</p>
            </div>

            <div
              className="quick-card theft"
              onClick={() => navigate("/reporter/report?type=theft")}
            >
              <div className="quick-icon">👜</div>
              <p>THEFT</p>
            </div>

            <div
              className="quick-card accident"
              onClick={() => navigate("/reporter/report?type=accident")}
            >
              <div className="quick-icon">🚗</div>
              <p>ACCIDENT</p>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}