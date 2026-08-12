import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI, opportunityAPI, analyticsAPI } from '../services/api';
import { StatCard, PageHeader, StatusBadge, ProgressBar } from '../components/UIComponents';
import { Briefcase, Kanban, Link2, ArrowRight, UserCheck, TrendingUp, Sparkles } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        const [profRes, anaRes, oppRes] = await Promise.all([
          studentAPI.getProfile(user.id),
          analyticsAPI.getStudent(user.id),
          opportunityAPI.getAll({ limit: 5 }),
        ]);
        setProfile(profRes.data.data);
        setAnalytics(anaRes.data.data);
        setOpportunities(oppRes.data.data);
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading your student workspace...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${user?.firstName}! 👋`}
        subtitle="Track your applications, referrals, and explore top campus opportunities."
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/student/opportunities')}>
            <Briefcase size={16} /> Explore Opportunities
          </button>
        }
      />

      {/* Profile Completion Alert Banner if < 100% */}
      {profile && profile.profileCompletionPercentage < 100 && (
        <div className="card flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))', borderColor: 'var(--brand-primary)' }}>
          <div className="flex items-center gap-4">
            <div className="stat-icon purple"><Sparkles size={24} /></div>
            <div>
              <h3 className="heading-sm">Complete your student profile</h3>
              <p className="body-sm">Your profile is {profile.profileCompletionPercentage}% complete. Upload your resume and add skills to get noticed by alumni referrers!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ width: 120 }}>
              <ProgressBar value={profile.profileCompletionPercentage} />
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/profile')}>Complete Profile</button>
          </div>
        </div>
      )}

      {/* Stat Grid */}
      <div className="grid-4 stagger">
        <StatCard icon={<Kanban size={22} />} value={analytics?.totalApplications || 0} label="Total Applications" color="purple" />
        <StatCard icon={<Link2 size={22} />} value={analytics?.referralsRequested || 0} label="Referrals Requested" color="cyan" />
        <StatCard icon={<UserCheck size={22} />} value={analytics?.referralsGranted || 0} label="Referrals Granted" color="green" />
        <StatCard icon={<TrendingUp size={22} />} value={`${analytics?.applicationSuccessRate || 0}%`} label="Selection Success Rate" color="yellow" />
      </div>

      {/* Main 2-column layout */}
      <div className="grid-2">
        {/* Recommended Opportunities */}
        <div className="card-flat">
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h2 className="heading-md">Top Opportunities</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/opportunities')}>View All <ArrowRight size={14} /></button>
          </div>
          <div className="flex flex-col gap-3">
            {opportunities.slice(0, 4).map((opp) => (
              <div key={opp.id} className="card flex items-center justify-between" style={{ padding: 16 }}>
                <div>
                  <h4 className="heading-sm">{opp.title}</h4>
                  <p className="body-sm">{opp.companyName} • {opp.location} • <span style={{ color: 'var(--brand-primary-light)' }}>{opp.salaryPackage}</span></p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/opportunities')}>View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Stage Breakdown */}
        <div className="card-flat">
          <h2 className="heading-md" style={{ marginBottom: 20 }}>Application Funnel</h2>
          <div className="flex flex-col gap-4">
            {analytics?.stageBreakdown ? (
              Object.entries(analytics.stageBreakdown).map(([stage, count]) => (
                <div key={stage}>
                  <div className="flex justify-between body-sm" style={{ marginBottom: 6 }}>
                    <span style={{ textTransform: 'capitalize' }}>{stage.replace(/_/g, ' ')}</span>
                    <span className="mono">{count} candidate(s)</span>
                  </div>
                  <ProgressBar value={(count / (analytics.totalApplications || 1)) * 100} />
                </div>
              ))
            ) : (
              <p className="body-sm">No applications submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
