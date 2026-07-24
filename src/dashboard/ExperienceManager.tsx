import { useState, useEffect, FormEvent } from 'react';
import DashLayout from './DashLayout';
import { adminGetExperience, adminCreateExperience, adminUpdateExperience, adminDeleteExperience } from '../api';
import { Experience } from '../types';

const empty = { role: '', company: '', start_date: '', end_date: '', description: '', is_current: false };

export default function ExperienceManager() {
  const [list,    setList]    = useState<Experience[]>([]);
  const [modal,   setModal]   = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form,    setForm]    = useState(empty);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const load = () => adminGetExperience().then(d => setList(d.results)).catch(console.error);
  useEffect(() => { load(); }, []);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const openCreate = () => { setForm(empty); setEditing(null); setModal('create'); setError(''); };
  const openEdit   = (exp: Experience) => {
    setForm({
      role: exp.role, company: exp.company,
      start_date: exp.start_date, end_date: exp.end_date ?? '',
      description: exp.description, is_current: exp.is_current,
    });
    setEditing(exp); setModal('edit'); setError('');
  };
  const close = () => { setModal(null); setError(''); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, end_date: form.is_current ? null : (form.end_date || null) };
    try {
      if (modal === 'create') await adminCreateExperience(payload);
      else if (editing) await adminUpdateExperience(editing.id, payload);
      close(); load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally { setSaving(false); }
  };

  const remove = async (exp: Experience) => {
    if (!window.confirm(`Delete "${exp.role} at ${exp.company}"?`)) return;
    await adminDeleteExperience(exp.id); load();
  };

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';

  return (
    <DashLayout>
      <div className="dash-header">
        <h1>Experience</h1>
        <button className="btn btn-blue" onClick={openCreate}>+ Add role</button>
      </div>

      <table className="data-table">
        <thead><tr><th>Role</th><th>Company</th><th>Period</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map(exp => (
            <tr key={exp.id}>
              <td><strong>{exp.role}</strong></td>
              <td>{exp.company}</td>
              <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                {fmt(exp.start_date)} — {exp.is_current ? <span style={{ color: 'var(--green)' }}>Present</span> : fmt(exp.end_date)}
              </td>
              <td><div className="actions-row">
                <button className="btn btn-gray btn-sm" onClick={() => openEdit(exp)}>Edit</button>
                <button className="btn btn-red  btn-sm" onClick={() => remove(exp)}>Delete</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Add role' : 'Edit role'}</h2>
            {error && <div className="err">{error}</div>}
            <form onSubmit={save}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label>Role / Job title</label>
                  <input name="role" value={form.role} onChange={change} required /></div>
                <div className="form-group"><label>Company</label>
                  <input name="company" value={form.company} onChange={change} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label>Start date</label>
                  <input name="start_date" value={form.start_date} onChange={change} type="date" required /></div>
                <div className="form-group"><label>End date</label>
                  <input name="end_date" value={form.end_date} onChange={change} type="date" disabled={form.is_current} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" name="is_current" checked={form.is_current} onChange={change} />
                This is my current role
              </label>
              <div className="form-group"><label>Description</label>
                <textarea name="description" value={form.description} onChange={change} rows={4} required /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-gray" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-blue" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashLayout>
  );
}