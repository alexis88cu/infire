import { getProjects, getProject } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getProjects().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = getProject(params.slug);
  if (!p) return {};
  return { title: p.seoTitle || `${p.projectName} | Infire Inc.`, description: p.seoDescription || p.description?.slice(0,155) };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();
  const tags = Array.isArray(p.tags) ? p.tags : (p.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'4rem 2rem'}}>
      <a href="/portfolio" className="back-link">← Back to Portfolio</a>
      <div style={{height:'320px',background:'linear-gradient(135deg,#1a2332 0%,#0d1520 100%)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'2.5rem',position:'relative',overflow:'hidden',border:'1px solid var(--border)'}}>
        <span style={{fontSize:'5rem',opacity:0.15}}>🔥</span>
        <div style={{position:'absolute',top:16,left:16,display:'flex',gap:'8px'}}>
          <span className="badge badge-orange" style={{fontSize:'0.75rem',padding:'4px 10px'}}>{p.sector}</span>
          <span className="badge badge-gray" style={{fontSize:'0.75rem',padding:'4px 10px'}}>{p.projectType}</span>
        </div>
      </div>
      <h1 style={{fontSize:'2rem',fontWeight:900,marginBottom:'0.5rem'}}>{p.projectName}</h1>
      <p style={{color:'var(--gray)',fontSize:'1rem',marginBottom:'2.5rem'}}>{p.address ? `${p.address}, ` : ''}{p.city}, FL {p.zipCode}</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1rem',marginBottom:'3rem'}}>
        {[
          {label:'Est. Sprinkler Heads',value:(p.estimatedSprinklers||0).toLocaleString()},
          {label:'Project Type',value:p.projectType||'—'},
          {label:'Status',value:p.deliveryStatus||'—'},
          {label:'Location',value:p.city||'—'},
        ].map(s=>(
          <div key={s.label} style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'1.1rem'}}>
            <div style={{color:'var(--gray)',fontSize:'0.75rem',marginBottom:'0.3rem'}}>{s.label}</div>
            <div style={{fontWeight:700,fontSize:'1rem'}}>{s.value}</div>
          </div>
        ))}
      </div>
      {p.description && (
        <div style={{marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'0.75rem',color:'var(--orange)'}}>Project Overview</h2>
          <p style={{color:'#adb5bd',lineHeight:1.75,fontSize:'0.95rem'}}>{p.description}</p>
        </div>
      )}
      {p.systemsScope && (
        <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.5rem',marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'1rem',fontWeight:700,marginBottom:'0.6rem'}}>Systems Scope</h2>
          <p style={{color:'#adb5bd',lineHeight:1.7,fontSize:'0.9rem'}}>{p.systemsScope}</p>
        </div>
      )}
      {tags.length > 0 && (
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'3rem'}}>
          {tags.map(tag=><span key={tag} className="tag-orange">{tag}</span>)}
        </div>
      )}
      <div style={{borderTop:'1px solid var(--border)',paddingTop:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/portfolio" style={{color:'var(--orange)',fontWeight:600,fontSize:'0.9rem'}}>← All Projects</a>
        <a href="/contact" className="btn-sm">Start a Similar Project</a>
      </div>
    </div>
  );
}
