import { useState, useEffect } from 'react';
import { getSkills } from '../api';
import { Skill, SkillCategory } from '../types';

const CATEGORY_ORDER: SkillCategory[] = ['backend', 'frontend', 'database', 'tools'];
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  backend:  'Backend',
  frontend: 'Frontend',
  database: 'Database',
  tools:    'Tools & DevOps',
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills().then(d => setSkills(d.results)).catch(console.error);
  }, []);

  const grouped = CATEGORY_ORDER.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header">
        <h1>Skills & Tech Stack</h1>
        <p>Technologies I work with — ordered by proficiency</p>
      </div>

      <div className="skills-grid">
        {CATEGORY_ORDER.map(cat => (
          grouped[cat].length > 0 && (
            <div className="skill-group" key={cat}>
              <h3>{CATEGORY_LABELS[cat]}</h3>
              {grouped[cat].map(s => (
                <div key={s.id} className="skill-badge">
                  <span>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {s.proficiency_display}
                    </span>
                    <div className={`prof-dot prof-${s.proficiency}`} />
                  </div>
                </div>
              ))}
            </div>
          )
        ))}
      </div>

      <div style={{ marginTop: '3rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <div className="section-title">Proficiency legend</div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {(['beginner', 'intermediate', 'advanced'] as const).map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <div className={`prof-dot prof-${p}`} />
              <span style={{ textTransform: 'capitalize' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}