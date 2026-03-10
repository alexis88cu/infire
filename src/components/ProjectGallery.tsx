'use client';

import { useState } from 'react';

interface Props {
  images: string[];
  projectName: string;
}

export default function ProjectGallery({ images, projectName }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) {
    return (
      <div style={{ height: '340px', background: 'linear-gradient(135deg,#1a2332,#0d1520)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '4rem', opacity: 0.15 }}>🔥</span>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div
        style={{ position: 'relative', marginBottom: '0.75rem', cursor: 'zoom-in', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}
        onClick={() => setLightbox(true)}
      >
        <img
          src={images[active]}
          alt={projectName}
          style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block', transition: 'opacity 0.2s' }}
          onError={e => { (e.target as HTMLImageElement).src = images[0]; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,17,23,0.5) 0%, transparent 60%)' }} />
        {/* Zoom hint */}
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(13,17,23,0.75)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', color: '#adb5bd', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⤢</span> Click to expand
        </div>
        {/* Image counter */}
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(13,17,23,0.75)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', color: '#adb5bd', backdropFilter: 'blur(4px)' }}>
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                cursor: 'pointer', flexShrink: 0,
                border: `2px solid ${active === i ? 'var(--orange)' : 'rgba(255,255,255,0.1)'}`,
                transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
                transform: active === i ? 'scale(1.05)' : 'scale(1)',
                boxShadow: active === i ? '0 0 0 1px var(--orange)' : 'none',
                opacity: active === i ? 1 : 0.65,
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem', backdropFilter: 'blur(8px)',
          }}
        >
          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length); }}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >‹</button>
          )}

          <img
            src={images[active]}
            alt={projectName}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 8px 64px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % images.length); }}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >›</button>
          )}

          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', fontSize: '1.25rem', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>

          {/* Dot indicator */}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={e => { e.stopPropagation(); setActive(i); }}
                  style={{ width: i === active ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === active ? 'var(--orange)' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.2s' }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
