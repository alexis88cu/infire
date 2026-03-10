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
      const matchSearch = !q || (p.projectName||'').toLowerCase().includes(q) || (p.city||'').toLowerCase().includes(q) || (p.sector||'').toLowerCase().includes(q);
      return matchSector && matchSearch;
    });
  }, [filter, search]);

  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'4rem 2rem'}}>
      <div style={{marginBottom:'3rem'}}>
        <p className="section-label">Our Work</p>
        <h1 style={{fontSize:'2.5rem',fontWeight:900,marginBottom:'0.75rem',marginTop:'0.5rem'}}>Portfolio</h1>
        <p style={{color:'var(--gray)',fontSize:'1rem',maxWidth:'600px'}}>
          {PROJECTS.length} fire protection projects across South Florida and beyond.
        </p>
      </div>
      <div style={{display:'flex',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap',alignItems:'center'}}>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {SECTORS.map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              className={`filter-btn${filter===s?' active':''}`}>{s}</button>
          ))}
        </div>
        <input type="text" placeholder="Search projects or cities..." value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'8px 14px',color:'#fff',fontSize:'0.85rem',width:'240px',outline:'none'}} />
        <span style={{color:'var(--gray)',fontSize:'0.85rem',marginLeft:'auto'}}>{filtered.length} projects</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:'1.25rem'}}>
        {filtered.map(p=><ProjectCard key={p.slug} project={p}/>)}
      </div>
    </div>
  );
}

function ProjectCard({project:p}:{project:Project}) {
  return (
    <a href={`/portfolio/${p.slug}`} className="card">
      <div style={{height:'180px',background:'linear-gradient(135deg,#1a2332 0%,#111827 100%)',overflow:'hidden',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
        {p.featuredImage ? (
          <img src={p.featuredImage} alt={p.projectName}
            style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.85}} />
        ) : (
          <span style={{fontSize:'2.5rem',opacity:0.2}}>🔥</span>
        )}
        <div style={{position:'absolute',top:10,left:10,display:'flex',gap:'6px'}}>
          <span className="badge badge-gray" style={{background:'rgba(13,17,23,0.85)'}}>{p.projectType}</span>
          {p.featured && <span className="badge badge-orange">Featured</span>}
        </div>
        <div style={{position:'absolute',bottom:10,right:10,background:'rgba(13,17,23,0.85)',borderRadius:'4px',padding:'2px 8px',fontSize:'0.72rem',color:'#adb5bd'}}>
          ~{(p.estimatedSprinklers||0).toLocaleString()} heads
        </div>
      </div>
      <div style={{padding:'1.1rem'}}>
        <h3 style={{fontSize:'0.95rem',fontWeight:700,marginBottom:'0.3rem'}} className="line-clamp-1">{p.projectName}</h3>
        <p style={{color:'var(--gray)',fontSize:'0.82rem',marginBottom:'0.6rem'}}>{p.city}, FL · {p.sector}</p>
        <p className="line-clamp-2" style={{color:'#8a94a6',fontSize:'0.8rem',lineHeight:1.55,marginBottom:'0.75rem'}}>{p.description}</p>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem'}}>
          <span style={{color:'var(--gray)'}}>{p.systemsScope?.slice(0,40)}</span>
          <span style={{color:p.deliveryStatus==='Completed'?'#3fb950':p.deliveryStatus==='Active'?'var(--orange)':'var(--gray)'}}>{p.deliveryStatus}</span>
        </div>
      </div>
    </a>
  );
}
