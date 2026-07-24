import { useState, useEffect } from 'react';
import DashLayout from './DashLayout';
import { adminGetProjects, adminGetSkills, adminGetExperience, adminGetMessages } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experience: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      adminGetProjects(),
      adminGetSkills(),
      adminGetExperience(),
      adminGetMessages(),
    ]).then(([p, s, e, m]) => {
      setStats({
        projects:   p.count,
        skills:     s.count,
        experience: e.count,
        unread:     m.results.filter(msg => !msg.is_read).length,
      });
    }).catch(console.error);
  }, []);

  return (
    <DashLayout>
      <div className="dash-header">
        <h1>Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{stats.projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{stats.skills}</div>
          <div className="stat-label">Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{stats.experience}</div>
          <div className="stat-label">Experience entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: stats.unread > 0 ? 'var(--red)' : 'var(--blue)' }}>
            {stats.unread}
          </div>
          <div className="stat-label">Unread messages</div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
        <div className="section-title" style={{ marginBottom: '.75rem' }}>Quick links</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/dashboard/projects"   className="btn btn-blue btn-sm">Add project</a>
          <a href="/dashboard/skills"     className="btn btn-blue btn-sm">Add skill</a>
          <a href="/dashboard/experience" className="btn btn-blue btn-sm">Add experience</a>
          <a href="/dashboard/messages"   className="btn btn-gray btn-sm">View messages</a>
          <a href="/" target="_blank"     className="btn btn-gray btn-sm">View live site ↗</a>
        </div>
      </div>
    </DashLayout>
  );
}