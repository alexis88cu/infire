'use client';
import { useState, useMemo } from 'react';
import { getProjects, type Project } from '@/lib/data';

const PROJECTS = getProjects();
const SECTORS = ['All', 'Residential', 'Commercial', 'Institutional'];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchSector = filter === 'All' || p.projectType === filter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (p.projectName || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.sector || '').toLowerCase().includes(q);
      return matchSector && matchSearch;
    });
  }, [filter, search]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ color: 'var(--orange)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Our Work</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>Portfolio</h1>
        <p style={{ color: 'var(--gray)', fontSize: '1rem', maxWidth: '600px' }}>
          {PROJECTS.length} fire protection projects across South Florida and beyond. Residential, commercial, and institutional — from single-family to luxury high-rises.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '7px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600,
              border: '1px solid', cursor: 'pointer', transition: 'all .2s',
              borderColor: filter === s ? 'var(--orange)' : 'var(--border)',
              background: filter === s ? 'var(--orange)' : 'transparent',
              color: filter === s ? '#fff' : 'var(--gray)',
            }}>{s}</button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search projects or cities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'var(--dark2)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '8px 14px', color: '#fff',
            fontSize: '0.85rem', width: '240px', outline: 'none',
          }}
        />
        <span style={{ color: 'var(--gray)', fontSize: '0.85rem', marginLeft: 'auto' }}>
          {filtered.length} projects
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </div>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const gallery: string[] = (p as any).galleryImages || [];
  const mainImg: string = (p as any).featuredImage || '';
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const displayImg = hoveredThumb !== null ? gallery[hoveredThumb] : mainImg;

  return (
    <a
      href={`/portfolio/${p.slug}`}
      style={{
        background: 'var(--dark2)', border: '1px solid var(--border)',
        borderRadius: '12px', overflow: 'hidden', display: 'block',
        textDecoration: 'none', transition: 'border-color .2s, transform .2s, box-shadow .2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(243,121,61,0.4)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        setHoveredThumb(null);
      }}
    >
      {/* Main image */}
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#111827' }}>
        {mainImg ? (
          <img
            src={displayImg || mainImg}
            alt={p.projectName}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 0.4s ease',
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a2332,#111827)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>🔥</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,17,23,0.7) 0%, transparent 50%)' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '6px' }}>
          <span style={{ background: 'rgba(13,17,23,0.85)', color: 'var(--gray)', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
            {p.projectType}
          </span>
          {p.featured && (
            <span style={{ background: 'rgba(243,121,61,0.9)', color: '#fff', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              Featured
            </span>
          )}
        </div>

        {/* Sprinkler count */}
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(13,17,23,0.85)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.72rem', color: '#adb5bd', backdropFilter: 'blur(4px)' }}>
          ~{(p.estimatedSprinklers || 0).toLocaleString()} heads
        </div>

        {/* Gallery thumbnails — bottom left */}
        {gallery.length > 0 && (
          <div
            style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: '4px' }}
            onClick={e => e.preventDefault()}
          >
            {gallery.map((thumb, i) => (
              <div
                key={i}
                onMouseEnter={e => { e.stopPropagation(); e.preventDefault(); setHoveredThumb(i); }}
                onMouseLeave={() => setHoveredThumb(null)}
                style={{
                  width: '36px', height: '36px', borderRadius: '5px', overflow: 'hidden',
                  border: `2px solid ${hoveredThumb === i ? 'var(--orange)' : 'rgba(255,255,255,0.3)'}`,
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'border-color 0.15s, transform 0.15s',
                  transform: hoveredThumb === i ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1.1rem' }}>
        <h3 style={{
          fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem',
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', color: '#e6edf3',
        }}>{p.projectName}</h3>
        <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
          {p.city}, FL · {p.sector}
        </p>
        <p style={{
          color: '#8a94a6', fontSize: '0.78rem', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: '0.75rem',
        }}>
          {(p as any).description || (p as any).shortDescription || ''}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{p.city}</span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: (p as any).status === 'Completed' ? '#6fcf97' : 'var(--orange)',
          }}>
            {(p as any).status || 'Completed'}
          </span>
        </div>
      </div>
    </a>
  );
}
