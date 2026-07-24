import { useState, useEffect, FormEvent } from 'react';
import DashLayout from './DashLayout';
import { adminGetSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill } from '../api';
import { Skill, SkillCategory, SkillProficiency } from '../types';

const empty = { name: '', category: 'backend', proficiency: 'intermediate', order: '0' };

export default function SkillsManager() {
  const [skills,  setSkills]  = useState<Skill[]>([]);
  const [modal,   setModal]   = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form,    setForm]    = useState(empty);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const load = () => adminGetSkills().then(d => setSkills(d.results)).catch(console.error);
  useEffect(() => { load(); }, []);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openCreate = () => { setForm(empty); setEditing(null); setModal('create'); setError(''); };
  const openEdit   = (s: Skill) => {
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, order: String(s.order) });
    setEditing(s); setModal('edit'); setError('');
  };
  const close = () => { setModal(null); setError(''); };

const save = async (e: FormEvent) => {
  e.preventDefault();
  setSaving(true);
  try {
    const payload = {
      name:        form.name,
      category:    form.category    as SkillCategory,
      proficiency: form.proficiency as SkillProficiency,
      order:       Number(form.order),
    };
    if (modal === 'create') await adminCreateSkill(payload);
    else if (editing) await adminUpdateSkill(editing.id, payload);
    close(); load();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error');
  } finally { setSaving(false); }
};

  const remove = async (s: Skill) => {
    if (!window.confirm(`Delete "${s.name}"?`)) return;
    await adminDeleteSkill(s.id); load();
  };

  const grouped = ['backend', 'frontend', 'database', 'tools'].map(cat => ({
    cat, items: skills.filter(s => s.category === cat)
  })).filter(g => g.items.length > 0);

  return (
    <DashLayout>
      <div className="dash-header">
        <h1>Skills</h1>
        <button className="btn btn-blue" onClick={openCreate}>+ Add skill</button>
      </div>

      {grouped.map(g => (
        <div key={g.cat} style={{ marginBottom: '1.5rem' }}>
          <div className="section-title" style={{ textTransform: 'capitalize' }}>{g.cat}</div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Proficiency</th><th>Order</th><th>Actions</th></tr></thead>
            <tbody>
              {g.items.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className={`prof-dot prof-${s.proficiency}`} />{s.proficiency_display}
                  </div></td>
                  <td>{s.order}</td>
                  <td><div className="actions-row">
                    <button className="btn btn-gray btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-red  btn-sm" onClick={() => remove(s)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Add skill' : 'Edit skill'}</h2>
            {error && <div className="err">{error}</div>}
            <form onSubmit={save}>
              <div className="form-group"><label>Name</label>
                <input name="name" value={form.name} onChange={change} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label>Category</label>
                  <select name="category" value={form.category} onChange={change}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="tools">Tools & DevOps</option>
                  </select></div>
                <div className="form-group"><label>Proficiency</label>
                  <select name="proficiency" value={form.proficiency} onChange={change}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select></div>
              </div>
              <div className="form-group"><label>Order</label>
                <input name="order" value={form.order} onChange={change} type="number" /></div>
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