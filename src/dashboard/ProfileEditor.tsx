import { useState, useEffect, FormEvent } from 'react';
import DashLayout from './DashLayout';
import { adminGetProfile, adminUpdateProfile } from '../api';
import { Profile } from '../types';

export default function ProfileEditor() {
  const [form,    setForm]    = useState<Partial<Profile>>({});
  const [error,   setError]   = useState('');
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    adminGetProfile().then(setForm).catch(console.error);
  }, []);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    setSaved(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminUpdateProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving');
    } finally { setSaving(false); }
  };

  return (
    <DashLayout>
      <div className="dash-header"><h1>Profile</h1></div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.75rem', maxWidth: 680 }}>
        {error && <div className="err">{error}</div>}
        {saved && <div className="success">Profile saved successfully.</div>}
        <form onSubmit={save}>
          <div className="form-group"><label>Full name</label>
            <input name="name" value={form.name ?? ''} onChange={change} required /></div>
          <div className="form-group"><label>Headline</label>
            <input name="headline" value={form.headline ?? ''} onChange={change} required
              placeholder="Full-Stack Developer · SOC Analyst · Security Engineer" /></div>
          <div className="form-group"><label>Bio</label>
            <textarea name="bio" value={form.bio ?? ''} onChange={change} rows={4} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group"><label>Location</label>
              <input name="location" value={form.location ?? ''} onChange={change} /></div>
            <div className="form-group"><label>Email</label>
              <input name="email" type="email" value={form.email ?? ''} onChange={change} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group"><label>GitHub URL</label>
              <input name="github_url" type="url" value={form.github_url ?? ''} onChange={change} /></div>
            <div className="form-group"><label>LinkedIn URL</label>
              <input name="linkedin_url" type="url" value={form.linkedin_url ?? ''} onChange={change} /></div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: '1.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="available_for_work"
              checked={!!form.available_for_work} onChange={change} />
            Available for freelance work (shows green badge on site)
          </label>
          <button type="submit" className="btn btn-blue" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </DashLayout>
  );
}