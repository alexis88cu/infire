import { getArticles, getArticle, fmtDate } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogInteractions from '@/components/BlogInteractions';

export async function generateStaticParams() {
  return getArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = getArticle(params.slug);
  if (!a) return {};
  return {
    title: a.seoTitle || `${a.title} | Infire Inc.`,
    description: a.seoDescription || a.hook?.slice(0, 155),
  };
}

function renderBody(body: string) {
  return body.split('\n\n').map((para, i) => {
    if (para.startsWith('**') && para.endsWith('**') && para.length < 90) {
      return <h2 key={i} style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e6edf3', marginTop: '2.25rem', marginBottom: '0.75rem' }}>{para.replace(/\*\*/g, '')}</h2>;
    }
    if (para.startsWith('*') && para.endsWith('*') && para.length < 80 && !para.startsWith('**')) {
      return <h3 key={i} style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--orange)', marginTop: '1.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{para.replace(/\*/g, '')}</h3>;
    }
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ color: '#adb5bd', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color: '#e6edf3', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

// ── Layout A: hero-full ─────────────────────────────────────────────
// Wide full-bleed image at top, caption below
function HeroFull({ img, alt, title, subtitle }: any) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
        marginLeft: 'calc(-1rem)', marginRight: 'calc(-1rem)',
      }}>
        <img src={img} alt={alt || title} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

// ── Layout B: hero-split ─────────────────────────────────────────────
// Title left, image right — side by side above body
function HeroSplit({ img, alt, title, subtitle }: any) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: '2rem', alignItems: 'center',
      marginBottom: '3rem',
      '@media(max-width:600px)': { gridTemplateColumns: '1fr' },
    } as any}>
      <div>
        <div style={{
          width: '40px', height: '3px', background: 'var(--orange)',
          borderRadius: '2px', marginBottom: '1rem',
        }} />
        <p style={{ color: '#adb5bd', fontSize: '0.9rem', lineHeight: 1.7 }}>{subtitle}</p>
      </div>
      <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <img src={img} alt={alt || title} style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

