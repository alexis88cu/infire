import { getArticles, fmtDate } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Infire Inc. Fire Protection Engineering',
  description: 'Fire protection engineering insights, NFPA code updates, and field reports from South Florida.',
};

export default function BlogPage() {
  const articles = getArticles();
  const [featured, ...rest] = articles;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '3.5rem' }}>
        <p className="section-label">From the Field</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', marginTop: '0.5rem' }}>Blog</h1>
        <p style={{ color: 'var(--gray)', fontSize: '1rem' }}>
          Fire protection engineering insights, NFPA code updates, and field observations. New article every 3 days.
        </p>
      </div>

      {/* Featured article — large card with full image */}
      {featured && (
        <a
          href={`/blog/${featured.slug}`}
          style={{
            display: 'block', textDecoration: 'none',
            borderRadius: '14px', overflow: 'hidden',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
            background: 'rgba(255,255,255,0.02)',
            transition: 'border-color 0.2s',
          }}
          className="card-featured"
        >
          {(featured as any).featuredImage && (
            <div style={{ height: '300px', overflow: 'hidden' }}>
              <img
                src={(featured as any).featuredImage}
                alt={featured.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
              />
            </div>
          )}
          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <span className="badge badge-orange">{featured.category}</span>
              <span style={{ color: 'var(--gray)', fontSize: '0.78rem' }}>{fmtDate(featured.publishDate)}</span>
              <span style={{ color: 'var(--gray)', fontSize: '0.78rem' }}>· {featured.readTime || 5} min read</span>
              {(featured as any).featured && <span className="badge badge-blue">Featured</span>}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '0.65rem' }}>{featured.title}</h2>
            {featured.subtitle && <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{featured.subtitle}</p>}
            <p className="line-clamp-2" style={{ color: 'var(--gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>{featured.hook}</p>
            <span style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--orange)', fontWeight: 700, fontSize: '0.85rem' }}>
              Read Article →
            </span>
          </div>
        </a>
      )}

      {/* Rest of articles — alternating layout cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {rest.map((a, idx) => {
          const imgSide = idx % 2 === 0 ? 'right' : 'left';
          return (
            <a
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="card-flat"
              style={{
                display: 'flex',
                flexDirection: imgSide === 'right' ? 'row' : 'row-reverse',
                gap: '1.25rem',
                alignItems: 'stretch',
                minHeight: '160px',
                padding: '0',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              {(a as any).featuredImage && (
                <div style={{
                  flexShrink: 0, width: '200px',
                  borderRadius: imgSide === 'right' ? '0 8px 8px 0' : '8px 0 0 8px',
                  overflow: 'hidden',
                }}>
                  <img
                    src={(a as any).featuredImage}
                    alt={a.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              {/* Content */}
              <div style={{ padding: '1.25rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-orange">{a.category}</span>
                  <span style={{ color: 'var(--gray)', fontSize: '0.78rem' }}>{fmtDate(a.publishDate)}</span>
                  <span style={{ color: 'var(--gray)', fontSize: '0.78rem' }}>· {a.readTime || 5} min read</span>
                </div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.35, marginBottom: '0.5rem' }}>{a.title}</h2>
                {a.subtitle && <p style={{ color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{a.subtitle}</p>}
                <p className="line-clamp-2" style={{ color: 'var(--gray)', fontSize: '0.84rem', lineHeight: 1.55 }}>{a.hook}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
