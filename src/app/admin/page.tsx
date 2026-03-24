'use client';
import { useState, useEffect } from 'react';

const ADMIN_PASS = 'infire2026';

type Project = {
  slug: string;
  projectName: string;
  city: string;
  sector: string;
  description?: string;
  narrative?: string;
  featuredImage?: string;
};

type Subscriber = {
  id: string;
  email: string;
  name: string;
  industry: string;
  newsletter: boolean;
  createdAt: string;
};

const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.7rem 0.9rem', color: '#e6edf3', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8a94a6', marginBottom: '0.35rem' };

// ── SUBSCRIBERS TAB ──────────────────────────────────────────────────────────
function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'newsletter' | 'free'>('all');

  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSubscribers(data);
        else setError(data.error || 'Failed to load subscribers');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.email.toLowerCase().includes(q) || (s.name ?? '').toLowerCase().includes(q) || (s.industry ?? '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'newsletter' && s.newsletter) || (filter === 'free' && !s.newsletter);
    return matchSearch && matchFilter;
  });

  const newsletterCount = subscribers.filter(s => s.newsletter).length;
  const freeCount = subscribers.filter(s => !s.newsletter).length;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#7d8590' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#f3793d', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading subscribers…
    </div>
  );

  if (error) return (
    <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '10px', padding: '1.5rem', color: '#f08080', textAlign: 'center' }}>
      ⚠️ {error}
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: subscribers.length, color: '#e6edf3' },
          { label: 'Newsletter', value: newsletterCount, color: '#f3793d' },
          { label: 'Free', value: freeCount, color: '#7d8590' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7d8590', marginBottom: '0.3rem' }}>{label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search by name, email or industry…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, maxWidth: '320px', flex: 1 }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'newsletter', 'free'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: `1px solid ${filter === f ? '#f3793d' : 'var(--border)'}`, background: filter === f ? 'rgba(243,121,61,0.15)' : 'transparent', color: filter === f ? '#f3793d' : '#8a94a6', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#636e7b', marginBottom: '0.75rem' }}>{filtered.length} subscriber{filtered.length !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Industry', 'Plan', 'Joined'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.75rem', color: '#636e7b', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const displayName = s.name || '—';
              const joined = s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <td style={{ padding: '0.7rem 0.75rem', color: '#e6edf3', fontWeight: 600 }}>{displayName}</td>
                  <td style={{ padding: '0.7rem 0.75rem', color: '#adb5bd' }}>{s.email}</td>
                  <td style={{ padding: '0.7rem 0.75rem', color: '#8a94a6' }}>{s.industry || '—'}</td>
                  <td style={{ padding: '0.7rem 0.75rem' }}>
                    {s.newsletter
                      ? <span style={{ background: 'rgba(243,121,61,0.15)', color: '#f3793d', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Newsletter</span>
                      : <span style={{ background: 'rgba(125,133,144,0.15)', color: '#7d8590', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Free</span>
                    }
                  </td>
                  <td style={{ padding: '0.7rem 0.75rem', color: '#636e7b', whiteSpace: 'nowrap' }}>{joined}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#636e7b', fontSize: '0.85rem' }}>No subscribers found.</div>
        )}
      </div>
    </div>
  );
}

// ── PROJECTS TAB ─────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Project | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => setProjects(data))
      .catch(() => {});
  }, []);

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return !q || p.projectName?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: editing.slug, description: editing.description, narrative: editing.narrative, featuredImage: editing.featuredImage }),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.slug === editing.slug ? { ...p, ...editing } : p));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally { setSaving(false); }
  };

  return (
    <>
      <input
        type="text" placeholder="Search by project name, city or slug..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: '1.5rem', maxWidth: '400px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: editing ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginBottom: '0.75rem' }}>{filtered.length} projects</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {filtered.map(p => (
              <div key={p.slug}
                onClick={() => { setEditing({ ...p }); setSaved(false); }}
                style={{ background: editing?.slug === p.slug ? 'rgba(243,121,61,0.1)' : 'var(--dark2)', border: `1px solid ${editing?.slug === p.slug ? 'rgba(243,121,61,0.4)' : 'var(--border)'}`, borderRadius: '10px', padding: '0.85rem 1rem', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { if (editing?.slug !== p.slug) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { if (editing?.slug !== p.slug) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.2rem', color: '#e6edf3' }}>{p.projectName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{p.city} · {p.sector}</div>
                {p.description && <div style={{ fontSize: '0.72rem', color: '#636e7b', marginTop: '0.3rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.description?.slice(0, 80)}...</div>}
              </div>
            ))}
          </div>
        </div>

        {editing && (
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: '2rem', maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: 'var(--orange)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>Editando</div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editing.projectName}</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.2rem' }}>{editing.city} · {editing.slug}</div>
              </div>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--gray)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={lbl}>Short description (card)</label>
                <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} placeholder="Description shown on the portfolio card..." style={{ ...inp, resize: 'vertical', lineHeight: 1.55 }} />
                <div style={{ fontSize: '0.7rem', color: '#636e7b', marginTop: '0.25rem' }}>{(editing.description || '').length} caracteres · Recomendado: 80–150</div>
              </div>
              <div>
                <label style={lbl}>Narrativa (página de detalle)</label>
                <textarea value={editing.narrative || ''} onChange={e => setEditing({ ...editing, narrative: e.target.value })} rows={6} placeholder="Full project description for the detail page..." style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
                <div style={{ fontSize: '0.7rem', color: '#636e7b', marginTop: '0.25rem' }}>{(editing.narrative || '').length} caracteres</div>
              </div>
              <div>
                <label style={lbl}>Imagen principal (URL o /images/...)</label>
                <input type="text" value={editing.featuredImage || ''} onChange={e => setEditing({ ...editing, featuredImage: e.target.value })} placeholder="/images/projects/real-xxx.jpg" style={inp} />
                {editing.featuredImage && (
                  <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', height: '120px' }}>
                    <img src={editing.featuredImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.85rem', background: saved ? '#6fcf97' : 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontFamily: 'inherit', transition: 'background .3s' }}>
                  {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
                </button>
                <a href={`/portfolio/${editing.slug}`} target="_blank" style={{ padding: '0.85rem 1rem', border: '1px solid var(--border)', color: 'var(--gray)', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Ver →</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState<'projects' | 'subscribers'>('projects');

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', maxWidth: '360px', width: '100%' }}>
        <div style={{ color: 'var(--orange)', fontSize: '0.76rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>Panel de Administración</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>Infire Admin</h1>
        <label style={lbl}>Contraseña</label>
        <input
          type="password" placeholder="••••••••" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && pw === ADMIN_PASS && setAuthed(true)}
          style={{ ...inp, marginBottom: '1rem' }}
        />
        <button onClick={() => pw === ADMIN_PASS ? setAuthed(true) : alert('Incorrect password')}
          style={{ width: '100%', padding: '0.85rem', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
          Entrar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ color: 'var(--orange)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>Panel de Administración</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Infire Admin</h1>
        </div>
        <a href="/" style={{ color: 'var(--gray)', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to site</a>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        {([['projects', 'Proyectos'], ['subscribers', 'Suscriptores']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '0.7rem 1.4rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === key ? '#f3793d' : 'transparent'}`, color: tab === key ? '#f3793d' : '#7d8590', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', marginBottom: '-1px' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'projects' ? <ProjectsTab /> : <SubscribersTab />}
    </div>
  );
}
