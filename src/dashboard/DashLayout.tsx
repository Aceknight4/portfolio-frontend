import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/dashboard',            label: '◻ Overview'   },
  { path: '/dashboard/projects',   label: '◈ Projects'   },
  { path: '/dashboard/skills',     label: '◉ Skills'     },
  { path: '/dashboard/experience', label: '◷ Experience' },
  { path: '/dashboard/messages',   label: '✉ Messages'   },
  { path: '/dashboard/profile',    label: '◎ Profile'    },
];

export default function DashLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div style={{ padding: '0 1.25rem 1.25rem', borderBottom: '1px solid var(--border)', marginBottom: '.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--blue)' }}>CMS Dashboard</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Anel Graph Portfolio</div>
        </div>
        {NAV.map(n => (
          <Link
            key={n.path}
            to={n.path}
            className={`dash-nav-item ${pathname === n.path ? 'active' : ''}`}
          >
            {n.label}
          </Link>
        ))}
      </aside>
      <main className="dash-content">{children}</main>
    </div>
  );
}