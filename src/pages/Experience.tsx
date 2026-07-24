import { useState, useEffect } from 'react';
import { getExperience } from '../api';
import { Experience } from '../types';

function formatDate(date: string | null, isCurrent: boolean): string {
  if (isCurrent) return 'Present';
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function ExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);

  useEffect(() => {
    getExperience().then(d => setExperience(d.results)).catch(console.error);
  }, []);

  return (
    <div className="page-sm">
      <div className="page-header">
        <h1>Work Experience</h1>
        <p>My professional background and career history</p>
      </div>

      <div className="timeline">
        {experience.map(exp => (
          <div key={exp.id} className="timeline-item">
            <div className={`timeline-dot ${exp.is_current ? 'current' : ''}`} />
            <div className="dates">
              {formatDate(exp.start_date, false)} — {formatDate(exp.end_date, exp.is_current)}
              {exp.is_current && (
                <span style={{ marginLeft: 8, background: '#f0fdf4', color: '#16a34a', fontSize: 10, padding: '2px 8px', borderRadius: 99 }}>
                  Current
                </span>
              )}
            </div>
            <div className="role">{exp.role}</div>
            <div className="company">{exp.company}</div>
            <div className="desc">{exp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}