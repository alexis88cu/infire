'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window { paypal: any; }
}

const INDUSTRIES = [
  'Fire Protection Engineering', 'Fire Alarm & Detection', 'General Contracting',
  'Architecture / Design', 'Mechanical / HVAC', 'Code Consulting / AHJ',
  'Building Owner / Developer', 'Insurance / Risk Management', 'Education / Research', 'Other',
];

const INCLUDED = [
  { icon: '📋', title: 'NFPA code updates', sub: 'Cambios en 13, 14, 20, 25 — antes de que te afecten en obra' },
  { icon: '🏗️', title: 'Field reports reales', sub: 'Lecciones de proyectos de alta complejidad en South Florida' },
  { icon: '⚖️', title: 'AHJ & inspection intel', sub: 'Lo que los inspectores están marcando este trimestre' },
  { icon: '🔬', title: 'Ingeniería aplicada', sub: 'Hidráulica, corrosión, bombas, dry pipe — casos reales' },
];

type Step = 'form' | 'payment' | 'success';

export default function SubscribePage() {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({ name: '', industry: '', email: '' });
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industry || !form.email) return;
    setStep('payment');
  };

  // Load PayPal SDK when step === payment
  useEffect(() => {
    if (step !== 'payment') return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setPaypalError('No se pudo cargar PayPal. Intenta refrescar la página.');
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [step]);

  // Render PayPal button when SDK is ready
  useEffect(() => {
    if (!paypalReady || step !== 'payment') return;

    const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

    const container = document.getElementById('paypal-button-container');
    if (!container || container.hasChildNodes()) return;

    const buttonConfig: any = planId
      // ── SUBSCRIPTION (recurring $5/year) — requires Plan ID ─────────────
      ? {
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe' },
          createSubscription: (_data: any, actions: any) =>
            actions.subscription.create({ plan_id: planId }),
          onApprove: async (data: any) => {
            // Save subscriber after PayPal confirms
            await fetch('/api/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...form, newsletter: true, paypalSubscriptionId: data.subscriptionID }),
            });
            setStep('success');
          },
          onError: () => setPaypalError('El pago no se pudo completar. Por favor intenta de nuevo.'),
        }
      // ── ONE-TIME $5 payment (sandbox / no plan ID configured yet) ───────
      : {
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay' },
          createOrder: (_data: any, actions: any) =>
            actions.order.create({
              purchase_units: [{
                amount: { value: '5.00', currency_code: 'USD' },
                description: 'Infire Weekly — Annual Subscription',
              }],
            }),
          onApprove: async (_data: any, actions: any) => {
            await actions.order.capture();
            await fetch('/api/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...form, newsletter: true }),
            });
            setStep('success');
          },
          onError: () => setPaypalError('El pago no se pudo completar. Por favor intenta de nuevo.'),
        };

    window.paypal.Buttons(buttonConfig).render('#paypal-button-container');
  }, [paypalReady, step]);

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '0.85rem 1rem', color: '#e6edf3',
    fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', color: '#adb5bd', marginBottom: '0.4rem',
  };

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (step === 'success') return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '7rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔥</div>
      <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.75rem' }}>¡Bienvenido al equipo!</h1>
      <p style={{ color: '#adb5bd', fontSize: '1rem', lineHeight: 1.75, marginBottom: '0.75rem' }}>
        Hola <strong style={{ color: '#e6edf3' }}>{form.name}</strong> — confirmamos tu suscripción a <strong style={{ color: 'var(--orange)' }}>Infire Weekly</strong>.
      </p>
      <p style={{ color: '#8a94a6', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Cada lunes recibirás 5 minutos de lo más actual en Life Safety y Fire Protection — directo a <strong style={{ color: '#adb5bd' }}>{form.email}</strong>.
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

  // ── PAYMENT STEP ─────────────────────────────────────────────────────────
  if (step === 'payment') return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '4rem 2rem' }}>
      <button
        onClick={() => { setStep('form'); setPaypalReady(false); setPaypalError(''); }}
        style={{ background: 'transparent', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '2rem', padding: 0 }}
      >
        ← Volver
      </button>

      {/* Order summary */}
      <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>Resumen</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: '#e6edf3', fontWeight: 700 }}>Infire Weekly — Acceso Anual</span>
          <span style={{ color: 'var(--orange)', fontWeight: 900, fontSize: '1.2rem' }}>$5.00</span>
        </div>
        <div style={{ color: 'var(--gray)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          52 ediciones · $0.01/día · Se renueva cada año
        </div>
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
        <div style={{ fontSize: '0.8rem', color: '#8a94a6' }}>
          Suscriptor: <strong style={{ color: '#e6edf3' }}>{form.name}</strong> · {form.email}
        </div>
      </div>

      {/* PayPal button */}
      <div style={{ marginBottom: '1rem' }}>
        {!paypalReady && !paypalError && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)', fontSize: '0.88rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>Cargando PayPal…</div>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        {paypalError && (
          <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', padding: '1rem', color: '#f08080', fontSize: '0.85rem', textAlign: 'center' }}>
            ⚠️ {paypalError}
          </div>
        )}
        <div id="paypal-button-container" />
      </div>

      <p style={{ color: 'var(--gray)', fontSize: '0.73rem', textAlign: 'center' }}>
        Pago 100% seguro a través de PayPal · Cancela cuando quieras
      </p>
    </div>
  );

  // ── FORM STEP ────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '4rem 2rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(243,121,61,0.12)', border: '1px solid rgba(243,121,61,0.3)', borderRadius: '100px', padding: '4px 16px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1.25rem' }}>
          Life Safety Weekly
        </div>
        <h1 style={{ fontSize: 'clamp(1.9rem,5vw,3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.1rem', letterSpacing: '-0.02em' }}>
          5 minutos a la semana.<br />
          <span style={{ color: 'var(--orange)' }}>Todo lo que necesitas saber</span><br />
          en Fire Protection.
        </h1>
        <p style={{ color: '#adb5bd', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto 2rem' }}>
          Cada lunes: NFPA, AHJ trends, field reports y lecciones de los proyectos más complejos de South Florida — curado por ingenieros activos, listo en 5 minutos.
        </p>

        {/* Price block */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, rgba(243,121,61,0.1), rgba(243,121,61,0.04))', border: '1px solid rgba(243,121,61,0.35)', borderRadius: '16px', padding: '1.4rem 2.5rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.4rem' }}>Acceso Anual</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '7px', color: '#e6edf3' }}>$</span>
            <span style={{ fontSize: '3.8rem', fontWeight: 900, lineHeight: 1, color: '#fff' }}>5</span>
            <span style={{ fontSize: '0.95rem', color: '#adb5bd', marginTop: '13px' }}>/año</span>
          </div>
          <div style={{ marginTop: '0.4rem', background: 'rgba(243,121,61,0.15)', borderRadius: '8px', padding: '5px 14px', color: '#f3793d', fontWeight: 800, fontSize: '0.9rem' }}>
            = $0.01 al día
          </div>
          <div style={{ marginTop: '0.6rem', color: '#8a94a6', fontSize: '0.8rem' }}>Menos que un café. Más que una consulta.</div>
        </div>

        {/* Balance */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', maxWidth: '560px', margin: '0 auto 2rem', fontSize: '0.82rem' }}>
          <div style={{ flex: 1, background: '#1a2332', padding: '1rem 1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#e6edf3', marginBottom: '0.4rem' }}>Sin suscripción</div>
            <div style={{ color: '#8a94a6', lineHeight: 1.65 }}>
              ✗ Buscando en Google qué cambió en NFPA 13<br />
              ✗ Enterándote cuando ya te afectó<br />
              ✗ Perdiendo tiempo en contenido irrelevante
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(243,121,61,0.07)', padding: '1rem 1.25rem', borderLeft: '2px solid rgba(243,121,61,0.4)' }}>
            <div style={{ fontWeight: 800, color: 'var(--orange)', marginBottom: '0.4rem' }}>Con Infire Weekly</div>
            <div style={{ color: '#adb5bd', lineHeight: 1.65 }}>
              ✓ 5 min cada lunes — curado por ingenieros<br />
              ✓ NFPA, AHJ, field reports antes que nadie<br />
              ✓ Conocimiento que aplicas el mismo día
            </div>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', maxWidth: '920px', margin: '0 auto' }}>

        {/* Left — what's included */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#e6edf3' }}>¿Qué incluye cada edición?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            {INCLUDED.map(({ icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: '1px' }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e6edf3', marginBottom: '0.15rem' }}>{title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#8a94a6', lineHeight: 1.55 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Escrito por ingenieros activos</div>
            <p style={{ fontSize: '0.81rem', color: '#8a94a6', lineHeight: 1.65, margin: 0 }}>
              No es contenido de marketing. Cada artículo sale de proyectos reales — torres de lujo, high-rises, instalaciones industriales — en los que Infire trabaja actualmente en South Florida.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.3rem' }}>Empieza hoy</h2>
          <p style={{ color: '#8a94a6', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            Acceso anual completo por <strong style={{ color: 'var(--orange)' }}>$5</strong>. Cancela cuando quieras.
          </p>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              style={{ background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', width: '100%', marginTop: '0.25rem' }}
            >
              Continuar al pago →
            </button>
            <p style={{ color: 'var(--gray)', fontSize: '0.72rem', textAlign: 'center', margin: 0 }}>
              Pago seguro vía PayPal · Sin spam · Cancela cuando quieras
            </p>
          </form>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '560px', margin: '4rem auto 0' }}>
        <p style={{ color: '#8a94a6', fontSize: '0.87rem', lineHeight: 1.7 }}>
          <strong style={{ color: '#e6edf3' }}>¿Prefieres ver primero el contenido?</strong><br />
          Lee los últimos artículos del blog — gratis, sin registro.
        </p>
        <a href="/blog" style={{ display: 'inline-block', marginTop: '0.6rem', color: 'var(--orange)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          Ver el Blog →
        </a>
      </div>
    </div>
  );
}
