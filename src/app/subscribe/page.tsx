'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Fire Protection Engineering',
  'Fire Alarm & Detection',
  'General Contracting',
  'Architecture / Design',
  'Mechanical / HVAC',
  'Code Consulting / AHJ',
  'Building Owner / Developer',
  'Insurance / Risk Management',
  'Education / Research',
  'Other',
];

const INCLUDED = [
  { icon: '📋', title: 'NFPA code changes', sub: 'Actualizaciones de 13, 14, 20, 25 y más — antes de que te afecten en obra' },
  { icon: '🏗️', title: 'Field reports reales', sub: 'Casos y lecciones de proyectos de alta complejidad en South Florida' },
  { icon: '⚖️', title: 'AHJ & inspection insights', sub: 'Lo que los inspectores están observando este trimestre' },
  { icon: '🔬', title: 'Ingeniería aplicada', sub: 'Diseño de sistemas, cálculos hidráulicos, corrosión, bombas y más' },
];

export default function SubscribePage() {
  const [form, setForm] = useState({ name: '', industry: '', email: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industry || !form.email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, newsletter: true }),
      });
      const data = await res.json();
      if (res.ok) setStatus('success');
      else { setStatus('error'); setErrorMsg(data.message || 'Something went wrong.'); }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '0.85rem 1rem', color: '#e6edf3',
    fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', color: '#adb5bd', marginBottom: '0.4rem',
  };

  if (status === 'success') return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '7rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔥</div>
      <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.75rem' }}>¡Bienvenido al equipo!</h1>
      <p style={{ color: '#adb5bd', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Cada semana recibirás 5 minutos de lo más actual en Life Safety y Fire Protection — en tu bandeja de entrada, listo para leer con el café del lunes.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/blog" style={{ background: 'var(--orange)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
          Leer el Blog →
        </a>
        <a href="/" style={{ background: 'rgba(255,255,255,0.06)', color: '#e6edf3', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
          Volver al inicio
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>

      {/* ── HERO SLOGAN ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(243,121,61,0.12)', border: '1px solid rgba(243,121,61,0.3)', borderRadius: '100px', padding: '4px 16px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1.25rem' }}>
          Life Safety Weekly
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
          5 minutos a la semana.<br />
          <span style={{ color: 'var(--orange)' }}>Todo lo que necesitas saber</span><br />
          en Fire Protection.
        </h1>
        <p style={{ color: '#adb5bd', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Cada lunes recibes un briefing de ingeniería de protección contra incendios: código NFPA, reportes de campo, tendencias de AHJ y lecciones de los proyectos más complejos de South Florida.
        </p>

        {/* ── PRICE ANCHOR ───────────────────────────────────────── */}
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(243,121,61,0.1), rgba(243,121,61,0.04))',
          border: '1px solid rgba(243,121,61,0.35)', borderRadius: '16px',
          padding: '1.5rem 2.5rem', marginBottom: '0.75rem',
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.5rem' }}>Acceso Anual</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '8px', color: '#e6edf3' }}>$</span>
            <span style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>5</span>
            <span style={{ fontSize: '1rem', color: '#adb5bd', marginTop: '14px' }}>/año</span>
          </div>
          <div style={{ marginTop: '0.5rem', background: 'rgba(243,121,61,0.15)', borderRadius: '8px', padding: '6px 14px', color: '#f3793d', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
            = $0.01 al día
          </div>
          <div style={{ marginTop: '0.75rem', color: '#8a94a6', fontSize: '0.82rem' }}>
            Menos que un café. Más que una consulta.
          </div>
        </div>

        {/* ── BALANCE VISUAL ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'stretch', gap: '1px',
          background: 'var(--border)', borderRadius: '12px', overflow: 'hidden',
          maxWidth: '580px', margin: '0 auto 2.5rem', fontSize: '0.85rem',
        }}>
          <div style={{ flex: 1, background: '#1a2332', padding: '1rem 1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#e6edf3', marginBottom: '0.4rem' }}>Sin suscripción</div>
            <div style={{ color: '#8a94a6', lineHeight: 1.6, fontSize: '0.82rem' }}>
              ✗ Buscando en Google qué cambió en NFPA 13<br />
              ✗ Enterándote de los cambios cuando ya te afectaron<br />
              ✗ Perdiendo tiempo en contenido irrelevante
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(243,121,61,0.07)', padding: '1rem 1.25rem', borderLeft: '2px solid rgba(243,121,61,0.4)' }}>
            <div style={{ fontWeight: 800, color: 'var(--orange)', marginBottom: '0.4rem' }}>Con Infire Weekly</div>
            <div style={{ color: '#adb5bd', lineHeight: 1.6, fontSize: '0.82rem' }}>
              ✓ 5 min cada lunes — curado por ingenieros<br />
              ✓ NFPA, AHJ, field reports antes que nadie<br />
              ✓ Conocimiento que aplicas el mismo día
            </div>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN LAYOUT ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', maxWidth: '960px', margin: '0 auto' }}>

        {/* Left: what's included */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#e6edf3' }}>¿Qué incluye cada edición?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {INCLUDED.map(({ icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e6edf3', marginBottom: '0.2rem' }}>{title}</div>
                  <div style={{ fontSize: '0.82rem', color: '#8a94a6', lineHeight: 1.55 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Escrito por ingenieros activos</div>
            <p style={{ fontSize: '0.83rem', color: '#8a94a6', lineHeight: 1.6, margin: 0 }}>
              No es contenido de marketing. Cada artículo sale de proyectos reales — torres de lujo, high-rises, instalaciones industriales — en los que Infire trabaja actualmente.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Empieza hoy</h2>
          <p style={{ color: '#8a94a6', fontSize: '0.83rem', marginBottom: '1.5rem' }}>
            Acceso anual por <strong style={{ color: 'var(--orange)' }}>$5</strong>. Cancela cuando quieras.
          </p>

          {status === 'error' && (
            <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', padding: '0.85rem', color: '#f08080', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={lbl}>Nombre completo *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" style={inp} />
            </div>
            <div>
              <label style={lbl}>Industria *</label>
              <select name="industry" value={form.industry} onChange={handleChange} required style={{ ...inp, cursor: 'pointer' }}>
                <option value="" disabled>Selecciona tu industria…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="tu@empresa.com" style={inp} />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                background: status === 'loading' ? 'rgba(243,121,61,0.5)' : 'var(--orange)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '1rem', fontWeight: 800, fontSize: '1rem',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer', width: '100%',
                marginTop: '0.25rem',
              }}
            >
              {status === 'loading' ? 'Procesando…' : 'Suscribirme por $5/año →'}
            </button>

            <p style={{ color: 'var(--gray)', fontSize: '0.73rem', textAlign: 'center', margin: 0 }}>
              Facturado anualmente · Cancela cuando quieras · Sin spam
            </p>
          </form>
        </div>
      </div>

      {/* ── BOTTOM CTA ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '600px', margin: '4rem auto 0' }}>
        <p style={{ color: '#8a94a6', fontSize: '0.88rem', lineHeight: 1.7 }}>
          <strong style={{ color: '#e6edf3' }}>¿Prefieres ver antes de suscribirte?</strong><br />
          Lee los últimos artículos del blog — gratis, sin registro.
        </p>
        <a href="/blog" style={{ display: 'inline-block', marginTop: '0.75rem', color: 'var(--orange)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
          Ver el Blog →
        </a>
      </div>
    </div>
  );
}
