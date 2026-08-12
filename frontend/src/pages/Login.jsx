import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.role === 'STUDENT') navigate('/student/dashboard');
      else if (data.role === 'ALUMNI') navigate('/alumni/referrals');
      else if (data.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide-up">
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <div className="sidebar-brand-icon">S</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>SETU</span>
        </div>

        <h1>Welcome Back</h1>
        <p className="body-md">Sign in to access your dashboard and opportunities</p>

        {error && (
          <div className="badge badge-error" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 20, justifyContent: 'flex-start' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="search-bar">
              <Mail size={16} />
              <input
                type="email"
                className="form-input w-full"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="search-bar">
              <Lock size={16} />
              <input
                type="password"
                className="form-input w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In'} <LogIn size={18} />
          </button>
        </form>

        {/* Demo Accounts Quick-fill */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <div className="caption" style={{ marginBottom: 12 }}>Demo One-Click Login</div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemoAccount('rahul.sharma@example.com', 'Student@123')}>
              Student Demo
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemoAccount('priya.patel@example.com', 'Alumni@123')}>
              Alumni Demo
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemoAccount('admin@campus.hub', 'Admin@123')}>
              Admin Demo
            </button>
          </div>
        </div>

        <p className="body-sm text-center" style={{ marginTop: 24 }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
}
