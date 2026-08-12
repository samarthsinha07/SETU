import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alumniAPI, referralAPI, opportunityAPI } from '../services/api';
import { PageHeader, StatusBadge, EmptyState } from '../components/UIComponents';
import { Users, Search, Building, Briefcase, Send, CheckCircle, X, Link2 } from 'lucide-react';

export default function ReferralMarketplace() {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [companyFilter, setCompanyFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // browse | my_requests
  const [requestModalAlumni, setRequestModalAlumni] = useState(null);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [referralMessage, setReferralMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const [alumRes, refRes, oppRes] = await Promise.all([
        alumniAPI.getDirectory(companyFilter || undefined),
        referralAPI.getByStudent(user.id),
        opportunityAPI.getAll({ status: 'PUBLISHED' }),
      ]);
      setAlumniList(alumRes.data.data);
      setMyReferrals(refRes.data.data);
      setOpportunities(oppRes.data.data);
    } catch (err) {
      console.error('Failed to load referral marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAlumni();
  }, [user, companyFilter]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestModalAlumni) return;
    setSending(true);
    setSuccessMsg('');
    try {
      await referralAPI.create(
        user.id,
        requestModalAlumni.userId,
        selectedOppId ? parseInt(selectedOppId) : null,
        referralMessage
      );
      setSuccessMsg('Referral request sent successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setRequestModalAlumni(null);
        setReferralMessage('');
        fetchAlumni();
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send referral request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Alumni Referral Marketplace"
        subtitle="Connect directly with verified alumni at target companies for job referrals."
      />

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>
          <Users size={16} style={{ display: 'inline', marginRight: 6 }} /> Alumni Directory
        </button>
        <button className={`tab ${activeTab === 'my_requests' ? 'active' : ''}`} onClick={() => setActiveTab('my_requests')}>
          <Link2 size={16} style={{ display: 'inline', marginRight: 6 }} /> My Referral Requests ({myReferrals.length})
        </button>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Filter */}
          <div className="card-flat flex items-center gap-4">
            <div className="search-bar" style={{ flex: 1 }}>
              <Building size={16} />
              <input
                type="text"
                className="form-input w-full"
                placeholder="Filter alumni by target company (e.g. Google, Microsoft, EY)..."
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Alumni Grid */}
          {loading ? (
            <div className="text-center" style={{ padding: 60 }}><p className="body-md">Loading alumni directory...</p></div>
          ) : alumniList.length === 0 ? (
            <EmptyState icon={<Users />} title="No Alumni Found" message="No verified alumni found matching your criteria." />
          ) : (
            <div className="grid-3 stagger">
              {alumniList.map((alum) => (
                <div key={alum.id} className="card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="avatar" className="avatar" />
                      <div>
                        <h4 className="heading-sm">{alum.userFirstName} {alum.userLastName}</h4>
                        <p className="body-sm" style={{ color: 'var(--brand-primary-light)', fontWeight: 600 }}>{alum.designation || 'Engineer'} @ {alum.companyName}</p>
                      </div>
                    </div>

                    <p className="body-sm" style={{ marginBottom: 12 }}>
                      Graduated Class of <strong>{alum.graduationYear}</strong>
                    </p>

                    {alum.skills && (
                      <div className="flex flex-wrap gap-1" style={{ marginBottom: 16 }}>
                        {alum.skills.split(',').map((skill, i) => (
                          <span key={i} className="chip">{skill.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="btn btn-primary btn-sm w-full" onClick={() => setRequestModalAlumni(alum)}>
                    Request Referral <Send size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* MY REQUESTS TABLE */
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Alumni</th>
                <th>Company</th>
                <th>Target Opportunity</th>
                <th>Requested On</th>
                <th>Status</th>
                <th>Feedback / Notes</th>
              </tr>
            </thead>
            <tbody>
              {myReferrals.length === 0 ? (
                <tr><td colSpan={6} className="text-center" style={{ padding: 30 }}>No referral requests submitted yet.</td></tr>
              ) : (
                myReferrals.map((ref) => (
                  <tr key={ref.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ref.alumniName}</td>
                    <td>{ref.companyName}</td>
                    <td>{ref.opportunityTitle || 'General Referral'}</td>
                    <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={ref.status} /></td>
                    <td className="body-sm">{ref.feedbackNotes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* REQUEST REFERRAL MODAL */}
      {requestModalAlumni && (
        <div className="modal-overlay" onClick={() => setRequestModalAlumni(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="heading-md">Request Referral</h2>
                <p className="body-sm">To {requestModalAlumni.userFirstName} {requestModalAlumni.userLastName} ({requestModalAlumni.companyName})</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setRequestModalAlumni(null)}><X size={20} /></button>
            </div>

            {successMsg ? (
              <div className="badge badge-success" style={{ width: '100%', padding: 16, borderRadius: 8, justifyContent: 'center' }}>
                <CheckCircle size={20} /> {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">Target Opportunity (Optional)</label>
                  <select className="form-select" value={selectedOppId} onChange={(e) => setSelectedOppId(e.target.value)}>
                    <option value="">General Referral Request</option>
                    {opportunities.filter((o) => o.companyName?.toLowerCase() === requestModalAlumni.companyName?.toLowerCase()).map((o) => (
                      <option key={o.id} value={o.id}>{o.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Personalized Message</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Introduce yourself, share your relevant skills, and explain why you're interested in joining their company..."
                    value={referralMessage}
                    onChange={(e) => setReferralMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3" style={{ marginTop: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setRequestModalAlumni(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Referral Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
