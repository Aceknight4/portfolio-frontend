import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../api';
import { Project } from '../types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getProject(Number(id)).then(setProject).catch(() => navigate('/projects'));
  }, [id, navigate]);

  if (!project) return <div className="loading">Loading...</div>;

  return (
    <div className="page-sm">
      <button className="btn btn-gray" style={{ marginBottom: '1.5rem' }}
        onClick={() => navigate('/projects')}>
        ← Back to projects
      </button>

      <span className={`cat-badge cat-${project.category}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
        {project.category_display}
      </span>

      <h1 style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{project.title}</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1.5rem' }}>
        Built {new Date(project.date_built).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </p>

      <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: '2rem' }}>{project.description}</p>

      <div style={{ marginBottom: '2rem' }}>
        <div className="section-title">Tech stack</div>
        <div className="tags" style={{ gap: 8 }}>
          {project.tech_stack.map(t => (
            <span key={t} className="tag" style={{ fontSize: 13, padding: '5px 12px' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-sky">
            ↗ Live demo
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-blue">
            ⌥ View code
          </a>
        )}
      </div>
    </div>
  );
}