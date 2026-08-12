import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Search, Kanban, Users, Bookmark,
  Bell, BarChart3, Shield, FileCheck, ScrollText, LogOut, Link2
} from 'lucide-react';

const studentLinks = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/student/profile', icon: User },
  { label: 'Opportunities', path: '/student/opportunities', icon: Search },
  { label: 'Applications', path: '/student/applications', icon: Kanban },
  { label: 'Referral Hub', path: '/student/referrals', icon: Link2 },
  { label: 'Bookmarks', path: '/student/bookmarks', icon: Bookmark },
  { label: 'Notifications', path: '/student/notifications', icon: Bell },
];

const alumniLinks = [
  { label: 'Referral Requests', path: '/alumni/referrals', icon: Users },
  { label: 'My Profile', path: '/alumni/profile', icon: User },
  { label: 'History', path: '/alumni/history', icon: ScrollText },
  { label: 'Notifications', path: '/alumni/notifications', icon: Bell },
];

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Verification', path: '/admin/verification', icon: FileCheck },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: Shield },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links =
    user?.role === 'STUDENT' ? studentLinks :
    user?.role === 'ALUMNI' ? alumniLinks :
    adminLinks;

  const sectionLabel =
    user?.role === 'STUDENT' ? 'Student Portal' :
    user?.role === 'ALUMNI' ? 'Alumni Portal' :
    'Admin Console';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-brand-icon">S</div>
        <span className="sidebar-brand-text">SETU</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">{sectionLabel}</div>
        {links.map((link) => (
          <div
            key={link.path}
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            <link.icon />
            <span>{link.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={logout}>
          <img src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'} alt="avatar" className="sidebar-avatar" />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }} className="truncate">{user?.firstName} {user?.lastName}</div>
            <div className="body-sm truncate">{user?.email}</div>
          </div>
          <LogOut style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
        </div>
      </div>
    </aside>
  );
}
