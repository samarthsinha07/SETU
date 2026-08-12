import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { PageHeader, EmptyState } from '../components/UIComponents';
import { Shield, Search } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAuditLogs().then((res) => {
      setLogs(res.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading security audit logs...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Security & System Audit Logs"
        subtitle="Complete immutable trail of key platform actions, status modifications, and admin decisions."
      />

      {logs.length === 0 ? (
        <EmptyState icon={<Shield />} title="No Logs Tracked" message="Platform action events will be recorded here." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor User ID</th>
                <th>Action Type</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="mono body-sm">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="mono">{log.actorUserId ? `#${log.actorUserId}` : 'System'}</td>
                  <td><span className="badge badge-primary">{log.action}</span></td>
                  <td>{log.entityType}</td>
                  <td className="mono">#{log.entityId}</td>
                  <td className="body-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
