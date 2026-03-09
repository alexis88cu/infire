import { getFeaturedProjects, getArticles, getSiteMetrics, fmtDate } from '@/lib/data';

export default function HomePage() {
  const featured = getFeaturedProjects();
  const articles = getArticles().slice(0, 3);
  const m = getSiteMetrics();

  return (
    <>
      <section style={{minHeight:'88vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'4rem 2rem',textAlign:'center',background:'radial-gradient(ellipse at 60% 0%, rgba(243,121,61,0.12) 0%, transparent 65%)'}}>
        <div className="badge badge-orange" style={{borderRadius:'100px',padding:'4px 14px',marginBottom:'1.5rem',letterSpacing:'0.1em'}}>
          Miami · South Florida · Nationwide
        </div>
        <h1 style={{fontSize:'clamp(2.5rem, 6vw, 4.5rem)',fontWeight:900,lineHeight:1.1,marginBottom:'1.5rem',maxWidth:'800px'}}>
          Fire Protection<br/><span style={{color:'var(--orange)'}}>Engineering</span> That Gets Built
        </h1>
        <p style={{fontSize:'1.15rem',color:'var(--gray)',maxWidth:'560px',marginBottom:'2.5rem',lineHeight:1.7}}>
          Full-service fire protection design, inspection, and permitting. NFPA 13, 14, 20 &amp; 25. From luxury high-rises to affordable housing.
        </p>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center'}}>
          <a href="/portfolio" className="btn-primary">View Our Work</a>
          <a href="/contact" className="btn-ghost">Get a Quote</a>
        </div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'1px',background:'var(--border)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        {[
          {value:m.totalSprinklers.toLocaleString(),label:'Sprinkler Heads Designed'},
          {value:m.totalProjects+'+',label:'Projects Completed'},
          {value:m.cities+'+',label:'Cities Served'},
          {value:m.yearsActive+' yrs',label:'In Business'},
        ].map(s=>(
          <div key={s.label} style={{background:'var(--dark2)',padding:'2.5rem 2rem',textAlign:'center'}}>
            <div style={{fontSize:'clamp(1.8rem,4vw,2.5rem)',fontWeight:900,color:'var(--orange)',letterSpacing:'-0.02em'}}>{s.value}</div>
            <div style={{color:'var(--gray)',fontSize:'0.85rem',marginTop:'0.4rem'}}>{s.label}</div>
          </div>
        ))}
      </section>

      <section style={{padding:'6rem 2rem',maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem'}}>
          <div><p className="section-label">Featured Work</p><h2 className="section-title">Notable Projects</h2></div>
          <a href="/portfolio" style={{color:'var(--orange)',fontSize:'0.9rem',fontWeight:600}}>View all {m.totalProjects} projects →</a>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))',gap:'1.5rem'}}>
          {featured.map(p=>(
            <a key={p.slug} href={`/portfolio/${p.slug}`} className="card">
              <div style={{height:'200px',background:'linear-gradient(135deg,#1a2332 0%,#0d1520 100%)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                <span style={{fontSize:'3rem'}}>🔥</span>
                <div style={{position:'absolute',top:'12px',right:'12px'}}><span className="badge badge-orange">{p.sector}</span></div>
              </div>
              <div style={{padding:'1.25rem'}}>
                <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:'0.3rem'}}>{p.projectName}</h3>
                <p style={{color:'var(--gray)',fontSize:'0.85rem',marginBottom:'0.75rem'}}>{p.city}, FL</p>
                <p className="line-clamp-2" style={{color:'#adb5bd',fontSize:'0.82rem',lineHeight:1.6}}>{p.description}</p>
                <div style={{marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',fontSize:'0.78rem',color:'var(--gray)'}}>
                  <span>~{(p.estimatedSprinklers||0).toLocaleString()} heads</span>
                  <span style={{color:p.deliveryStatus==='Completed'?'#3fb950':'var(--orange)'}}>{p.deliveryStatus}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{background:'var(--dark2)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'5rem 2rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <h2 style={{textAlign:'center',fontSize:'2rem',fontWeight:800,marginBottom:'3rem'}}>What We Do</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',gap:'1.5rem'}}>
            {[
              {icon:'📐',title:'System Design',desc:'NFPA 13 wet, dry, and pre-action sprinkler systems. Hydraulic calculations included.'},
              {icon:'🏗️',title:'Standpipe & Hose',desc:'NFPA 14 Class I, II, and III standpipe systems for mid-rise and high-rise buildings.'},
              {icon:'💧',title:'Fire Pumps',desc:'NFPA 20 fire pump sizing, churn pressure analysis, and pump room layout.'},
              {icon:'🔍',title:'ITM & Inspection',desc:'NFPA 25 inspection, testing, and maintenance programs. Deficiency reports included.'},
            ].map(s=>(
              <div key={s.title} style={{background:'var(--dark)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.75rem'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>{s.icon}</div>
                <h3 style={{fontWeight:700,marginBottom:'0.5rem'}}>{s.title}</h3>
                <p style={{color:'var(--gray)',fontSize:'0.88rem',lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'6rem 2rem',maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem'}}>
          <div><p className="section-label">From the Field</p><h2 className="section-title">Latest on the Blog</h2></div>
          <a href="/blog" style={{color:'var(--orange)',fontSize:'0.9rem',fontWeight:600}}>All articles →</a>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))',gap:'1.5rem'}}>
          {articles.map(a=>(
            <a key={a.slug} href={`/blog/${a.slug}`} className="card-flat">
              <span className="badge badge-orange">{a.category}</span>
              <h3 style={{fontSize:'1.05rem',fontWeight:700,lineHeight:1.4,marginBottom:'0.6rem',marginTop:'0.6rem'}}>{a.title}</h3>
              <p className="line-clamp-2" style={{color:'var(--gray)',fontSize:'0.85rem',lineHeight:1.6,marginBottom:'1rem'}}>{a.hook}</p>
              <div style={{fontSize:'0.78rem',color:'var(--gray)',display:'flex',gap:'1rem'}}>
                <span>{fmtDate(a.publishDate)}</span><span>{a.readTime||5} min read</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{background:'linear-gradient(135deg,rgba(243,121,61,0.15) 0%,transparent 70%)',border:'1px solid rgba(243,121,61,0.2)',borderRadius:'16px',padding:'4rem 2rem',textAlign:'center',maxWidth:'800px',margin:'0 auto 6rem'}}>
        <h2 style={{fontSize:'2rem',fontWeight:800,marginBottom:'1rem'}}>Ready to start your project?</h2>
        <p style={{color:'var(--gray)',marginBottom:'2rem'}}>We design permit-ready fire protection systems.</p>
        <a href="/contact" className="btn-primary">Get in Touch</a>
      </section>
    </>
  );
}
