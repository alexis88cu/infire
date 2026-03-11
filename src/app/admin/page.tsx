'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'infire2026';

interface Project {
  slug: string;
  projectName: string;
  address?: string;
  city?: string;
  sector?: string;
  description?: string;
  narrative?: string;
  featuredImage?: string;
  [key: string]: any;
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Project | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      fetch('/api/admin/projects')
        .then(r => r.json())
        .then(data => setProjects(data))
        .catch(() => setProjects([]));
    }
  }, [auth]);

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return !q ||
      (p.projectName || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q);
  });

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: editing.slug, updates: {
          description: editing.description,
          narrative: editing.narrative,
          featuredImage: editing.featuredImage,
        }}),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.slug === editing.slug ? { ...p, ...editing } : p));
        setSaved(editing.slug);
        setTimeout(() => setSaved(null), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '0.7rem 0.9rem', color: '#e6edf3',
    fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  // ── AUTH SCREEN ───────────────────────────────────────────────
  if (!auth) return (
    <div style={{ maxWidth: '360px', margin: '8rem auto', padding: '2rem', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Panel</h1>
      <p style={{ color: 'var(--gray)', fontSize: '0.83rem', marginBottom: '1.5rem' }}>Infire Inc. — Solo uso interno</p>
      <input
        type="password"
        placeholder="Contraseña…"
        value={pw}
        onChange={e => setPw(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && pw === ADMIN_PASSWORD && setAuth(true)}
        style={{ ...inp, marginBottom: '0.75rem', textAlign: 'center' }}
      />
      <button
        onClick={() => pw === ADMIN_PASSWORD ? setAuth(true) : alert('Contraseña incorrecta')}
        style={{ width: '100%', background: 'var(--orange)', border: 'none', borderRadius: '8px', padding: '0.8rem', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
      >
        Entrar →
      </button>
    </div>
  );

  // ── EDITOR MODAL ─────────────────────────────────────────────
  if (editing) return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem' }}>
      <button
        onClick={() => setEditing(null)}
        style={{ background: 'transparent', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem', padding: 0 }}
      >
        ← Volver al listado
      </button>

      <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{editing.projectName}</h2>
        <p style={{ color: 'var(--gray)', fontSize: '0.82rem', marginBottom: '2rem' }}>
          {editing.address} · {editing.city} · {editing.sector}
        </p>

        {/* Current image preview */}
        {editing.featuredImage && (
          <div style={{ marginBottom: '1.5rem' }}>
            <img
              src={editing.featuredImage}
              alt=""
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border)' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#adb5bd', marginBottom: '0.4rem' }}>
              URL de Imagen Principal
            </label>
            <input
              type="text"
              value={editing.featuredImage || ''}
              onChange={e => setEditing({ ...editing, featuredImage: e.target.value })}
              placeholder="/images/projects/mi-foto.jpg o URL completa"
              style={inp}
            />
            <p style={{ color: 'var(--gray)', fontSize: '0.73rem', marginTop: '0.3rem' }}>
              Puedes usar una URL de Unsplash, Wix o una ruta local /images/projects/...
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#adb5bd', marginBottom: '0.4rem' }}>
              Descripción corta (card)
            </label>
            <textarea
              value={editing.description || ''}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              placeholder="Descripción breve para la card del portfolio..."
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#adb5bd', marginBottom: '0.4rem' }}>
              Narrativa completa (página de detalle)
            </label>
            <textarea
              value={editing.narrative || ''}
              onChange={e => setEditing({ ...editing, narrative: e.target.value })}
              rows={8}
              placeholder="Descripción completa del proyecto, scope, sistemas instalados, desafíos técnicos..."
              style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1, background: loading ? 'rgba(243,121,61,0.5)' : 'var(--orange)',
              border: 'none', borderRadius: '8px', padding: '0.85rem',
              color: '#fff', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
            }}
          >
            {loading ? 'Guardando…' : '💾 Guardar cambios'}
          </button>
          <button
            onClick={() => setEditing(null)}
            style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.85rem 1.25rem', color: 'var(--gray)', cursor: 'pointer', fontWeight: 600 }}
          >
            Cancelar
          </button>
        </div>

        {saved === editing.slug && (
          <div style={{ marginTop: '1rem', background: 'rgba(111,207,151,0.1)', border: '1px solid rgba(111,207,151,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#6fcf97', fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ Cambios guardados correctamente
          </div>
        )}
      </div>
    </div>
  );

  // ── PROJECT LIST ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ color: 'var(--orange)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Admin Panel</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Gestión de Proyectos</h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{projects.length} proyectos · Edita descripciones e imágenes</p>
        </div>
        <button
          onClick={() => setAuth(false)}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          Salir
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar proyecto o ciudad…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inp, maxWidth: '400px', marginBottom: '1.5rem' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map(p => (
          <div
            key={p.slug}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'var(--dark2)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '0.9rem 1.1rem',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onClick={() => setEditing({ ...p })}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(243,121,61,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {/* Thumbnail */}
            <div style={{ width: '56px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#111827' }}>
              {p.featuredImage && (
                <img src={p.featuredImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.projectName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '1px' }}>
                {p.address} · {p.city} · <span style={{ color: 'rgba(243,121,61,0.7)' }}>{p.sector}</span>
              </div>
            </div>

            {/* Description status */}
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                background: p.description ? 'rgba(111,207,151,0.1)' : 'rgba(220,53,69,0.1)',
                color: p.description ? '#6fcf97' : '#f08080', border: `1px solid ${p.description ? 'rgba(111,207,151,0.2)' : 'rgba(220,53,69,0.2)'}`,
              }}>
                {p.description ? '✓ Con descripción' : '⚠ Sin descripción'}
              </span>
            </div>

            <div style={{ color: 'var(--gray)', fontSize: '0.8rem', flexShrink: 0 }}>✏️</div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.8rem', marginTop: '2rem' }}>
        {filtered.length} de {projects.length} proyectos · Click en cualquier fila para editar
      </p>
    </div>
  );
}
