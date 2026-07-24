import { useState, useEffect } from 'react';
import DashLayout from './DashLayout';
import { adminGetMessages, adminMarkRead, adminDeleteMessage } from '../api';
import { ContactMessage } from '../types';

export default function MessagesInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => adminGetMessages().then(d => setMessages(d.results)).catch(console.error);
  useEffect(() => { load(); }, []);

  const markRead = async (m: ContactMessage) => {
    if (m.is_read) return;
    await adminMarkRead(m.id);
    load();
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm('Delete this message?')) return;
    await adminDeleteMessage(m.id);
    setSelected(null);
    load();
  };

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <DashLayout>
      <div className="dash-header">
        <h1>
          Messages {unread > 0 && <span className="unread-badge">{unread} unread</span>}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
        {/* message list */}
        <div>
          {messages.length === 0 && <div className="empty">No messages yet.</div>}
          {messages.map(m => (
            <div
              key={m.id}
              onClick={() => { setSelected(m); markRead(m); }}
              style={{
                padding: '12px 14px',
                background: selected?.id === m.id ? '#eff6ff' : 'var(--surface)',
                border: `1px solid ${selected?.id === m.id ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: 8,
                cursor: 'pointer',
                marginBottom: 8,
                transition: 'all .15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <strong style={{ fontSize: 14 }}>{m.name}</strong>
                {!m.is_read && <span className="unread-badge">New</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{m.email}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {m.message}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                {new Date(m.submitted_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        {/* message detail */}
        <div>
          {selected ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: 18, marginBottom: 2 }}>{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: 13 }}>{selected.email}</a>
                </div>
                <button className="btn btn-red btn-sm" onClick={() => remove(selected)}>Delete</button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1.25rem' }}>
                {new Date(selected.submitted_at).toLocaleString()}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>{selected.message}</p>
              <div style={{ marginTop: '1.5rem' }}>
                <a href={`mailto:${selected.email}?subject=Re: Your enquiry`}
                   className="btn btn-blue">
                  Reply via email →
                </a>
              </div>
            </div>
          ) : (
            <div className="empty">Select a message to read it</div>
          )}
        </div>
      </div>
    </DashLayout>
  );
}