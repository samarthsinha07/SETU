import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { StatCard, PageHeader, ProgressBar } from '../components/UIComponents';
import { Users, Briefcase, Link2, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getAdmin().then((res) => {
      setAnalytics(res.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading platform administrative console...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Admin Platform Command Center"
        subtitle="System-wide metrics, user activity, placement statistics, and verification pipelines."
      />

      {/* Top Stat Cards */}
      <div className="grid-4 stagger">
        <StatCard icon={<Users size={22} />} value={analytics?.totalStudents || 0} label="Registered Students" color="purple" />
        <StatCard icon={<ShieldCheck size={22} />} value={analytics?.totalAlumni || 0} label="Verified Alumni" color="cyan" />
        <StatCard icon={<Briefcase size={22} />} value={analytics?.activeOpportunities || 0} label="Published Opportunities" color="green" />
        <StatCard icon={<CheckCircle2 size={22} />} value={analytics?.totalPlacements || 0} label="Successful Placements" color="yellow" />
      </div>

      {/* 2-column breakdown */}
      <div className="grid-2">
        {/* Verification Status Breakdown */}
        <div className="card-flat flex flex-col gap-4">
          <h2 className="heading-md">Company & Opportunity Verifications</h2>
          <div className="flex justify-between items-center card" style={{ padding: 16 }}>
            <div>
              <h4 className="heading-sm">Pending Job Verifications</h4>
              <p className="body-sm">Requires admin review before publishing to students</p>
            </div>
            <span className="heading-lg gradient-text">{analytics?.pendingOpportunityVerifications || 0}</span>
          </div>

          <div className="flex justify-between items-center card" style={{ padding: 16 }}>
            <div>
              <h4 className="heading-sm">Pending Company Verifications</h4>
              <p className="body-sm">Requires admin domain & corporate audit</p>
            </div>
            <span className="heading-lg gradient-text">{analytics?.pendingCompanyVerifications || 0}</span>
          </div>
        </div>

        {/* Global Conversion Funnel */}
        <div className="card-flat flex flex-col gap-4">
          <h2 className="heading-md">Platform Placement Funnel</h2>
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between body-sm" style={{ marginBottom: 4 }}>
                <span>Total Applications Submitted</span>
                <span className="mono">{analytics?.totalApplications || 0}</span>
              </div>
              <ProgressBar value={100} />
            </div>

            <div>
              <div className="flex justify-between body-sm" style={{ marginBottom: 4 }}>
                <span>Referral Requests Granted</span>
                <span className="mono">{analytics?.referralsGranted || 0}</span>
              </div>
              <ProgressBar value={((analytics?.referralsGranted || 0) / Math.max(1, analytics?.totalApplications || 1)) * 100} />
            </div>

            <div>
              <div className="flex justify-between body-sm" style={{ marginBottom: 4 }}>
                <span>Selected Candidates (Placements)</span>
                <span className="mono">{analytics?.totalPlacements || 0}</span>
              </div>
              <ProgressBar value={((analytics?.totalPlacements || 0) / Math.max(1, analytics?.totalApplications || 1)) * 100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
