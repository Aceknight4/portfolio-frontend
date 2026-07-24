import { useState, FormEvent, useEffect } from 'react';
import { sendContact, getProfile } from '../api';
import { Profile } from '../types';

export default function Contact() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
  }, []);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Get in touch</h1>
        <p>Have a project in mind? Let's talk.</p>
      </div>

      <div className="contact-grid">

        {/* ── Left side ──────────────────────── */}
        <div className="contact-info">
          <h2>Let's work together</h2>
          <p>
            I'm available for freelance contracts, remote positions,
            and relocation. Whether you need a web application, a
            REST API, or security automation — reach out and I'll
            respond within 24 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} style={linkStyle}>
                <div style={iconBox('#eff6ff', '#1d4ed8')}>@</div>
                <div>
                  <div style={linkLabel}>Email</div>
                  <div style={linkValue}>{profile.email}</div>
                </div>
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" style={linkStyle}>
                <div style={iconBox('#f0fdf4', '#15803d')}>gh</div>
                <div>
                  <div style={linkLabel}>GitHub</div>
                  <div style={linkValue}>github.com/Aceknight4</div>
                </div>
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={linkStyle}>
                <div style={iconBox('#eff6ff', '#1d4ed8')}>in</div>
                <div>
                  <div style={linkLabel}>LinkedIn</div>
                  <div style={linkValue}>Seppo Anel Graph Mbake</div>
                </div>
              </a>
            )}
            {profile?.location && (
              <div style={linkStyle}>
                <div style={iconBox('#fdf4ff', '#7e22ce')}>📍</div>
                <div>
                  <div style={linkLabel}>Location</div>
                  <div style={linkValue}>{profile.location}</div>
                </div>
              </div>
            )}
          </div>

          {/* availability card */}
          {profile?.available_for_work && (
            <div style={{
              marginTop: '2rem',
              background: 'linear-gradient(135deg, #0f172a, #1a3a5c)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>Currently available</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.6 }}>
                Open to freelance contracts, remote positions, and relocation to Europe or within Africa.
              </p>
            </div>
          )}
        </div>

        {/* ── Right side — form ──────────────── */}
        <div className="contact-form">
          {status === 'sent' && (
            <div className="success">
              ✓ Message sent. I'll be in touch within 24 hours.
            </div>
          )}
          {status === 'error' && (
            <div className="err">Something went wrong. Try again or email me directly.</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your name</label>
              <input name="name" value={form.name} onChange={change} required placeholder="John Smith" />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input name="email" type="email" value={form.email} onChange={change} required placeholder="john@company.com" />
            </div>
            <div className="form-group">
              <label>Tell me about your project</label>
              <textarea name="message" value={form.message} onChange={change} required rows={6}
                placeholder="What do you need built? What's your timeline and budget?" />
            </div>
            <button type="submit" className="btn btn-blue"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send message →'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  textDecoration: 'none',
  color: 'var(--text)',
};

const linkLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  marginBottom: 2,
};

const linkValue: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text)',
  fontWeight: 500,
};

const iconBox = (bg: string, color: string): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  background: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
  flexShrink: 0,
});