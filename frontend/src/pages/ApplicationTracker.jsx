import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import { PageHeader, StatusBadge, EmptyState } from '../components/UIComponents';
import { Kanban, List, Briefcase, Clock, FileText, ChevronRight, X } from 'lucide-react';

const KANBAN_STAGES = [
  { id: 'APPLIED', title: 'Applied' },
  { id: 'SCREENING', title: 'Screening' },
  { id: 'OA', title: 'OA / Assessment' },
  { id: 'TECH_INTERVIEW', title: 'Tech Interview' },
  { id: 'HR_INTERVIEW', title: 'HR Round' },
  { id: 'SELECTED', title: 'Selected' },
  { id: 'REJECTED', title: 'Declined' },
];

export default function ApplicationTracker() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // kanban | list
  const [selectedApp, setSelectedApp] = useState(null); // for modal timeline

  useEffect(() => {
    if (!user?.id) return;
    const fetchApps = async () => {
      try {
        const res = await applicationAPI.getByStudent(user.id);
        setApplications(res.data.data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]);

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading your application lifecycle board...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Application Lifecycle Tracker"
        subtitle="Track status shifts, assessment schedules, and interview progress across all positions."
        actions={
          <div className="flex gap-2">
            <button
              className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban size={14} /> Kanban Board
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} /> List View
            </button>
          </div>
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="No Applications Tracked"
          message="You haven't submitted any job or internship applications yet."
        />
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="kanban-board">
          {KANBAN_STAGES.map((stage) => {
            const stageApps = applications.filter((app) => app.status === stage.id);
            return (
              <div key={stage.id} className="kanban-column">
                <div className="kanban-column-header">
                  <span className="heading-sm">{stage.title}</span>
                  <span className="badge badge-primary">{stageApps.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {stageApps.map((app) => (
                    <div key={app.id} className="kanban-card" onClick={() => setSelectedApp(app)}>
                      <h4 className="heading-sm" style={{ fontSize: '0.875rem' }}>{app.opportunityTitle}</h4>
                      <p className="body-sm" style={{ fontWeight: 600 }}>{app.companyName}</p>
                      <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                        <span className="caption">{new Date(app.appliedAt).toLocaleDateString()}</span>
                        <ChevronRight size={14} color="var(--text-muted)" />
                      </div>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <p className="body-sm text-center" style={{ padding: '20px 0', opacity: 0.4 }}>Empty</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.opportunityTitle}</td>
                  <td>{app.companyName}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedApp(app)}>
                      View Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL & TIMELINE MODAL */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <div>
                <h2 className="heading-md">{selectedApp.opportunityTitle}</h2>
                <p className="body-sm">{selectedApp.companyName}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedApp(null)}><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="body-sm">Current Status:</span>
                <StatusBadge status={selectedApp.status} />
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <h4 className="heading-sm" style={{ marginBottom: 4 }}>Cover Letter / Note</h4>
                  <p className="body-sm card" style={{ padding: 12 }}>{selectedApp.coverLetter}</p>
                </div>
              )}

              <div>
                <h4 className="heading-sm" style={{ marginBottom: 16 }}>Status History Timeline</h4>
                <div className="timeline">
                  {selectedApp.history && selectedApp.history.length > 0 ? (
                    selectedApp.history.map((h, i) => (
                      <div key={i} className="timeline-item">
                        <div className={`timeline-dot ${i === 0 ? 'active' : ''}`} />
                        <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h.status?.replace(/_/g, ' ')}</span>
                          <span className="caption">{new Date(h.changedAt).toLocaleString()}</span>
                        </div>
                        {h.notes && <p className="body-sm">{h.notes}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="timeline-item">
                      <div className="timeline-dot active" />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>APPLIED</span>
                      <p className="body-sm">Submitted on {new Date(selectedApp.appliedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end" style={{ marginTop: 12 }}>
                <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
