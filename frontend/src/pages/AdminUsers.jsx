import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { PageHeader, StatusBadge } from '../components/UIComponents';
import { Users, Search, Shield, CheckCircle, Ban } from 'lucide-react';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (targetUser) => {
    const nextStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminAPI.updateUserStatus(targetUser.id, nextStatus, user.id);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesSearch = !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading user registry...</p></div>;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Platform User Management"
        subtitle="View, filter, and audit user permissions or suspend non-compliant accounts."
      />

      <div className="card-flat flex items-center gap-4">
        <div className="search-bar" style={{ flex: 1 }}>
          <Search size={16} />
          <input
            type="text"
            className="form-input w-full"
            placeholder="Search user by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="ALUMNI">Alumni</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-primary">{u.role}</span></td>
                <td><StatusBadge status={u.status} /></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'} btn-sm`}
                    onClick={() => handleToggleStatus(u)}
                  >
                    {u.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
