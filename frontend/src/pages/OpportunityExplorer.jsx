import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { opportunityAPI, applicationAPI, studentAPI } from '../services/api';
import { PageHeader, StatusBadge, EmptyState } from '../components/UIComponents';
import { Search, Filter, Bookmark, Briefcase, MapPin, DollarSign, Clock, Send, X, CheckCircle, ExternalLink } from 'lucide-react';

export default function OpportunityExplorer() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null); // for detail modal
  const [applyOpp, setApplyOpp] = useState(null); // for apply modal
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await opportunityAPI.getAll({
        search: search || undefined,
        type: typeFilter || undefined,
        workMode: workModeFilter || undefined,
        status: 'PUBLISHED',
      });
      setOpportunities(res.data.data);
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [search, typeFilter, workModeFilter]);

  useEffect(() => {
    if (user?.id) {
      studentAPI.getProfile(user.id).then((res) => {
        setResumes(res.data.data.resumes || []);
      }).catch(console.error);
    }
  }, [user]);

  const handleToggleBookmark = async (e, oppId) => {
    e.stopPropagation();
    try {
      await opportunityAPI.toggleBookmark(oppId, user.id);
      fetchOpportunities();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyOpp) return;
    setApplying(true);
    setApplySuccess('');
    try {
      await applicationAPI.apply(
        user.id,
        applyOpp.id,
        selectedResumeId ? parseInt(selectedResumeId) : null,
        coverLetter
      );
      setApplySuccess('Application submitted successfully!');
      setTimeout(() => {
        setApplySuccess('');
        setApplyOpp(null);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed or already submitted.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Campus Opportunity Explorer"
        subtitle="Discover verified full-time roles & internships from top companies."
      />

      {/* Search & Filters */}
      <div className="card-flat flex flex-wrap items-center gap-4">
        <div className="search-bar" style={{ flex: 1, minWidth: 260 }}>
          <Search size={16} />
          <input
            type="text"
            className="form-input w-full"
            placeholder="Search by role title, company, or key skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Opportunity Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <select className="form-select" value={workModeFilter} onChange={(e) => setWorkModeFilter(e.target.value)}>
          <option value="">All Work Modes</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ON_SITE">On-Site</option>
        </select>
      </div>

      {/* Grid of Opportunities */}
      {loading ? (
        <div className="text-center" style={{ padding: 60 }}><p className="body-md">Loading opportunities...</p></div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="No Opportunities Found"
          message="Try broadening your search query or adjusting active filters."
        />
      ) : (
        <div className="grid-3 stagger">
          {opportunities.map((opp) => (
            <div key={opp.id} className="card flex flex-col justify-between" style={{ height: '100%' }}>
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <span className="badge badge-primary">{opp.opportunityType?.replace(/_/g, ' ')}</span>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={(e) => handleToggleBookmark(e, opp.id)}
                    title="Bookmark Opportunity"
                  >
                    <Bookmark size={18} fill={opp.isBookmarkedByCurrentUser ? 'var(--brand-primary-light)' : 'none'} color={opp.isBookmarkedByCurrentUser ? 'var(--brand-primary-light)' : 'var(--text-muted)'} />
                  </button>
                </div>

                <h3 className="heading-sm" style={{ marginBottom: 4 }}>{opp.title}</h3>
                <p className="body-md" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{opp.companyName}</p>

                <div className="flex flex-col gap-2 body-sm" style={{ marginBottom: 16 }}>
                  <div className="flex items-center gap-2"><MapPin size={14} color="var(--text-muted)" /> <span>{opp.location} • {opp.workMode}</span></div>
                  <div className="flex items-center gap-2"><DollarSign size={14} color="var(--text-muted)" /> <span style={{ color: 'var(--success)' }}>{opp.salaryPackage}</span></div>
                  <div className="flex items-center gap-2"><Clock size={14} color="var(--text-muted)" /> <span>Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}</span></div>
                </div>

                <p className="body-sm line-clamp-2" style={{ marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{opp.description}</p>
              </div>

              <div className="flex items-center gap-2" style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setSelectedOpp(opp)}>
                  View Details
                </button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setApplyOpp(opp)}>
                  Apply Now <Send size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={() => setSelectedOpp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div>
                <h2 className="heading-md">{selectedOpp.title}</h2>
                <p className="body-sm">{selectedOpp.companyName} • {selectedOpp.location}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedOpp(null)}><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary">{selectedOpp.opportunityType}</span>
                <span className="badge badge-info">{selectedOpp.workMode}</span>
                <span className="badge badge-success">{selectedOpp.salaryPackage}</span>
              </div>
              <div>
                <h4 className="heading-sm" style={{ marginBottom: 8 }}>Job Description</h4>
                <p className="body-md" style={{ whiteSpace: 'pre-line' }}>{selectedOpp.description}</p>
              </div>
              {selectedOpp.requirements && (
                <div>
                  <h4 className="heading-sm" style={{ marginBottom: 8 }}>Requirements</h4>
                  <p className="body-md" style={{ whiteSpace: 'pre-line' }}>{selectedOpp.requirements}</p>
                </div>
              )}
              <div className="flex justify-end gap-3" style={{ marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => setSelectedOpp(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => { setSelectedOpp(null); setApplyOpp(selectedOpp); }}>
                  Apply Now <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLY MODAL */}
      {applyOpp && (
        <div className="modal-overlay" onClick={() => setApplyOpp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="heading-md">Apply for {applyOpp.title}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setApplyOpp(null)}><X size={20} /></button>
            </div>

            {applySuccess ? (
              <div className="badge badge-success" style={{ width: '100%', padding: '16px', borderRadius: 8, justifyContent: 'center' }}>
                <CheckCircle size={20} /> {applySuccess}
              </div>
            ) : (
              <form onSubmit={handleApply} className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">Select Resume to Attach</label>
                  {resumes.length > 0 ? (
                    <select className="form-select" value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)}>
                      <option value="">Select a saved resume...</option>
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>{r.title} {r.isPrimary ? '(Primary)' : ''}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="body-sm" style={{ color: 'var(--warning)' }}>No saved resumes found. Add a resume link in your Profile first!</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter / Note (Optional)</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Briefly state why you are a great fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3" style={{ marginTop: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setApplyOpp(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
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
