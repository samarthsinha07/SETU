import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alumniAPI } from '../services/api';
import { PageHeader } from '../components/UIComponents';
import { User, Building, Briefcase, Save, CheckCircle, Code } from 'lucide-react';

export default function AlumniProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    designation: '',
    experienceYears: 3,
    graduationYear: 2022,
    linkedinUrl: '',
    bio: '',
    skills: '',
    isAvailableForReferrals: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    alumniAPI.getProfile(user.id).then((res) => {
      const p = res.data.data;
      if (p) {
        setFormData({
          companyName: p.companyName || '',
          designation: p.designation || '',
          experienceYears: p.experienceYears || 3,
          graduationYear: p.graduationYear || 2022,
          linkedinUrl: p.linkedinUrl || '',
          bio: p.bio || '',
          skills: p.skills || '',
          isAvailableForReferrals: p.isAvailableForReferrals ?? true,
        });
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await alumniAPI.updateProfile(user.id, formData);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading alumni profile...</p></div>;

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: 800 }}>
      <PageHeader
        title="Alumni Profile & Availability"
        subtitle="Keep your company designation and referral preferences up to date."
      />

      {successMsg && (
        <div className="badge badge-success" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, fontSize: '0.875rem' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-flat flex flex-col gap-6">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Current Company</label>
            <input type="text" className="form-input" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Designation / Role</label>
            <input type="text" className="form-input" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input type="number" className="form-input" value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Graduation Year</label>
            <input type="number" className="form-input" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">LinkedIn Profile URL</label>
          <input type="url" className="form-input" value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" />
        </div>

        <div className="form-group">
          <label className="form-label">Key Expertise / Skills (comma separated)</label>
          <input type="text" className="form-input" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Java, Spring Boot, React, AWS, System Design" />
        </div>

        <div className="form-group">
          <label className="form-label">Bio & Referral Policy</label>
          <textarea className="form-input" rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Happy to refer students with strong DSA and project portfolios!" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="avail" checked={formData.isAvailableForReferrals} onChange={(e) => setFormData({ ...formData, isAvailableForReferrals: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--brand-primary)' }} />
          <label htmlFor="avail" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Available for student referral requests</label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ alignSelf: 'flex-start', marginTop: 12 }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
