import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Infire Inc. Fire Protection Engineering',
  description: 'Get in touch with Infire Inc. for fire protection engineering, design, and inspection services in Miami and South Florida.',
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ color: 'var(--orange)', fontSize: '0.8rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '0.5rem' }}>Get in Touch</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>Contact Infire</h1>
        <p style={{ color: 'var(--gray)', fontSize: '1rem', maxWidth: '560px' }}>
          Ready to start your fire protection project? We review every inquiry and respond within 24 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Our Info</h2>
          {[
            { icon: '📍', label: 'Location', value: 'Miami, Florida' },
            { icon: '🌐', label: 'Website', value: 'infireinc.net' },
            { icon: '📋', label: 'License', value: 'Licensed & Insured, State of FL' },
            { icon: '⏱️', label: 'Response Time', value: 'Within 24 hours' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              marginBottom: '1.25rem', padding: '1rem',
              background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: '8px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div>
                <div style={{ color: 'var(--gray)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</div>
              </div>
            </div>
          ))}

          <div style={{
            background: 'rgba(243,121,61,0.08)', border: '1px solid rgba(243,121,61,0.2)',
            borderRadius: '8px', padding: '1.1rem', marginTop: '1.5rem'
          }}>
            <p style={{ color: '#c9d1d9', fontSize: '0.85rem', lineHeight: 1.6 }}>
              <strong style={{ color: '#fff' }}>We specialize in:</strong> NFPA 13 sprinkler systems,
              NFPA 14 standpipe, NFPA 20 fire pumps, NFPA 25 ITM, and permit coordination
              for South Florida AHJs.
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send a Message</h2>
          <form action="https://formspree.io/f/REPLACE_WITH_YOUR_ID" method="POST">
            {[
              { id: 'name', label: 'Name', type: 'text', placeholder: 'John Smith' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com' },
              { id: 'company', label: 'Company / Project', type: 'text', placeholder: 'ABC Developers' },
              { id: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '(305) 000-0000' },
            ].map(f => (
              <div key={f.id} style={{ marginBottom: '1rem' }}>
                <label htmlFor={f.id} style={{ display: 'block', fontSize: '0.82rem',
                  color: 'var(--gray)', marginBottom: '0.3rem' }}>{f.label}</label>
                <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} style={{
                  width: '100%', background: 'var(--dark2)', border: '1px solid var(--border)',
                  borderRadius: '7px', padding: '10px 12px', color: '#fff',
                  fontSize: '0.88rem', outline: 'none'
                }} />
              </div>
            ))}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="message" style={{ display: 'block', fontSize: '0.82rem',
                color: 'var(--gray)', marginBottom: '0.3rem' }}>Tell us about your project</label>
              <textarea id="message" name="message" rows={4}
                placeholder="Building type, location, scope of work, timeline..."
                style={{
                  width: '100%', background: 'var(--dark2)', border: '1px solid var(--border)',
                  borderRadius: '7px', padding: '10px 12px', color: '#fff',
                  fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                }} />
            </div>
            <button type="submit" style={{
              width: '100%', background: 'var(--orange)', color: '#fff',
              padding: '12px', borderRadius: '7px', fontWeight: 700,
              fontSize: '0.95rem', border: 'none', cursor: 'pointer'
            }}>Send Message →</button>
          </form>
        </div>
      </div>
    </div>
  );
}
