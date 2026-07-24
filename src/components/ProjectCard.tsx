import { Project } from '../types';
import './ProjectCard.css';

interface Props {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  const catClass = `bp-cat-${project.category}`;
  const catLabel = project.category_display || project.category;

  return (
    <div className="bp-project-card" onClick={onClick}>
      <span className={`bp-project-card__category ${catClass}`}>{catLabel}</span>
      <h3 className="bp-project-card__title">{project.title}</h3>
      <p className="bp-project-card__desc">{project.description}</p>

      <div className="bp-project-card__tags">
        {project.tech_stack.slice(0, 5).map(t => (
          <span key={t} className="bp-chip">{t}</span>
        ))}
        {project.tech_stack.length > 5 && (
          <span className="bp-chip">+{project.tech_stack.length - 5}</span>
        )}
      </div>

      <div className="bp-project-card__footer">
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="bp-project-card__link"
            onClick={e => e.stopPropagation()}
          >
            ↗ Live demo
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="bp-project-card__link"
            onClick={e => e.stopPropagation()}
          >
            ⌥ GitHub
          </a>
        )}
        <span className="bp-project-card__date">
          {new Date(project.date_built).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}