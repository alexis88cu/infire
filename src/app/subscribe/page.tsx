'use client';

import { useState, useEffect } from 'react';

declare global { interface Window { paypal: any; } }

const INDUSTRIES = [
  'Fire Protection Engineering', 'Fire Alarm & Detection', 'General Contracting',
  'Architecture / Design', 'Mechanical / HVAC', 'Code Consulting / AHJ',
  'Building Owner / Developer', 'Insurance / Risk Management', 'Education / Research', 'Other',
];

type Step = 'form' | 'payment' | 'success';
type Plan = 'free' | 'newsletter';

export default function SubscribePage() {
  const [step, setStep] = useState<Step>('form');
  const [plan, setPlan] = useState<Plan>('newsletter');
  const [form, setForm] = useState({ name: '', industry: '', email: '' });
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industry || !form.email) return;
    if (plan === 'free') {
      setSubmitting(true);
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, newsletter: false }),
      });
      setSubmitting(false);
      setStep('success');
    } else {
      setStep('payment');
    }
  };

  useEffect(() => {
    if (step !== 'payment') return;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setPaypalError('Could not load PayPal. Please refresh and try again.');
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, [step]);

  useEffect(() => {
    if (!paypalReady || step !== 'payment') return;
    const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;
    const container = document.getElementById('paypal-button-container');
    if (!container || container.hasChildNodes()) return;

    const cfg: any = planId
      ? {
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe' },
          createSubscription: (_d: any, actions: any) => actions.subscription.create({ plan_id: planId }),
          onApprove: async (data: any) => {
            await fetch('/api/subscribe', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...form, newsletter: true, paypalSubscriptionId: data.subscriptionID }),
            });
            setStep('success');
          },
          onError: () => setPaypalError('Payment could not be completed. Please try again.'),
        }
      : {
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay' },
          createOrder: (_d: any, actions: any) => actions.order.create({
            purchase_units: [{ amount: { value: '5.00', currency_code: 'USD' }, description: 'Infire Weekly — Annual Subscription' }],
          }),
          onApprove: async (_d: any, actions: any) => {
            await actions.order.capture();
            await fetch('/api/subscribe', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...form, newsletter: true }),
            });
            setStep('success');
          },
          onError: () => setPaypalError('Payment could not be completed. Please try again.'),
        };

    window.paypal.Buttons(cfg).render('#paypal-button-container');
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

  // ── SUCCESS ─────────────────────────────────────────────────────────────────
  if (step === 'success') return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '7rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔥</div>
      <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.75rem' }}>You're in!</h1>
      {plan === 'newsletter' ? (
        <>
          <p style={{ color: '#adb5bd', fontSize: '1rem', lineHeight: 1.75, marginBottom: '0.75rem' }}>
            Welcome, <strong style={{ color: '#e6edf3' }}>{form.name}</strong> — your <strong style={{ color: 'var(--orange)' }}>Infire Weekly</strong> subscription is confirmed.
          </p>
          <p style={{ color: '#8a94a6', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Every week you'll get 5 minutes of the latest in Life Safety and Fire Protection — straight to <strong style={{ color: '#adb5bd' }}>{form.email}</strong>.
          </p>
        </>
      ) : (
        <>
          <p style={{ color: '#adb5bd', fontSize: '1rem', lineHeight: 1.75, marginBottom: '0.75rem' }}>
            Welcome, <strong style={{ color: '#e6edf3' }}>{form.name}</strong> — you're now part of the Infire community.
          </p>
          <p style={{ color: '#8a94a6', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Browse all our articles at <strong style={{ color: '#adb5bd' }}>{form.email}</strong>. Upgrade to Weekly any time.
          </p>
        </>
      )}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/blog" style={{ background: 'var(--orange)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
          Read the Blog →
        </a>
        <a href="/" style={{ background: 'rgba(255,255,255,0.06)', color: '#e6edf3', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
          Back to Home
        </a>
      </div>
    </div>
  );

  // ── PAYMENT ──────────────────────────────────────────────────────────────────
  if (step === 'payment') return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '4rem 2rem' }}>
      <button onClick={() => { setStep('form'); setPaypalReady(false); setPaypalError(''); }}
        style={{ background: 'transparent', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '2rem', padding: 0 }}>
        ← Back
      </button>
      <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>Order Summary</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: '#e6edf3', fontWeight: 700 }}>Infire Weekly — Annual Access</span>
          <span style={{ color: 'var(--orange)', fontWeight: 900, fontSize: '1.2rem' }}>$5.00</span>
        </div>
        <div style={{ color: 'var(--gray)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>52 issues per year · $0.01/day · Renews annually</div>
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
        <div style={{ fontSize: '0.8rem', color: '#8a94a6' }}>
          Subscriber: <strong style={{ color: '#e6edf3' }}>{form.name}</strong> · {form.email}
        </div>
      </div>
      {!paypalReady && !paypalError && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)', fontSize: '0.88rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>Loading PayPal…</div>
          <div style={{ width: '28px', height: '28px', border: '3px solid var(--border)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {paypalError && (
        <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', padding: '1rem', color: '#f08080', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>
          ⚠️ {paypalError}
        </div>
      )}
      <div id="paypal-button-container" />
      <p style={{ color: 'var(--gray)', fontSize: '0.73rem', textAlign: 'center', marginTop: '1rem' }}>
        Secure payment via PayPal · Cancel anytime · No spam
      </p>
    </div>
  );

  // ── FORM ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '4rem 2rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(243,121,61,0.12)', border: '1px solid rgba(243,121,61,0.3)', borderRadius: '100px', padding: '4px 16px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1.25rem' }}>
          Life Safety Weekly
        </div>
        <h1 style={{ fontSize: 'clamp(1.9rem,5vw,3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.1rem', letterSpacing: '-0.02em' }}>
          5 minutes a week.<br />
          <span style={{ color: 'var(--orange)' }}>Everything you need to know</span><br />
          in Fire Protection.
        </h1>
        <p style={{ color: '#adb5bd', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto' }}>
          Every Monday: NFPA updates, AHJ trends, field reports and lessons from South Florida's most complex projects — curated by active engineers, ready in 5 minutes.
        </p>
      </div>

      {/* Plan picker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '620px', margin: '0 auto 3rem' }}>
        {/* Free */}
        <button onClick={() => setPlan('free')}
          style={{ background: plan === 'free' ? 'rgba(255,255,255,0.06)' : 'transparent', border: `2px solid ${plan === 'free' ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.4rem 1.2rem', cursor: 'pointer', textAlign: 'left', transition: 'all .15s', fontFamily: 'inherit' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7d8590', marginBottom: '0.5rem' }}>Community</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#e6edf3', lineHeight: 1, marginBottom: '0.3rem' }}>Free</div>
          <div style={{ fontSize: '0.78rem', color: '#636e7b', marginBottom: '1rem' }}>No credit card needed</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {['Access to all blog articles', 'Part of the Infire community'].map(t => (
              <li key={t} style={{ fontSize: '0.78rem', color: '#8a94a6', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <span style={{ color: '#636e7b', flexShrink: 0 }}>✓</span> {t}
              </li>
            ))}
            <li style={{ fontSize: '0.78rem', color: '#484f58', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0 }}>✗</span> Weekly email digest
            </li>
          </ul>
        </button>

        {/* Newsletter */}
        <button onClick={() => setPlan('newsletter')}
          style={{ background: plan === 'newsletter' ? 'rgba(243,121,61,0.08)' : 'transparent', border: `2px solid ${plan === 'newsletter' ? '#f3793d' : 'var(--border)'}`, borderRadius: '14px', padding: '1.4rem 1.2rem', cursor: 'pointer', textAlign: 'left', transition: 'all .15s', fontFamily: 'inherit', position: 'relative' }}>
          {plan === 'newsletter' && (
            <div style={{ position: 'absolute', top: '-10px', right: '12px', background: '#f3793d', color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: '100px' }}>Popular</div>
          )}
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.5rem' }}>Weekly</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>$5</span>
            <span style={{ fontSize: '0.85rem', color: '#adb5bd', paddingBottom: '4px' }}>/year</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#636e7b', marginBottom: '1rem' }}>= $0.01 per day</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {['Access to all blog articles', 'Part of the Infire community', 'Weekly email every Monday'].map(t => (
              <li key={t} style={{ fontSize: '0.78rem', color: '#adb5bd', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <span style={{ color: '#f3793d', flexShrink: 0 }}>✓</span> {t}
              </li>
            ))}
          </ul>
        </button>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '420px', margin: '0 auto', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          {plan === 'newsletter' ? 'Subscribe — $5/year' : 'Join for free'}
        </h2>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={lbl}>Full Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" style={inp} />
          </div>
          <div>
            <label style={lbl}>Industry *</label>
            <select name="industry" value={form.industry} onChange={handleChange} required style={{ ...inp, cursor: 'pointer' }}>
              <option value="" disabled>Select your industry…</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" style={inp} />
          </div>
          <button type="submit" disabled={submitting}
            style={{ background: plan === 'newsletter' ? 'var(--orange)' : 'rgba(255,255,255,0.08)', color: '#fff', border: plan === 'newsletter' ? 'none' : '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '0.95rem', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%', marginTop: '0.25rem', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Processing…' : plan === 'newsletter' ? 'Continue to Payment →' : 'Join for free →'}
          </button>
          <p style={{ color: 'var(--gray)', fontSize: '0.72rem', textAlign: 'center', margin: 0 }}>
            {plan === 'newsletter' ? 'Secure payment via PayPal · Cancel anytime · No spam' : 'No payment needed · No spam · Upgrade anytime'}
          </p>
        </form>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', marginTop: '3.5rem', padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '560px', margin: '3.5rem auto 0' }}>
        <p style={{ color: '#8a94a6', fontSize: '0.87rem', lineHeight: 1.7 }}>
          <strong style={{ color: '#e6edf3' }}>Want to read before subscribing?</strong><br />
          Browse the latest articles — free, no sign-up required.
        </p>
        <a href="/blog" style={{ display: 'inline-block', marginTop: '0.6rem', color: 'var(--orange)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          Read the Blog →
        </a>
      </div>
    </div>
  );
}
