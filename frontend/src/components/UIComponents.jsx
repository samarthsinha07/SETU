export function StatusBadge({ status }) {
  const map = {
    APPLIED: 'badge-info',
    SCREENING: 'badge-warning',
    OA: 'badge-primary',
    TECH_INTERVIEW: 'badge-primary',
    HR_INTERVIEW: 'badge-primary',
    SELECTED: 'badge-success',
    REJECTED: 'badge-error',
    REQUESTED: 'badge-info',
    ACCEPTED: 'badge-success',
    REFERRED: 'badge-primary',
    COMPLETED: 'badge-success',
    DECLINED: 'badge-error',
    INFO_NEEDED: 'badge-warning',
    PUBLISHED: 'badge-success',
    PENDING_VERIFICATION: 'badge-warning',
    EXPIRED: 'badge-error',
    DRAFT: 'badge-info',
    ACTIVE: 'badge-success',
    INACTIVE: 'badge-warning',
    SUSPENDED: 'badge-error',
  };
  const label = status?.replace(/_/g, ' ') || 'N/A';
  return <span className={`badge ${map[status] || 'badge-info'}`}>{label}</span>;
}

export function StatCard({ icon, value, label, color = 'purple' }) {
  return (
    <div className="stat-card animate-slide-up">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header flex items-center justify-between">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h3 className="heading-md" style={{ marginBottom: 8 }}>{title}</h3>
      <p className="body-md">{message}</p>
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

export function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
