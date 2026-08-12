import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, Building, GraduationCap } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: 'Computer Science',
    graduationYear: 2025,
    companyName: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        major: formData.department,
      };
      const data = await register(payload);
      if (data.role === 'STUDENT') navigate('/student/dashboard');
      else if (data.role === 'ALUMNI') navigate('/alumni/referrals');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide-up" style={{ maxWidth: 520 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <div className="sidebar-brand-icon">S</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>SETU</span>
        </div>

        <h1>Join Campus Hub</h1>
        <p className="body-md">Create your profile to start applying or giving referrals</p>

        {error && (
          <div className="badge badge-error" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 20, justifyContent: 'flex-start' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-input" placeholder="Rahul" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-input" placeholder="Sharma" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="rahul@university.edu" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          <div className="form-group">
            <label className="form-label">I am registering as</label>
            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
              <option value="STUDENT">Student / Job Seeker</option>
              <option value="ALUMNI">Alumni / Industry Professional</option>
            </select>
          </div>

          {formData.role === 'STUDENT' ? (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" name="department" className="form-input" placeholder="Computer Science" value={formData.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input type="number" name="graduationYear" className="form-input" value={formData.graduationYear} onChange={handleChange} />
              </div>
            </div>
          ) : (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Current Company</label>
                <input type="text" name="companyName" className="form-input" placeholder="Google" value={formData.companyName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input type="text" name="designation" className="form-input" placeholder="Senior SDE" value={formData.designation} onChange={handleChange} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Creating Account...' : 'Create Account'} <UserPlus size={18} />
          </button>
        </form>

        <p className="body-sm text-center" style={{ marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
