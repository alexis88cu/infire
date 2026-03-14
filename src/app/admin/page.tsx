'use client';
import { useState, useEffect } from 'react';

// Password protection
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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Project | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authed) {
      fetch('/api/admin/projects')
        .then(r => r.json())
        .then(data => setProjects(data))
        .catch(() => {});
    }
  }, [authed]);

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

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.7rem 0.9rem', color: '#e6edf3', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const lbl: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8a94a6', marginBottom: '0.35rem' };

  // Login screen
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Editar Proyectos</h1>
        </div>
        <a href="/" style={{ color: 'var(--gray)', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to site</a>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Search by project name, city or slug..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: '1.5rem', maxWidth: '400px' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: editing ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Project list */}
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginBottom: '0.75rem' }}>{filtered.length} projects</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {filtered.map(p => (
              <div key={p.slug}
                onClick={() => { setEditing({ ...p }); setSaved(false); }}
                style={{
                  background: editing?.slug === p.slug ? 'rgba(243,121,61,0.1)' : 'var(--dark2)',
                  border: `1px solid ${editing?.slug === p.slug ? 'rgba(243,121,61,0.4)' : 'var(--border)'}`,
                  borderRadius: '10px', padding: '0.85rem 1rem',
                  cursor: 'pointer', transition: 'all .15s',
                }}
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

        {/* Edit panel */}
        {editing && (
          <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: '2rem', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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
                <textarea
                  value={editing.description || ''}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  placeholder="Description shown on the portfolio card..."
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.55 }}
                />
                <div style={{ fontSize: '0.7rem', color: '#636e7b', marginTop: '0.25rem' }}>{(editing.description || '').length} caracteres · Recomendado: 80–150</div>
              </div>

              <div>
                <label style={lbl}>Narrativa (página de detalle)</label>
                <textarea
                  value={editing.narrative || ''}
                  onChange={e => setEditing({ ...editing, narrative: e.target.value })}
                  rows={6}
                  placeholder="Full project description for the detail page..."
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
                />
                <div style={{ fontSize: '0.7rem', color: '#636e7b', marginTop: '0.25rem' }}>{(editing.narrative || '').length} caracteres</div>
              </div>

              <div>
                <label style={lbl}>Imagen principal (URL o /images/...)</label>
                <input
                  type="text"
                  value={editing.featuredImage || ''}
                  onChange={e => setEditing({ ...editing, featuredImage: e.target.value })}
                  placeholder="/images/projects/real-xxx.jpg"
                  style={inp}
                />
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
    </div>
  );
}
