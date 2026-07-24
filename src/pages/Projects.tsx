import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';

const FILTERS: { label: string; value: string }[] = [
  { label: 'All',      value: '' },
  { label: 'Web Apps', value: 'web_app' },
  { label: 'APIs',     value: 'api' },
  { label: 'Tools',    value: 'tool' },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filter) params['category'] = filter;
    getProjects(params)
      .then(d => setProjects(d.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
        <p>Security tools, web applications, and APIs I've built</p>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <div className="loading">Loading projects...</div>}

      {!loading && projects.length === 0 && (
        <div className="empty">No projects found.</div>
      )}

      <div className="cards-grid">
        {projects.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            onClick={() => navigate(`/projects/${p.id}`)}
          />
        ))}
      </div>
    </div>
  );
}