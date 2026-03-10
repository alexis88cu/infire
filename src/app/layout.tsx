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
          <a href="/" className="nav-brand">
            <span className="nav-logo">IN</span>
            <span className="nav-name">INFIRE INC.</span>
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
          <p><strong>Infire Inc.</strong> — Fire Protection Engineering</p>
          <p>Miami, FL · infireinc.net · Licensed &amp; Insured</p>
          <p className="footer-copy">© {new Date().getFullYear()} Infire Inc. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