// ── Layout C: hero-tall ─────────────────────────────────────────────
// Narrow tall image floated right, text wraps left
function HeroTall({ img, alt, title }: any) {
  return (
    <div style={{ marginBottom: '2rem', overflow: 'hidden' }}>
      <div style={{
        float: 'right', width: '42%', marginLeft: '1.75rem', marginBottom: '1rem',
        borderRadius: '10px', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <img src={img} alt={alt || title} style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

// ── Layout D: hero-offset ────────────────────────────────────────────
// Full-width image with orange accent bar + category overlay
function HeroOffset({ img, alt, title, category }: any) {
  return (
    <div style={{ position: 'relative', marginBottom: '3rem' }}>
      <div style={{
        position: 'absolute', top: 0, left: '-1rem',
        width: '4px', height: '100%',
        background: 'linear-gradient(to bottom, var(--orange), transparent)',
        borderRadius: '2px',
      }} />
      <div style={{
        borderRadius: '10px', overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
        position: 'relative',
      }}>
        <img src={img} alt={alt || title} style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(13,17,23,0.85) 0%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '1.25rem', left: '1.5rem',
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
        }}>{category}</div>
      </div>
    </div>
  );
}

// ── Inline image component ───────────────────────────────────────────
// Used mid-article, alternates left/right
function InlineImage({ src, alt, side = 'right' }: { src: string; alt: string; side?: 'left' | 'right' }) {
  return (
    <div style={{
      float: side, width: '44%',
      marginLeft: side === 'right' ? '1.75rem' : '0',
      marginRight: side === 'left' ? '1.75rem' : '0',
      marginBottom: '1rem', marginTop: '0.25rem',
      borderRadius: '8px', overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      clear: side as any,
    }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();
  const tags = typeof a.tags === 'string' ? a.tags.split(',').map(t => t.trim()).filter(Boolean) : (a.tags || []);
  const related = getArticles().filter(x => x.category === a.category && x.slug !== a.slug).slice(0, 2);
  const layout = (a as any).imageLayout || 'hero-full';
  const inlineImgs = (a as any).inlineImages || {};

  // Inject inline images into body paragraphs (after 2nd and 5th paragraph)
  const bodyParagraphs = a.body ? a.body.split('\n\n') : [];
  const INLINE_KEYS = Object.keys(inlineImgs);

  function renderBodyWithImages() {
    return bodyParagraphs.map((para, i) => {
      const el = renderBody(para)[0];
      const els = [el];

      // After paragraph 2: insert first inline image (right)
      if (i === 2 && INLINE_KEYS[0]) {
        els.push(
          <InlineImage
            key={`inline-0`}
            src={inlineImgs[INLINE_KEYS[0]]}
            alt={INLINE_KEYS[0]}
            side="right"
          />
        );
      }
      // After paragraph 6: insert second inline image (left)
      if (i === 6 && INLINE_KEYS[1]) {
        els.push(
          <div key="clearfix-1" style={{ clear: 'both' }} />,
          <InlineImage
            key={`inline-1`}
            src={inlineImgs[INLINE_KEYS[1]]}
            alt={INLINE_KEYS[1]}
            side="left"
          />
        );
      }
      return els;
    });
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem' }}>
      <a href="/blog" className="back-link">← Back to Blog</a>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span className="badge badge-orange">{a.category}</span>
        <span style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{fmtDate(a.publishDate)}</span>
        <span style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>· {a.readTime || 5} min read</span>
        <span style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>· {a.author || 'Infire Author'}</span>
      </div>

      {/* Title — always before image for split layout */}
      <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.75rem' }}>{a.title}</h1>

      {/* ── Layout: hero-split (title+subtitle beside image) ── */}
      {layout === 'hero-split' && a.featuredImage && (
        <HeroSplit img={a.featuredImage} alt={(a as any).imageAlt} title={a.title} subtitle={a.subtitle} />
      )}

      {/* Subtitle (only if NOT split layout, which already shows it) */}
      {layout !== 'hero-split' && a.subtitle && (
        <p style={{ color: '#adb5bd', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.5 }}>{a.subtitle}</p>
      )}

      {/* ── Layout: hero-full ── */}
      {layout === 'hero-full' && a.featuredImage && (
        <HeroFull img={a.featuredImage} alt={(a as any).imageAlt} title={a.title} />
      )}

      {/* ── Layout: hero-offset ── */}
      {layout === 'hero-offset' && a.featuredImage && (
        <HeroOffset img={a.featuredImage} alt={(a as any).imageAlt} title={a.title} category={a.category} />
      )}

      <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }} />

      {/* Hook */}
      {a.hook && (
        <p style={{ fontSize: '1.05rem', color: '#c9d1d9', lineHeight: 1.8, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--orange)', paddingLeft: '1.25rem' }}>{a.hook}</p>
      )}

      {/* ── Layout: hero-tall (floated image within body) ── */}
      {layout === 'hero-tall' && a.featuredImage && (
        <HeroTall img={a.featuredImage} alt={(a as any).imageAlt} title={a.title} />
      )}

      {/* Body with inline images */}
      {a.body && (
        <div style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
          {renderBodyWithImages()}
          <div style={{ clear: 'both' }} />
        </div>
      )}

      {/* Takeaway */}
      {a.takeaway && (
        <blockquote style={{ background: 'rgba(243,121,61,0.08)', border: '1px solid rgba(243,121,61,0.2)', borderLeft: '4px solid var(--orange)', borderRadius: '0 8px 8px 0', padding: '1.25rem 1.5rem', margin: '2.5rem 0', color: '#e6edf3', fontSize: '0.95rem', lineHeight: 1.7, fontStyle: 'italic' }}>{a.takeaway}</blockquote>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      {/* Interactions: views, likes, comments */}
      <BlogInteractions slug={a.slug} />

      {/* Related articles */}
      {related.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Related Articles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {related.map(r => (
              <a key={r.slug} href={`/blog/${r.slug}`} className="card-flat">
                {(r as any).featuredImage && (
                  <div style={{ borderRadius: '6px', overflow: 'hidden', marginBottom: '0.75rem', height: '120px' }}>
                    <img src={(r as any).featuredImage} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--orange)', marginBottom: '0.4rem' }}>{r.category}</div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4 }}>{r.title}</h4>
                <p style={{ color: 'var(--gray)', fontSize: '0.78rem', marginTop: '0.4rem' }}>{fmtDate(r.publishDate)} · {r.readTime || 5} min</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Subscribe CTA */}
      <div style={{ background: 'rgba(243,121,61,0.06)', border: '1px solid rgba(243,121,61,0.2)', borderRadius: '12px', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔔</div>
        <h3 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1rem' }}>Get the Weekly Fire Protection Briefing</h3>
        <p style={{ color: 'var(--gray)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          New articles on NFPA code updates, system design, and field practice — every week, straight to your inbox.
        </p>
        <a href="/subscribe" style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', padding: '0.7rem 1.75rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
          Subscribe Free →
        </a>
      </div>
    </div>
  );
}
