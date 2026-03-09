import { getArticles, fmtDate } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Infire Inc. Fire Protection Engineering',
  description: 'Fire protection engineering insights, NFPA code updates, and field reports from South Florida.',
};

export default function BlogPage() {
  const articles = getArticles();
  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'4rem 2rem'}}>
      <div style={{marginBottom:'3.5rem'}}>
        <p className="section-label">From the Field</p>
        <h1 style={{fontSize:'2.5rem',fontWeight:900,marginBottom:'0.75rem',marginTop:'0.5rem'}}>Blog</h1>
        <p style={{color:'var(--gray)',fontSize:'1rem'}}>
          Fire protection engineering insights, NFPA code updates, and field observations. New article every 3 days.
        </p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
        {articles.map((a)=>(
          <a key={a.slug} href={`/blog/${a.slug}`} className="card-flat">
            <div style={{display:'flex',gap:'0.6rem',alignItems:'center',marginBottom:'0.75rem',flexWrap:'wrap'}}>
              <span className="badge badge-orange">{a.category}</span>
              <span style={{color:'var(--gray)',fontSize:'0.78rem'}}>{fmtDate(a.publishDate)}</span>
              <span style={{color:'var(--gray)',fontSize:'0.78rem'}}>· {a.readTime||5} min read</span>
              {a.featured && <span className="badge badge-blue">Featured</span>}
            </div>
            <h2 style={{fontSize:'1.15rem',fontWeight:800,lineHeight:1.35,marginBottom:'0.6rem'}}>{a.title}</h2>
            {a.subtitle && <p style={{color:'#adb5bd',fontSize:'0.88rem',marginBottom:'0.5rem'}}>{a.subtitle}</p>}
            <p className="line-clamp-2" style={{color:'var(--gray)',fontSize:'0.88rem',lineHeight:1.6}}>{a.hook}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
