import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { referralAPI, alumniAPI } from '../services/api';
import { PageHeader, StatusBadge, EmptyState } from '../components/UIComponents';
import { ScrollText } from 'lucide-react';

export default function AlumniHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchHistory = async () => {
      try {
        const profRes = await alumniAPI.getProfile(user.id);
        const prof = profRes.data.data;
        if (prof) {
          const refRes = await referralAPI.getByAlumni(prof.id);
          setHistory(refRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch alumni history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading referral history...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Referral Activity History"
        subtitle="Complete log of student referral requests you have processed."
      />

      {history.length === 0 ? (
        <EmptyState
          icon={<ScrollText />}
          title="No Past Activity"
          message="Processed referral history will be logged here."
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Target Opportunity</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Your Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.studentName}</td>
                  <td>{h.opportunityTitle || 'General Referral'}</td>
                  <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={h.status} /></td>
                  <td className="body-sm">{h.feedbackNotes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
