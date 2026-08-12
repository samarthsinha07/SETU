import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { PageHeader, EmptyState } from '../components/UIComponents';
import { FileCheck, CheckCircle, XCircle, Building, Briefcase } from 'lucide-react';

export default function AdminVerification() {
  const { user } = useAuth();
  const [pendingOpps, setPendingOpps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await adminAPI.getPendingOpportunities();
      setPendingOpps(res.data.data);
    } catch (err) {
      console.error('Failed to fetch pending opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (oppId, status) => {
    try {
      await adminAPI.verifyOpportunity(oppId, status);
      fetchPending();
    } catch (err) {
      alert('Failed to update verification status.');
    }
  };

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading verification queue...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Verification Queue"
        subtitle="Review, approve, or reject pending job listings and corporate recruiter requests."
      />

      {pendingOpps.length === 0 ? (
        <EmptyState
          icon={<FileCheck />}
          title="Queue Empty"
          message="No opportunities are currently waiting for admin verification."
        />
      ) : (
        <div className="flex flex-col gap-4 stagger">
          {pendingOpps.map((opp) => (
            <div key={opp.id} className="card flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                  <span className="badge badge-warning">PENDING VERIFICATION</span>
                  <span className="badge badge-primary">{opp.opportunityType}</span>
                </div>
                <h3 className="heading-sm">{opp.title}</h3>
                <p className="body-sm">{opp.companyName} • {opp.location} • {opp.salaryPackage}</p>
                <p className="body-sm text-muted" style={{ marginTop: 8 }}>{opp.description}</p>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => handleVerify(opp.id, 'EXPIRED')}>
                  <XCircle size={14} /> Reject Listing
                </button>
                <button className="btn btn-success btn-sm" onClick={() => handleVerify(opp.id, 'PUBLISHED')}>
                  <CheckCircle size={14} /> Approve & Publish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
