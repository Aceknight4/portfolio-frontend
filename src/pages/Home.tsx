import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getProjects } from '../api';
import { Profile, Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import './Home.css';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featured, setFeatured] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
    getProjects({ featured: 'true' })
      .then(d => setFeatured(d.results))
      .catch(console.error);
  }, []);

  const whyItems = [
    {
      title: 'Security-first thinking',
      desc: 'Every application I build benefits from a cybersecurity background. I think about auth, permissions, and data protection by default.',
    },
    {
      title: 'Full-stack delivery',
      desc: 'From Django REST API to React TypeScript frontend — I deliver complete, working products, not just pieces.',
    },
    {
      title: 'Remote-ready',
      desc: 'Experienced working with distributed teams. Clear communication, regular updates, and professional documentation.',
    },
    {
      title: 'Results focused',
      desc: 'I start every project by understanding your goal, not the technology. The tech serves the outcome.',
    },
  ];

  const stats = [
    { num: '6+', label: 'Projects built' },
    { num: '2+', label: 'Years experience' },
    { num: '15+', label: 'Technologies' },
    { num: '1', label: 'ISO/IEC 27001 cert' },
  ];

  return (
    <div className="bp-page">
      {/* — HERO — */}
      <section className="bp-hero">
        <div className="bp-hero__inner">
          {profile?.available_for_work && (
            <div className="bp-hero__badge">
              <span className="bp-hero__dot" />
              Available for freelance work
            </div>
          )}
          <h1 className="bp-hero__title">
            {profile?.name.split(' ').slice(0, 2).join(' ') ?? 'Anel Graph'}
            <br />
            <span className="bp-hero__role">Full-stack developer</span>
          </h1>
          <p className="bp-hero__sub">{profile?.headline}</p>
          <p className="bp-hero__location">{profile?.location} · Open to remote &amp; relocation</p>
          {profile?.bio && <p className="bp-hero__bio">{profile.bio}</p>}
          <div className="bp-hero__actions">
            <a href="/projects" className="bp-btn bp-btn--primary">View my work</a>
            <a href="/contact" className="bp-btn bp-btn--secondary">Hire me</a>
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="bp-btn bp-btn--secondary">
                GitHub ↗
              </a>
            )}
          </div>
        </div>
        <svg className="bp-hero__blueprint" viewBox="0 0 400 400" aria-hidden="true">
          <g stroke="#0B5D6B" strokeWidth={1} fill="none">
            <circle cx="300" cy="90" r="4" />
            <circle cx="340" cy="180" r="4" />
            <circle cx="260" cy="220" r="4" />
            <circle cx="330" cy="290" r="4" />
            <line x1="300" y1="90" x2="340" y2="180" />
            <line x1="340" y1="180" x2="260" y2="220" />
            <line x1="260" y1="220" x2="330" y2="290" />
            <rect x="240" y="60" width="140" height="260" strokeDasharray="2 4" />
          </g>
        </svg>
      </section>

      {/* — FEATURED PROJECTS — */}
      {featured.length > 0 && (
        <section className="bp-projects-section">
          <div className="bp-projects-section__head">
            <h2>Featured projects</h2>
            <p>Things I've built — click any card to see more</p>
          </div>
          <div className="bp-projects-grid">
            {featured.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => navigate(`/projects/${p.id}`)} />
            ))}
          </div>
          <div className="bp-projects-section__cta">
            <a href="/projects" className="bp-btn bp-btn--secondary">See all projects →</a>
          </div>
        </section>
      )}

      {/* — WHY WORK WITH ME — */}
      <section className="bp-why-section">
        <h2>Why work with me</h2>
        <div className="bp-why-grid">
          {whyItems.map((item, i) => (
            <div className="bp-why-card" key={item.title}>
              <div className="bp-why-card__index">{String(i + 1).padStart(2, '0')}</div>
              <div className="bp-why-card__title">{item.title}</div>
              <div className="bp-why-card__desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* — STATS — */}
      <section className="bp-stats-section">
        <div className="bp-stats-grid">
          {stats.map(s => (
            <div key={s.label}>
              <div className="bp-stats-num">{s.num}</div>
              <div className="bp-stats-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}