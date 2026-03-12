import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { AUDIT } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingScreen } from '../components/ui/LoadingSpinner';

export function Activity() {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: 30 });
    if (entityType) params.set('entityType', entityType);
    api
      .get(`${AUDIT.list}?${params}`)
      .then((res) => {
        setEntries(res.data || []);
        setTotal(res.meta?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, entityType]);

  return (
    <PageLayout title="Activity" subtitle="System activity and audit log">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="ers-input w-auto"
          >
            <option value="">All types</option>
            <option value="User">User</option>
            <option value="Incident">Incident</option>
            <option value="Assignment">Assignment</option>
            <option value="Alert">Alert</option>
          </select>
        </div>
        {loading ? (
          <LoadingScreen message="Loading activity…" />
        ) : (
          <>
            <ul className="space-y-2">
              {entries.map((e) => (
                <motion.li
                  key={e._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4 text-sm">
                    <div className="flex flex-wrap gap-2 items-baseline">
                      <span className="text-ers-ink font-medium">{e.action}</span>
                      <span className="text-ers-inkTertiary">{e.entityType || e.resource}</span>
                      {e.entityId && (
                        <span className="text-ers-inkTertiary truncate max-w-[140px] font-mono text-xs">{String(e.entityId)}</span>
                      )}
                      <span className="text-ers-inkTertiary ml-auto text-xs">
                        {new Date(e.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {e.actorRole && (
                      <p className="text-xs text-ers-inkSecondary mt-1">Role: {e.actorRole}</p>
                    )}
                  </Card>
                </motion.li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-ers-inkTertiary text-sm">Total: {total}</span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  Previous
                </Button>
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={entries.length < 30}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
