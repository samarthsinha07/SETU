import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { referralAPI, alumniAPI } from '../services/api';
import { PageHeader, StatusBadge, EmptyState } from '../components/UIComponents';
import { Link2, CheckCircle, XCircle, Clock, FileText, Send, User, X } from 'lucide-react';

export default function AlumniReferrals() {
  const { user } = useAuth();
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null); // request object for modal action
  const [newStatus, setNewStatus] = useState('ACCEPTED');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      const profRes = await alumniAPI.getProfile(user.id);
      const prof = profRes.data.data;
      setAlumniProfile(prof);
      if (prof) {
        const refRes = await referralAPI.getByAlumni(prof.id);
        setReferrals(refRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch alumni referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!actionModal) return;
    setUpdating(true);
    try {
      await referralAPI.updateStatus(actionModal.id, newStatus, feedbackNotes);
      setActionModal(null);
      setFeedbackNotes('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update referral status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading referral workspace...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Alumni Referral Hub"
        subtitle={`Review and process referral requests from students for ${alumniProfile?.companyName || 'your company'}.`}
      />

      {referrals.length === 0 ? (
        <EmptyState
          icon={<Link2 />}
          title="No Referral Requests"
          message="No students have requested referrals from you yet. Ensure your profile is active!"
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Target Opportunity</th>
                <th>Requested On</th>
                <th>Status</th>
                <th>Student Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ref.studentName}</td>
                  <td>{ref.opportunityTitle || 'General Referral'}</td>
                  <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={ref.status} /></td>
                  <td className="body-sm truncate" style={{ maxWidth: 260 }}>{ref.message}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setActionModal(ref); setNewStatus('ACCEPTED'); setFeedbackNotes(''); }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="heading-md">Update Referral Status</h2>
                <p className="body-sm">Student: {actionModal.studentName}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setActionModal(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4">
              <div className="card" style={{ padding: 12, marginBottom: 8 }}>
                <span className="caption">Student Message:</span>
                <p className="body-sm" style={{ marginTop: 4, fontStyle: 'italic' }}>"{actionModal.message}"</p>
              </div>

              <div className="form-group">
                <label className="form-label">New Status</label>
                <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="ACCEPTED">Accept Request (Will Refer)</option>
                  <option value="REFERRED">Referral Submitted to Portal</option>
                  <option value="INFO_NEEDED">More Information Needed</option>
                  <option value="DECLINED">Decline Request</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes / Advice for Student</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Add constructive feedback or instructions e.g. 'Submitted referral via internal portal with job ID #4812'..."
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3" style={{ marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActionModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Updating...' : 'Save & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
