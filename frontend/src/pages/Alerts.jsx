import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { ALERTS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingScreen } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { AlertTriangle, Bell } from 'lucide-react';

export function Alerts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unacknowledged');

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (filter === 'unacknowledged') params.set('acknowledged', 'false');
        if (filter === 'acknowledged') params.set('acknowledged', 'true');
        const res = await api.get(`${ALERTS.list}?${params}`);
        setItems(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [filter]);

  const acknowledge = async (id) => {
    try {
      await api.patch(ALERTS.acknowledge(id));
      setItems((prev) => prev.filter((a) => a._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageLayout title="Alerts" subtitle="Response time and escalation alerts">
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ers-input w-auto"
        >
          <option value="unacknowledged">Unacknowledged</option>
          <option value="acknowledged">Acknowledged</option>
        </select>
      </div>
      {loading ? (
        <LoadingScreen message="Loading alerts…" />
      ) : items.length === 0 ? (
        <EmptyState icon={Bell} title="No alerts" description={filter === 'unacknowledged' ? 'No unacknowledged overdue alerts.' : 'No acknowledged alerts.'} />
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <motion.li
              key={a._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className={`p-5 ${!a.acknowledged ? 'bg-amber-500/5 border-amber-500/20' : ''}`}
              >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-2">
                  {!a.acknowledged && (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-ers-ink">{a.message}</p>
                    <p className="text-xs text-ers-inkTertiary mt-1">
                      {new Date(a.createdAt).toLocaleString()} · {a.priority}
                    </p>
                    {a.incidentId && (
                      <Link
                        to={`/incidents/${a.incidentId._id || a.incidentId}`}
                        className="text-body-sm text-teal-600 hover:text-teal-700 mt-1 inline-block"
                      >
                        View incident
                      </Link>
                    )}
                  </div>
                </div>
                {!a.acknowledged && (
                  <Button variant="secondary" onClick={() => acknowledge(a._id)}>
                    Acknowledge
                  </Button>
                )}
              </div>
            </Card>
            </motion.li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
