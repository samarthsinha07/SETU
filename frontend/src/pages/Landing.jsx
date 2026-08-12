import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Briefcase, Users, Shield, BarChart3, Star, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const goToDashboard = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user.role === 'STUDENT') navigate('/student/dashboard');
    else if (user.role === 'ALUMNI') navigate('/alumni/referrals');
    else navigate('/admin/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Navbar */}
      <nav className="public-navbar">
        <div className="flex items-center gap-3">
          <div className="sidebar-brand-icon">S</div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>SETU</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button className="btn btn-primary" onClick={goToDashboard}>Go to Dashboard <ArrowRight size={16}/></button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started <ArrowRight size={16}/></button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero animate-fade-in">
        <div className="caption" style={{ color: 'var(--brand-accent)', marginBottom: 16 }}>
          <Star size={14} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} /> CAMPUS OPPORTUNITY & REFERRAL HUB
        </div>
        <h1>
          Bridge the Gap Between <span className="gradient-text">Campus Talent</span> & <span className="gradient-text">Industry Leaders</span>
        </h1>
        <p>
          An enterprise platform connecting students with dream opportunities, alumni with referral impact, and admins with powerful analytics. Built for campus placements at scale.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Create Your Account <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Sign In to Dashboard
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 48px' }}>
        <div className="grid-4 stagger">
          {[
            { val: '5,200+', lbl: 'Students Placed' },
            { val: '450+', lbl: 'Alumni Referrers' },
            { val: '120+', lbl: 'Partner Companies' },
            { val: '92%', lbl: 'Success Rate' },
          ].map((s, i) => (
            <div key={i} className="card animate-slide-up" style={{ textAlign: 'center' }}>
              <div className="stat-value gradient-text">{s.val}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ paddingBottom: 80 }}>
        <h2 className="heading-lg text-center" style={{ marginBottom: 40 }}>Platform Capabilities</h2>
        <div className="feature-grid stagger">
          {[
            { icon: <Briefcase size={24} />, color: 'var(--brand-primary)', title: 'Opportunity Explorer', desc: 'Browse, search, filter, and bookmark live job listings across top companies with real-time deadline tracking.' },
            { icon: <Users size={24} />, color: 'var(--brand-accent)', title: 'Alumni Referral Marketplace', desc: 'Search alumni by company & skills. Send personalized referral requests with end-to-end status tracking.' },
            { icon: <Zap size={24} />, color: 'var(--warning)', title: 'Application Tracker & Kanban', desc: 'Full lifecycle tracking with visual Kanban boards — from APPLIED to SELECTED with history timeline.' },
            { icon: <BarChart3 size={24} />, color: 'var(--success)', title: 'Career Analytics Dashboard', desc: 'Application success rate, conversion funnel, interview pipelines, and skill insights at a glance.' },
            { icon: <Shield size={24} />, color: 'var(--error)', title: 'Admin Verification Engine', desc: 'Role-based access control. Admin verifies companies, moderates job listings, and manages platform users.' },
            { icon: <Star size={24} />, color: '#f472b6', title: 'Smart Notifications', desc: 'Real-time in-app notifications for status shifts, referral updates, and expiring opportunity deadlines.' },
          ].map((f, i) => (
            <div className="feature-card animate-slide-up" key={i}>
              <div className="feature-icon" style={{ background: `${f.color}18`, color: f.color }}>{f.icon}</div>
              <h3 className="heading-sm" style={{ marginBottom: 8 }}>{f.title}</h3>
              <p className="body-md">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 32px', borderTop: '1px solid var(--border-subtle)' }}>
        <p className="body-sm">© 2026 SETU — Campus Opportunity & Referral Hub. Enterprise-Grade Full Stack Platform.</p>
      </footer>
    </div>
  );
}
