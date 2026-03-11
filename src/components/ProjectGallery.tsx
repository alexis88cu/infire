'use client';

import { useState } from 'react';

interface Props {
  images: string[];
  projectName: string;
}

export default function ProjectGallery({ images, projectName }: Props) {
  const [lightbox, setLightbox] = useState(false);
  const mainImg = images[0];

  if (!mainImg) {
    return (
      <div style={{
        height: '340px', background: 'linear-gradient(135deg,#1a2332,#0d1520)',
        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '2rem', border: '1px solid var(--border)',
      }}>
        <div style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.12em', opacity: 0.3 }}>INFIRE</div>
      </div>
    );
  }

  return (
    <>
      {/* Single main image — click to expand */}
      <div
        onClick={() => setLightbox(true)}
        style={{
          position: 'relative', marginBottom: '2.5rem', cursor: 'zoom-in',
          borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
        }}
      >
        <img
          src={mainImg}
          alt={projectName}
          style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,17,23,0.45) 0%, transparent 55%)' }} />
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(13,17,23,0.75)', borderRadius: '6px', padding: '4px 10px',
          fontSize: '0.72rem', color: '#adb5bd', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span>⤢</span> Click to expand
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.94)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem', backdropFilter: 'blur(10px)',
          }}
        >
          <img
            src={mainImg}
            alt={projectName}
            style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 8px 64px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem',
              background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
              fontSize: '1.1rem', width: '40px', height: '40px', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}
    </>
  );
}
