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

export default function SubscribePage() {
  const [form, setForm] = useState({
    name: '', industry: '', email: '', newsletter: true,
  });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industry || !form.email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '0.8rem 1rem', color: '#e6edf3',
    fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontWeight: 600, fontSize: '0.82rem',
    color: '#adb5bd', marginBottom: '0.4rem', letterSpacing: '0.03em',
    textTransform: 'uppercase',
  };

  if (status === 'success') {
    return (
      <div style={{maxWidth:'560px',margin:'0 auto',padding:'6rem 2rem',textAlign:'center'}}>
        <div style={{fontSize:'3.5rem',marginBottom:'1.25rem'}}>🎉</div>
        <h1 style={{fontSize:'1.8rem',fontWeight:900,marginBottom:'0.75rem'}}>You're In!</h1>
        <p style={{color:'#adb5bd',fontSize:'1rem',lineHeight:1.7,marginBottom:'2rem'}}>
          Welcome to the Infire briefing. You'll receive our next weekly article covering fire protection engineering, NFPA code updates, and field insights — straight to your inbox.
        </p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/blog" style={{background:'var(--orange)',color:'#fff',padding:'0.75rem 1.5rem',borderRadius:'8px',fontWeight:700,textDecoration:'none',fontSize:'0.9rem'}}>
            Read the Blog →
          </a>
          <a href="/" style={{background:'rgba(255,255,255,0.06)',color:'#e6edf3',padding:'0.75rem 1.5rem',borderRadius:'8px',fontWeight:700,textDecoration:'none',fontSize:'0.9rem'}}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'4rem 2rem'}}>
      <a href="/blog" style={{color:'var(--gray)',textDecoration:'none',fontSize:'0.85rem',display:'inline-flex',alignItems:'center',gap:'0.3rem',marginBottom:'2.5rem'}}>
        ← Back to Blog
      </a>

      <div style={{marginBottom:'2.5rem'}}>
        <p style={{fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--orange)',marginBottom:'0.5rem'}}>Newsletter</p>
        <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:900,lineHeight:1.2,marginBottom:'0.75rem'}}>
          Stay Sharp on Fire Protection
        </h1>
        <p style={{color:'#adb5bd',fontSize:'0.95rem',lineHeight:1.7}}>
          Weekly articles on NFPA code changes, system design, inspection best practices, and field lessons from South Florida's most complex projects.
        </p>
      </div>

      {/* Benefits */}
      <div style={{display:'grid',gap:'0.6rem',marginBottom:'2.5rem'}}>
        {[
          ['📬','One article per week — no spam, no filler'],
          ['🔧','Written by working fire protection engineers'],
          ['📋','NFPA code updates, design insights, field reports'],
          ['🆓','Always free. Unsubscribe anytime.'],
        ].map(([icon, text]) => (
          <div key={text} style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.88rem',color:'#adb5bd'}}>
            <span style={{fontSize:'1rem'}}>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div style={{height:'1px',background:'var(--border)',marginBottom:'2rem'}}/>

      {status === 'error' && (
        <div style={{background:'rgba(220,53,69,0.1)',border:'1px solid rgba(220,53,69,0.3)',borderRadius:'8px',padding:'0.85rem 1rem',color:'#f08080',fontSize:'0.88rem',marginBottom:'1.25rem'}}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text" name="name" value={form.name}
            onChange={handleChange} required placeholder="John Smith"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Industry *</label>
          <select
            name="industry" value={form.industry}
            onChange={handleChange} required
            style={{...inputStyle, cursor:'pointer'}}
          >
            <option value="" disabled>Select your industry…</option>
            {INDUSTRIES.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            type="email" name="email" value={form.email}
            onChange={handleChange} required placeholder="you@company.com"
            style={inputStyle}
          />
        </div>

        <div style={{
          display:'flex',alignItems:'flex-start',gap:'0.75rem',
          background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',
          borderRadius:'8px',padding:'1rem',cursor:'pointer',
        }}
          onClick={() => setForm(p => ({...p, newsletter: !p.newsletter}))}
        >
          <div style={{
            width:'20px',height:'20px',borderRadius:'4px',flexShrink:0,marginTop:'1px',
            background: form.newsletter ? 'var(--orange)' : 'transparent',
            border: form.newsletter ? 'none' : '2px solid var(--border)',
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            {form.newsletter && <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><polyline points="2,6 5,9 10,3" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round"/></svg>}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:'0.88rem',marginBottom:'0.2rem'}}>Subscribe to Weekly Newsletter</div>
            <div style={{color:'var(--gray)',fontSize:'0.82rem',lineHeight:1.5}}>
              Receive new articles every week covering NFPA updates, engineering insights, and field reports. No spam — only fire protection content that matters.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            background: status === 'loading' ? 'rgba(243,121,61,0.5)' : 'var(--orange)',
            color:'#fff',border:'none',borderRadius:'8px',
            padding:'0.9rem',fontWeight:800,fontSize:'1rem',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            width:'100%',
          }}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
        </button>

        <p style={{color:'var(--gray)',fontSize:'0.75rem',textAlign:'center',marginTop:'-0.25rem'}}>
          By subscribing you agree to receive email communications from Infire Inc. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
