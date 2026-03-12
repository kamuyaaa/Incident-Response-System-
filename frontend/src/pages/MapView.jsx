import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { INCIDENTS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { IncidentMap } from '../components/map/IncidentMap';
import { LoadingScreen } from '../components/ui/LoadingSpinner';

export function MapView() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`${INCIDENTS.list}?limit=100`);
        setIncidents(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const withCoords = (incidents || []).filter(
    (i) => i.location?.coordinates?.length === 2
  );
  const defaultCenter = withCoords[0]
    ? { lat: withCoords[0].location.coordinates[1], lng: withCoords[0].location.coordinates[0] }
    : { lat: 0, lng: 0 };

  return (
    <PageLayout title="Map" subtitle="Incident locations">
      {loading ? (
        <LoadingScreen message="Loading map…" />
      ) : (
        <IncidentMap
          incidents={withCoords}
          center={defaultCenter}
          zoom={withCoords.length ? 10 : 2}
          height="min(calc(100vh - 12rem), 480px)"
          showFit={withCoords.length > 0}
          showLegend={withCoords.length > 0}
          colorByType
        />
      )}
    </PageLayout>
  );
}
