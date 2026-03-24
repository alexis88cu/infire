import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infire Inc. | Fire Protection Engineers — Miami, FL',
  description: 'Full-service fire protection engineering firm based in Miami. NFPA 13, 14, 20, 25 design and inspection across South Florida.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="site-nav">
          <a href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/images/infire-logo.png"
              alt="Infire"
              style={{ height: '44px', width: 'auto', display: 'block' }}
            />
            <span className="nav-name" style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.08em', color: '#f3793d', textTransform: 'uppercase' }}>Infire</span>
          </a>
          <div className="nav-links">
            <a href="/portfolio" className="nav-link">Portfolio</a>
            <a href="/blog" className="nav-link">Blog</a>
            <a href="/subscribe" className="nav-link">Subscribe</a>
            <a href="/contact" className="nav-cta">Contact</a>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="site-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img src="/images/infire-logo.png" alt="Infire" style={{ height: '38px', width: 'auto', opacity: 0.75 }} />
            <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.08em', color: '#f3793d', opacity: 0.85, textTransform: 'uppercase' }}>Infire</span>
          </div>
          <p><strong>Infire Inc.</strong> — Fire Protection Engineering</p>
          <p>Miami, FL · infireinc.com · Licensed &amp; Insured</p>
          <p className="footer-copy">© {new Date().getFullYear()} Infire Inc. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
