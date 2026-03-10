import { getProjects, getProject } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectGallery from '@/components/ProjectGallery';

export async function generateStaticParams() {
  return getProjects().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: p.seoTitle || `${p.projectName} | Infire Inc.`,
    description: p.seoDescription || p.description?.slice(0, 155),
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();
  const tags = Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const featuredImage: string = (p as any).featuredImage || '';
  const galleryImages: string[] = (p as any).galleryImages || [];
  const allImages = [featuredImage, ...galleryImages].filter(Boolean);

  const stats = [
    { label: 'Estimated Sprinkler Heads', value: `~${(p.estimatedSprinklers || 0).toLocaleString()}` },
    { label: 'City', value: `${p.city}, FL` },
    { label: 'Sector', value: p.sector },
    { label: 'Project Type', value: p.projectType },
    { label: 'Status', value: (p as any).status || 'Completed' },
  ].filter(s => s.value && s.value !== ', FL');

  const specs = (p as any).systemSpecs || [];
  const highlights = (p as any).highlights || [];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
      <a href="/portfolio" className="back-link">← Back to Portfolio</a>

      {/* Gallery — client component for lightbox */}
      <ProjectGallery images={allImages} projectName={p.projectName} />

      {/* Title + address */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          <span className="badge badge-orange">{p.sector}</span>
          <span className="badge badge-gray">{p.projectType}</span>
          {(p as any).status === 'Completed' && (
            <span style={{ background: 'rgba(111,207,151,0.15)', color: '#6fcf97', border: '1px solid rgba(111,207,151,0.3)', borderRadius: '4px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
              ✓ Completed
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.4rem', lineHeight: 1.2 }}>
          {p.projectName}
        </h1>
        {p.address && (
          <p style={{ color: 'var(--gray)', fontSize: '0.92rem' }}>
            📍 {p.address}, {p.city}, FL {p.zipCode}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden',
        marginBottom: '2.5rem',
      }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--dark2)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>{s.value}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      {p.description && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--orange)' }}>Project Overview</h2>
          <p style={{ color: '#adb5bd', lineHeight: 1.8, fontSize: '0.95rem' }}>{p.description}</p>
        </div>
      )}

      {/* System Specs */}
      {specs.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--orange)' }}>System Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.75rem' }}>
            {specs.map((s: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--orange)', fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>▸</span>
                <span style={{ color: '#adb5bd', fontSize: '0.85rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--orange)' }}>Engineering Highlights</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {highlights.map((h: string, i: number) => (
              <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', color: '#adb5bd', fontSize: '0.88rem', lineHeight: 1.6 }}>
                <span style={{ color: '#6fcf97', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      {/* CTA */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="/portfolio" style={{ background: 'rgba(255,255,255,0.06)', color: '#e6edf3', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          ← All Projects
        </a>
        <a href="/contact" style={{ background: 'var(--orange)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          Work With Us →
        </a>
      </div>
    </div>
  );
}
