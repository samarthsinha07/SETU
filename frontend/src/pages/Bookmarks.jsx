import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { opportunityAPI } from '../services/api';
import { PageHeader, EmptyState } from '../components/UIComponents';
import { Bookmark, MapPin, DollarSign, Clock, Send, Trash2 } from 'lucide-react';

export default function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await opportunityAPI.getBookmarks(user.id);
      setBookmarks(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchBookmarks();
  }, [user]);

  const handleRemoveBookmark = async (oppId) => {
    try {
      await opportunityAPI.toggleBookmark(oppId, user.id);
      fetchBookmarks();
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading your bookmarked opportunities...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Saved Bookmarks"
        subtitle="Opportunities you have bookmarked for later application."
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark />}
          title="No Bookmarks Saved"
          message="Explore opportunities and click the bookmark icon to save roles here."
        />
      ) : (
        <div className="grid-3 stagger">
          {bookmarks.map((opp) => (
            <div key={opp.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <span className="badge badge-primary">{opp.opportunityType}</span>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleRemoveBookmark(opp.id)}>
                    <Trash2 size={16} color="var(--error)" />
                  </button>
                </div>
                <h3 className="heading-sm" style={{ marginBottom: 4 }}>{opp.title}</h3>
                <p className="body-md" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{opp.companyName}</p>

                <div className="flex flex-col gap-2 body-sm" style={{ marginBottom: 16 }}>
                  <div className="flex items-center gap-2"><MapPin size={14} color="var(--text-muted)" /> <span>{opp.location}</span></div>
                  <div className="flex items-center gap-2"><DollarSign size={14} color="var(--text-muted)" /> <span style={{ color: 'var(--success)' }}>{opp.salaryPackage}</span></div>
                </div>
              </div>

              <a href="/student/opportunities" className="btn btn-primary btn-sm w-full">
                Apply Now <Send size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
