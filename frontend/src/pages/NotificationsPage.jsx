import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { PageHeader, EmptyState } from '../components/UIComponents';
import { Bell, CheckCircle, Info, AlertTriangle, Briefcase, Link2 } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.get(user.id);
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    if (type?.includes('APPLICATION')) return <Briefcase size={20} color="var(--brand-primary-light)" />;
    if (type?.includes('REFERRAL')) return <Link2 size={20} color="var(--brand-accent)" />;
    return <Info size={20} color="var(--warning)" />;
  };

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading notifications...</p></div>;

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: 800 }}>
      <PageHeader
        title="Notifications & Alerts"
        subtitle="Real-time notifications on application updates, referral responses, and system alerts."
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell />}
          title="No Notifications"
          message="You're all caught up! Updates on your applications and referrals will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3 stagger">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="card flex items-start justify-between"
              style={{
                background: n.isRead ? 'var(--bg-surface)' : 'rgba(99, 102, 241, 0.08)',
                borderColor: n.isRead ? 'var(--border-subtle)' : 'var(--brand-primary)',
              }}
            >
              <div className="flex items-start gap-4">
                <div style={{ marginTop: 2 }}>{getNotificationIcon(n.type)}</div>
                <div>
                  <h4 className="heading-sm" style={{ marginBottom: 4 }}>{n.title}</h4>
                  <p className="body-sm" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>{n.message}</p>
                  <span className="caption">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{ color: 'var(--brand-primary-light)' }}
                >
                  <CheckCircle size={14} /> Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
