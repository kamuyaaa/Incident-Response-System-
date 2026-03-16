import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { INCIDENTS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../components/incident/StatusBadge';
import { LoadingScreen } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusCircle, ClipboardList } from 'lucide-react';

export function Incidents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        const res = await api.get(`${INCIDENTS.list}?${params}`);
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
  }, [statusFilter]);

  return (
    <PageLayout
      title="Incidents"
      subtitle="All reported incidents"
      actions={
        <Link to="/report">
          <Button><PlusCircle className="w-4 h-4" /> Report incident</Button>
        </Link>
      }
    >
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All statuses</option>
          <option value="reported">Reported</option>
          <option value="validated">Validated</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {loading ? (
        <LoadingScreen message="Loading incidents…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No incidents"
          description="Your reported incidents will appear here."
          action={<Link to="/report"><Button>Report incident</Button></Link>}
        />
      ) : (
        <ul className="space-y-2">
          {items.map((inc) => (
            <Link key={inc._id} to={`/incidents/${inc._id}`}>
              <Card className="p-4 sm:p-5 hover:bg-ers-subtle/80 transition-colors">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <span className="font-medium text-white">{inc.title}</span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={inc.priority} />
                    <StatusBadge status={inc.status} />
                  </div>
                </div>
                <p className="text-sm text-ers-inkSecondary mt-1">{inc.category} · {inc.reporterId?.name || inc.guestReporter?.name || 'Guest'}</p>
              </Card>
            </Link>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
