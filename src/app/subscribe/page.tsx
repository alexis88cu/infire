'use client';
import { useState } from 'react';

const INDUSTRIES = [
  'Fire Protection Engineering','Fire Alarm & Detection','General Contracting',
  'Architecture / Design','Mechanical / HVAC','Code Consulting / AHJ',
  'Building Owner / Developer','Insurance / Risk Management','Education / Research','Other',
];

export default function SubscribePage() {
  const [form, setForm] = useState({ name: '', industry: '', email: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industry || !form.email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, newsletter: true }),
      });
      const data = await res.json();
      if (res.ok) setStatus('success');
      else { setStatus('error'); setErrorMsg(data.message || 'Something went wrong.'); }
    } catch { setStatus('error'); setErrorMsg('Network error. Please try again.'); }
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
    padding: '0.9rem 1.1rem', color: '#e6edf3', fontSize: '0.93rem',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, color: '#8a94a6', marginBottom: '0.4rem',
  };

  if (status === 'success') return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🔥</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>Bienvenido al equipo</h1>
        <p style={{ color: 'var(--gray)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          Tu suscripción está activa. Cada semana recibirás lo más relevante de Life Safety &amp; Fire Protection — en 5 minutos o menos.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/blog" style={{ padding: '0.75rem 1.5rem', background: 'var(--orange)', color: '#fff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>Ver el Blog</a>
          <a href="/" style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border)', color: 'var(--gray)', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>Inicio</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(160deg,#0d1117 0%,#111827 60%,#1a1207 100%)', borderBottom: '1px solid var(--border)', padding: '5rem 2rem 4.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '350px', background: 'radial-gradient(ellipse,rgba(243,121,61,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ color: 'var(--orange)', fontSize: '0.76rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 700 }}>Infire Weekly · Life Safety Intelligence</div>

        <h1 style={{ fontSize: 'clamp(1.9rem,5vw,3rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.25rem', maxWidth: '700px', margin: '0 auto 1.25rem' }}>
          5 minutos a la semana.<br/>
          <span style={{ color: 'var(--orange)' }}>Todo lo que necesitas saber</span><br/>
          de Fire Protection &amp; Life Safety.
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#adb5bd', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Mientras otros gastan horas buscando actualizaciones de NFPA y cambios de código —<br/>
          <strong style={{ color: '#e6edf3' }}>tú los recibes curados, listos para aplicar, cada lunes.</strong>
        </p>

        {/* THE SCALE */}
        <div style={{ display: 'inline-block', background: 'rgba(243,121,61,0.08)', border: '1px solid rgba(243,121,61,0.25)', borderRadius: '16px', padding: '1.5rem 2.5rem', maxWidth: '520px', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem', fontWeight: 700 }}>La decisión más fácil del año</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#8a94a6', marginBottom: '0.2rem' }}>Lo que pagas</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--orange)', lineHeight: 1 }}>$5</div>
              <div style={{ fontSize: '0.72rem', color: '#8a94a6' }}>al año completo</div>
            </div>
            <div style={{ fontSize: '1.8rem' }}>⚖️</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', color: '#8a94a6', marginBottom: '0.2rem' }}>Lo que obtienes</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6fcf97', lineHeight: 1 }}>52</div>
              <div style={{ fontSize: '0.72rem', color: '#8a94a6' }}>ediciones / año</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.85rem', marginTop: '0.85rem', fontSize: '0.9rem', color: '#adb5bd' }}>
            <span style={{ color: 'var(--orange)', fontWeight: 800 }}>$0.01 al día.</span> Menos que el minuto que tardas en leer esto.
          </div>
        </div>
        <div><span style={{ fontSize: '0.8rem', color: '#636e7b' }}>Sin renovación automática sorpresa · Cancela cuando quieras</span></div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* What you get */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ color: 'var(--orange)', fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>Qué incluye cada edición</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Inteligencia técnica lista para usar</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {[
            { icon: '📋', title: 'Cambios NFPA', sub: 'Actualizaciones de 13, 14, 20, 25 y más — antes de que lleguen a obra' },
            { icon: '🏗️', title: 'Field Reports', sub: 'Casos reales de proyectos de alta complejidad en South Florida' },
            { icon: '⚖️', title: 'AHJ & Inspections', sub: 'Lo que los inspectores están observando este trimestre en tu mercado' },
            { icon: '🔬', title: 'Ingeniería Aplicada', sub: 'Hidráulica, corrosión, bombas, sistemas especiales — sin teoría inútil' },
          ].map(item => (
            <div key={item.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem', color: '#e6edf3' }}>{item.title}</div>
              <div style={{ color: '#8a94a6', fontSize: '0.78rem', lineHeight: 1.55 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginBottom: '3.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '1.5rem', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#636e7b', fontWeight: 700, marginBottom: '1rem' }}>❌ Sin Infire Weekly</div>
              {['Horas buscando cambios de código','Te enteras del cambio NFPA cuando ya impacta tu diseño','Revisas múltiples fuentes para obtener lo mismo','Sin contexto AHJ para tu mercado específico'].map((t,i) => (
                <div key={i} style={{ color: '#636e7b', fontSize: '0.82rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.5 }}>{t}</div>
              ))}
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--orange)', fontWeight: 700, marginBottom: '1rem' }}>✅ Con Infire Weekly</div>
              {['5 min los lunes · listo para toda la semana','Cambios digeridos con sus implicaciones reales en campo','Una sola fuente curada por ingenieros activos','Insights de AHJ de South Florida y mercados clave'].map((t,i) => (
                <div key={i} style={{ color: '#adb5bd', fontSize: '0.82rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.5 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div style={{ background: 'linear-gradient(135deg,rgba(243,121,61,0.07) 0%,rgba(17,24,39,0.8) 100%)', border: '1px solid rgba(243,121,61,0.22)', borderRadius: '20px', padding: '2.5rem', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 700, marginBottom: '0.5rem' }}>Suscríbete ahora</div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, marginBottom: '0.35rem' }}>52 ediciones. $5 al año.</h2>
            <p style={{ color: '#8a94a6', fontSize: '0.82rem' }}>$0.01 al día por mantenerte al frente de la industria.</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label style={lbl}>Nombre completo</label><input name="name" type="text" placeholder="Tu nombre" value={form.name} onChange={handleChange} required style={inp} /></div>
            <div>
              <label style={lbl}>Industria</label>
              <select name="industry" value={form.industry} onChange={handleChange} required style={{ ...inp, appearance: 'none' as any, cursor: 'pointer' }}>
                <option value="">Selecciona tu industria...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Email profesional</label><input name="email" type="email" placeholder="tu@empresa.com" value={form.email} onChange={handleChange} required style={inp} /></div>
            {status === 'error' && <div style={{ background: 'rgba(235,87,87,0.1)', border: '1px solid rgba(235,87,87,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#eb5757', fontSize: '0.85rem' }}>{errorMsg}</div>}
            <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '1rem', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 800, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit', letterSpacing: '0.02em' }}>
              {status === 'loading' ? 'Procesando...' : 'Suscribirme por $5/año →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#636e7b', lineHeight: 1.5 }}>Al suscribirte aceptas recibir el newsletter semanal de Infire Inc.<br/>Sin spam · Sin renovación automática.</p>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: '#636e7b', fontSize: '0.8rem' }}>Leído por ingenieros, contratistas y propietarios en Miami · Fort Lauderdale · Tampa · Orlando y más.</p>
        </div>
      </div>
    </div>
  );
}
