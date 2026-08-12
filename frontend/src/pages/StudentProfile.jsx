import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { PageHeader, ProgressBar } from '../components/UIComponents';
import { User, FileText, Code, Save, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    graduationYear: 2025,
    cgpa: 8.5,
    githubUrl: '',
    linkedinUrl: '',
    bio: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillProficiency, setSkillProficiency] = useState('INTERMEDIATE');
  const [skills, setSkills] = useState([]);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [newResumeUrl, setNewResumeUrl] = useState('');
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const res = await studentAPI.getProfile(user.id);
        const p = res.data.data;
        setProfile(p);
        setFormData({
          department: p.department || '',
          graduationYear: p.graduationYear || 2025,
          cgpa: p.cgpa || 8.5,
          githubUrl: p.githubUrl || '',
          linkedinUrl: p.linkedinUrl || '',
          bio: p.bio || '',
        });
        setSkills(p.userSkills || []);
        setResumes(p.resumes || []);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const payload = {
        ...formData,
        userSkills: skills.map((s) => ({ skillName: s.skillName, proficiency: s.proficiency })),
        resumes: resumes.map((r) => ({ title: r.title, resumeUrl: r.resumeUrl, isPrimary: r.isPrimary })),
      };
      const res = await studentAPI.updateProfile(user.id, payload);
      setProfile(res.data.data);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills([...skills, { skillName: newSkill.trim(), proficiency: skillProficiency }]);
    setNewSkill('');
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addResume = () => {
    if (!newResumeTitle.trim() || !newResumeUrl.trim()) return;
    const isPrimary = resumes.length === 0;
    setResumes([...resumes, { title: newResumeTitle.trim(), resumeUrl: newResumeUrl.trim(), isPrimary }]);
    setNewResumeTitle('');
    setNewResumeUrl('');
  };

  const removeResume = (index) => {
    setResumes(resumes.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center" style={{ padding: 80 }}><p className="body-md">Loading student profile...</p></div>;

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: 900 }}>
      <PageHeader
        title="Student Profile Management"
        subtitle="Manage your academic info, skills, and resume portfolio for recruiters and alumni."
      />

      {/* Completion Header */}
      {profile && (
        <div className="card flex items-center justify-between">
          <div>
            <h3 className="heading-sm">Profile Completeness</h3>
            <p className="body-sm">A 100% complete profile increases referral response rate by 3x.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="heading-lg gradient-text">{profile.profileCompletionPercentage}%</span>
            <div style={{ width: 140 }}>
              <ProgressBar value={profile.profileCompletionPercentage} />
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="badge badge-success" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, fontSize: '0.875rem' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Personal & Academic Details */}
        <div className="card-flat flex flex-col gap-4">
          <h2 className="heading-md flex items-center gap-2"><User size={20} /> Academic & Bio Info</h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Computer Science & Engineering" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input type="number" className="form-input" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">CGPA / Percentage</label>
                <input type="number" step="0.1" className="form-input" value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })} />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input type="url" className="form-input" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} placeholder="https://github.com/username" />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input type="url" className="form-input" value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Summary</label>
            <textarea className="form-input" rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Aspiring Full Stack Engineer passionate about building scalable cloud apps..." />
          </div>
        </div>

        {/* Skills Management */}
        <div className="card-flat flex flex-col gap-4">
          <h2 className="heading-md flex items-center gap-2"><Code size={20} /> Skills & Technical Expertise</h2>

          <div className="flex gap-2">
            <input type="text" className="form-input" style={{ flex: 1 }} placeholder="Add skill e.g. React, Spring Boot, MySQL" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            <select className="form-select" value={skillProficiency} onChange={(e) => setSkillProficiency(e.target.value)}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
            <button type="button" className="btn btn-secondary" onClick={addSkill}><Plus size={16} /> Add</button>
          </div>

          <div className="flex flex-wrap gap-2" style={{ marginTop: 8 }}>
            {skills.map((s, idx) => (
              <span key={idx} className="chip">
                <span>{s.skillName}</span>
                <span className="caption" style={{ color: 'var(--brand-primary-light)' }}>({s.proficiency})</span>
                <Trash2 size={12} style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => removeSkill(idx)} />
              </span>
            ))}
          </div>
        </div>

        {/* Resumes */}
        <div className="card-flat flex flex-col gap-4">
          <h2 className="heading-md flex items-center gap-2"><FileText size={20} /> Resume Portfolio</h2>

          <div className="flex gap-2">
            <input type="text" className="form-input" style={{ width: '35%' }} placeholder="Title e.g. SDE Resume 2025" value={newResumeTitle} onChange={(e) => setNewResumeTitle(e.target.value)} />
            <input type="url" className="form-input" style={{ flex: 1 }} placeholder="URL link (Drive / Cloudinary)" value={newResumeUrl} onChange={(e) => setNewResumeUrl(e.target.value)} />
            <button type="button" className="btn btn-secondary" onClick={addResume}><Plus size={16} /> Add</button>
          </div>

          <div className="flex flex-col gap-2">
            {resumes.map((r, idx) => (
              <div key={idx} className="card flex items-center justify-between" style={{ padding: 12 }}>
                <div>
                  <h4 className="heading-sm">{r.title} {r.isPrimary && <span className="badge badge-success" style={{ marginLeft: 8 }}>Primary</span>}</h4>
                  <a href={r.resumeUrl} target="_blank" rel="noreferrer" className="body-sm truncate" style={{ display: 'block', maxWidth: 400 }}>{r.resumeUrl}</a>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeResume(idx)}><Trash2 size={16} color="var(--error)" /></button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
