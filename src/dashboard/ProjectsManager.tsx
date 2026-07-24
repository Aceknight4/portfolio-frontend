import { useState, useEffect, useReducer, FormEvent } from 'react';
import DashLayout from './DashLayout';
import { adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } from '../api';
import { Project, ProjectCategory } from '../types';

interface FormState {
  title: string; description: string; category: string;
  tech_stack: string; live_url: string; github_url: string;
  date_built: string; featured: boolean; is_published: boolean; order: string;
}

const empty: FormState = {
  title: '', description: '', category: 'web_app', tech_stack: '',
  live_url: '', github_url: '', date_built: '', featured: false, is_published: true, order: '0',
};

function toPayload(f: FormState) {
  return {
    ...f,
    category:   f.category as ProjectCategory,
    tech_stack: f.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    order:      Number(f.order),
  };
}

function toForm(p: Project): FormState {
  return {
    title: p.title, description: p.description, category: p.category,
    tech_stack: p.tech_stack.join(', '), live_url: p.live_url, github_url: p.github_url,
    date_built: p.date_built, featured: p.featured, is_published: !!p.is_published,
    order: String(p.order),
  };
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modal,    setModal]    = useState<'create' | 'edit' | null>(null);
  const [editing,  setEditing]  = useState<Project | null>(null);
  const [form,     setForm]     = useState<FormState>(empty);
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);

  const load = () => adminGetProjects().then(d => setProjects(d.results)).catch(console.error);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setModal('create'); setError(''); };
  const openEdit   = (p: Project) => { setForm(toForm(p)); setEditing(p); setModal('edit'); setError(''); };
  const close      = () => { setModal(null); setError(''); };

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modal === 'create') {
        await adminCreateProject(toPayload(form));
      } else if (editing) {
        await adminUpdateProject(editing.id, toPayload(form));
      }
      close();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Project) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    await adminDeleteProject(p.id);
    load();
  };

  return (
    <DashLayout>
      <div className="dash-header">
        <h1>Projects</h1>
        <button className="btn btn-blue" onClick={openCreate}>+ Add project</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th><th>Category</th><th>Featured</th>
            <th>Published</th><th>Order</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td><strong>{p.title}</strong></td>
              <td><span className={`cat-badge cat-${p.category}`}>{p.category_display}</span></td>
              <td>{p.featured ? '★' : '—'}</td>
              <td><span className={`chip ${p.is_published ? 'read' : 'unread'}`}>{p.is_published ? 'Live' : 'Draft'}</span></td>
              <td>{p.order}</td>
              <td>
                <div className="actions-row">
                  <button className="btn btn-gray btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-red  btn-sm" onClick={() => remove(p)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Add project' : 'Edit project'}</h2>
            {error && <div className="err">{error}</div>}
            <form onSubmit={save}>
              <div className="form-group"><label>Title</label>
                <input name="title" value={form.title} onChange={change} required /></div>
              <div className="form-group"><label>Description</label>
                <textarea name="description" value={form.description} onChange={change} rows={3} required /></div>
              <div className="form-group"><label>Category</label>
                <select name="category" value={form.category} onChange={change}>
                  <option value="web_app">Web App</option>
                  <option value="api">API</option>
                  <option value="tool">Tool</option>
                </select></div>
              <div className="form-group"><label>Tech stack (comma-separated)</label>
                <input name="tech_stack" value={form.tech_stack} onChange={change}
                  placeholder="Django, React, TypeScript" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label>Live URL</label>
                  <input name="live_url" value={form.live_url} onChange={change} type="url" /></div>
                <div className="form-group"><label>GitHub URL</label>
                  <input name="github_url" value={form.github_url} onChange={change} type="url" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label>Date built</label>
                  <input name="date_built" value={form.date_built} onChange={change} type="date" required /></div>
                <div className="form-group"><label>Order</label>
                  <input name="order" value={form.order} onChange={change} type="number" /></div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={change} /> Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" name="is_published" checked={form.is_published} onChange={change} /> Published
                </label>
              </div>
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