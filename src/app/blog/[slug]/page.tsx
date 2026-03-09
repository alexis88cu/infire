import { getArticles, getArticle, fmtDate } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = getArticle(params.slug);
  if (!a) return {};
  return { title: a.seoTitle || `${a.title} | Infire Inc.`, description: a.seoDescription || a.hook?.slice(0,155) };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();
  const tags = typeof a.tags === 'string' ? a.tags.split(',').map(t=>t.trim()).filter(Boolean) : (a.tags||[]);
  const related = getArticles().filter(x => x.category === a.category && x.slug !== a.slug).slice(0,2);
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'4rem 2rem'}}>
      <a href="/blog" className="back-link">← Back to Blog</a>
      <div style={{display:'flex',gap:'0.6rem',alignItems:'center',marginBottom:'1.25rem',flexWrap:'wrap'}}>
        <span className="badge badge-orange">{a.category}</span>
        <span style={{color:'var(--gray)',fontSize:'0.82rem'}}>{fmtDate(a.publishDate)}</span>
        <span style={{color:'var(--gray)',fontSize:'0.82rem'}}>· {a.readTime||5} min read</span>
        <span style={{color:'var(--gray)',fontSize:'0.82rem'}}>· {a.author||'Infire Author'}</span>
      </div>
      <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:900,lineHeight:1.25,marginBottom:'0.75rem'}}>{a.title}</h1>
      {a.subtitle && <p style={{color:'#adb5bd',fontSize:'1.05rem',marginBottom:'2rem',lineHeight:1.5}}>{a.subtitle}</p>}
      <div style={{height:'1px',background:'var(--border)',margin:'2rem 0'}}/>
      {a.hook && (
        <p style={{fontSize:'1.05rem',color:'#c9d1d9',lineHeight:1.8,marginBottom:'2rem',fontStyle:'italic',borderLeft:'3px solid var(--orange)',paddingLeft:'1.25rem'}}>{a.hook}</p>
      )}
      {a.body && (
        <div style={{marginBottom:'2.5rem'}}>
          {a.body.split('\n\n').map((para,i)=>(
            <p key={i} style={{color:'#adb5bd',lineHeight:1.85,fontSize:'0.95rem',marginBottom:'1.25rem'}}>{para}</p>
          ))}
        </div>
      )}
      {a.takeaway && (
        <blockquote style={{background:'rgba(243,121,61,0.08)',border:'1px solid rgba(243,121,61,0.2)',borderLeft:'4px solid var(--orange)',borderRadius:'0 8px 8px 0',padding:'1.25rem 1.5rem',margin:'2.5rem 0',color:'#e6edf3',fontSize:'0.95rem',lineHeight:1.7,fontStyle:'italic'}}>{a.takeaway}</blockquote>
      )}
      {tags.length > 0 && (
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'3rem'}}>
          {tags.map(tag=><span key={tag} className="tag">{tag}</span>)}
        </div>
      )}
      <div style={{height:'1px',background:'var(--border)',margin:'2.5rem 0'}}/>
      {related.length > 0 && (
        <div style={{marginBottom:'2.5rem'}}>
          <h3 style={{fontWeight:700,marginBottom:'1.25rem',fontSize:'1rem'}}>Related Articles</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem'}}>
            {related.map(r=>(
              <a key={r.slug} href={`/blog/${r.slug}`} className="card-flat">
                <div style={{fontSize:'0.72rem',color:'var(--orange)',marginBottom:'0.4rem'}}>{r.category}</div>
                <h4 style={{fontSize:'0.9rem',fontWeight:700,lineHeight:1.4}}>{r.title}</h4>
                <p style={{color:'var(--gray)',fontSize:'0.78rem',marginTop:'0.4rem'}}>{fmtDate(r.publishDate)} · {r.readTime||5} min</p>
              </a>
            ))}
          </div>
        </div>
      )}
      <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'2rem',textAlign:'center'}}>
        <p style={{fontWeight:700,marginBottom:'0.5rem'}}>Need fire protection engineering on your project?</p>
        <p style={{color:'var(--gray)',fontSize:'0.88rem',marginBottom:'1.25rem'}}>Infire designs NFPA-compliant systems for residential, commercial, and institutional buildings.</p>
        <a href="/contact" className="btn-sm">Get a Quote</a>
      </div>
    </div>
  );
}
