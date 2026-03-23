import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

// Curated topic list for automated weekly posts
const TOPICS = [
  {
    topic: 'Fire sprinkler head types: pendant, upright, sidewall, and concealed — selection criteria and code requirements',
    category: 'Engineering Insight',
    tags: ['Sprinklers', 'NFPA 13', 'System Design', 'Head Types'],
    image: 'https://images.unsplash.com/photo-1590273946776-394a07d71413?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire sprinkler head installed in ceiling',
  },
  {
    topic: 'Wet vs dry vs preaction vs deluge: choosing the right sprinkler system type for your project',
    category: 'Engineering Insight',
    tags: ['System Types', 'NFPA 13', 'System Design', 'Wet Pipe', 'Dry Pipe'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Industrial fire protection piping',
  },
  {
    topic: 'NFPA 72 fire alarm system design: detection, notification, and code compliance for commercial buildings',
    category: 'Code Update',
    tags: ['NFPA 72', 'Fire Alarm', 'System Design', 'Commercial'],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Commercial building fire alarm system',
  },
  {
    topic: 'Occupancy hazard classification: how to determine Light, Ordinary, and Extra Hazard groups under NFPA 13',
    category: 'Engineering Insight',
    tags: ['Hazard Classification', 'NFPA 13', 'System Design', 'Occupancy'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Commercial building exterior',
  },
  {
    topic: 'Standpipe systems: Classes I, II, and III — when each applies and NFPA 14 design requirements',
    category: 'Engineering Insight',
    tags: ['Standpipe', 'NFPA 14', 'High-Rise', 'System Design'],
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'High-rise building fire protection standpipe',
  },
  {
    topic: 'NFPA 13R and 13D: residential sprinkler systems for multifamily and one-and-two family dwellings',
    category: 'Code Update',
    tags: ['Residential', 'NFPA 13R', 'NFPA 13D', 'Sprinklers'],
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Residential building fire sprinkler system',
  },
  {
    topic: 'Fire department connections: design requirements, placement, and signage under NFPA 13',
    category: 'Engineering Insight',
    tags: ['FDC', 'NFPA 13', 'Water Supply', 'System Design'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire department siamese connection on building facade',
  },
  {
    topic: 'Backflow preventers in fire protection systems: types, NFPA requirements, and annual testing procedures',
    category: 'Inspection & ITM',
    tags: ['Backflow', 'NFPA 25', 'Water Supply', 'Testing'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire protection piping and valve assembly',
  },
  {
    topic: 'Hydraulic calculations for fire sprinkler systems: density/area method and pipe schedule design',
    category: 'Engineering Insight',
    tags: ['Hydraulics', 'NFPA 13', 'System Design', 'Calculations'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Engineering drawings and hydraulic calculations',
  },
  {
    topic: 'Storage protection: in-rack sprinklers, commodity classification, and NFPA 13 requirements for warehouses',
    category: 'Engineering Insight',
    tags: ['Storage', 'NFPA 13', 'Warehouses', 'Rack Storage'],
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Warehouse rack storage with overhead sprinkler system',
  },
  {
    topic: 'ESFR sprinklers: Early Suppression Fast Response heads for high-bay warehouse applications',
    category: 'Engineering Insight',
    tags: ['ESFR', 'NFPA 13', 'Warehouses', 'Storage Protection'],
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Large warehouse facility with ESFR sprinkler system',
  },
  {
    topic: 'Clean agent suppression systems: FM-200 and Novec 1230 for data centers and sensitive equipment rooms',
    category: 'Engineering Insight',
    tags: ['Clean Agent', 'NFPA 2001', 'Data Centers', 'Special Hazards'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Data center server room with fire suppression system',
  },
  {
    topic: 'Valve supervision and tamper switches: maintaining service-ready sprinkler systems per NFPA 25',
    category: 'Inspection & ITM',
    tags: ['Valves', 'NFPA 25', 'ITM', 'Supervision'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire protection control valve with tamper switch',
  },
  {
    topic: 'Underground fire mains: pipe materials, installation, and hydrostatic testing per NFPA 24',
    category: 'Engineering Insight',
    tags: ['Underground', 'NFPA 24', 'Water Supply', 'Installation'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Underground fire main installation',
  },
  {
    topic: 'Sprinkler system impairment procedures: emergency and preplanned impairment management under NFPA 25',
    category: 'Inspection & ITM',
    tags: ['Impairment', 'NFPA 25', 'Fire Watch', 'ITM'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire protection system maintenance and inspection',
  },
  {
    topic: 'Kitchen hood fire suppression systems: NFPA 96 requirements and wet chemical agent design',
    category: 'Engineering Insight',
    tags: ['Kitchen', 'Suppression', 'NFPA 96', 'Wet Chemical'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Commercial kitchen hood fire suppression system',
  },
  {
    topic: 'Foam-water sprinkler systems for flammable liquid hazards: NFPA 16 design and application',
    category: 'Engineering Insight',
    tags: ['Foam', 'NFPA 16', 'Special Hazards', 'Flammable Liquids'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Industrial fire protection for flammable liquid storage',
  },
  {
    topic: 'As-built drawings and record keeping for fire protection systems: NFPA 25 documentation requirements',
    category: 'Inspection & ITM',
    tags: ['Documentation', 'As-Built', 'NFPA 25', 'Record Keeping'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire protection system as-built drawings',
  },
  {
    topic: 'Special hazard occupancies: fire protection design for aircraft hangars, parking structures, and cold storage',
    category: 'Engineering Insight',
    tags: ['Special Hazards', 'NFPA 13', 'Aircraft Hangars', 'Parking'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Special occupancy building fire protection',
  },
  {
    topic: 'Anti-freeze sprinkler systems: glycol solutions, system design, and NFPA 13 requirements for unheated spaces',
    category: 'Engineering Insight',
    tags: ['Anti-Freeze', 'NFPA 13', 'System Design', 'Cold Weather'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85&auto=format&fit=crop',
    imageAlt: 'Fire sprinkler system in unheated building',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const force = req.nextUrl.searchParams.get('force') === '1';

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Read current articles
    const blogPath = path.join(process.cwd(), 'src/lib/blog.json');
    const articles: any[] = JSON.parse(readFileSync(blogPath, 'utf-8'));

    // Skip if already posted this week (unless forced)
    if (!force) {
      const sorted = [...articles].sort(
        (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
      const lastPost = sorted[0];
      if (lastPost) {
        const daysSince = (Date.now() - new Date(lastPost.publishDate).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < 6) {
          return NextResponse.json({
            message: 'Already posted this week',
            lastPost: lastPost.slug,
            daysAgo: Math.round(daysSince),
          });
        }
      }
    }

    // Find available topics (not yet covered)
    const existingSlugs = new Set(articles.map((a: any) => a.slug));
    const existingTitles = articles.map((a: any) => a.title.toLowerCase());
    const available = TOPICS.filter((t) => {
      const topicSlug = slugify(t.topic.split(':')[0]);
      return (
        !existingSlugs.has(topicSlug) &&
        !existingTitles.some((title) =>
          title.includes(t.topic.split(':')[0].toLowerCase().slice(0, 30))
        )
      );
    });

    if (available.length === 0) {
      return NextResponse.json({ message: 'All topics have been covered — add more to TOPICS list.' });
    }

    // Pick a random available topic
    const topicData = available[Math.floor(Math.random() * available.length)];
    const today = new Date().toISOString();

    // Generate article with Claude
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `You are a fire protection engineering expert writing for Infire Inc. (infireinc.net), a fire protection engineering consulting company based in Miami, FL.

Write a professional, authoritative blog article on this exact topic:
"${topicData.topic}"

Article requirements:
- Audience: fire protection engineers, designers, contractors, AHJs, and building industry professionals
- Based on current NFPA standards and real field practice
- Practical, direct, technical — no marketing fluff
- Body length: 600-900 words minimum
- Use this exact markdown body format:

**Section Title — Optional Subtitle**

Content paragraphs with double newlines between them.

*Subsection label* starts a subsection within a section.

Another paragraph continues.

---

Return ONLY a valid JSON object (no markdown wrapper, no backticks, raw JSON only) with these exact fields:
{
  "title": "Specific, practitioner-focused title (max 72 chars)",
  "subtitle": "What the reader will learn — specific and practical (max 120 chars)",
  "hook": "2-3 sentence compelling opening that states the core problem or insight. Written for engineers, not marketers.",
  "body": "Full article body in the markdown format shown above. Minimum 600 words. Use **Section Title** for sections, *subsection* for subsections, double newlines between paragraphs.",
  "takeaway": "One sentence summary of the key practical insight for practitioners",
  "seoTitle": "Title | Infire Inc. (max 70 chars)",
  "seoDescription": "150-160 character meta description for search engines"
}`;

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.json();
      return NextResponse.json({ error: 'Claude API error', details: err }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const rawText: string = aiData.content[0].text.trim();

    let generated: any;
    try {
      generated = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Could not parse Claude response as JSON');
      generated = JSON.parse(match[0]);
    }

    // Build complete article object matching blog.json schema
    const slug = slugify(generated.title);
    const wordCount = generated.body.split(/\s+/).length;
    const article = {
      _id: slug.replace(/-/g, '_').slice(0, 50),
      slug,
      title: generated.title,
      subtitle: generated.subtitle,
      author: 'Infire Author',
      publishDate: today,
      category: topicData.category,
      tags: topicData.tags,
      readTime: Math.max(3, Math.ceil(wordCount / 200)),
      featuredImage: topicData.image,
      seoTitle: generated.seoTitle,
      seoDescription: generated.seoDescription,
      publishedOnSite: true,
      featured: false,
      hook: generated.hook,
      body: generated.body,
      takeaway: generated.takeaway,
      imageConceptNote: `Fire protection engineering: ${topicData.topic.split(':')[0]}`,
      imageAlt: topicData.imageAlt,
      imageLayout: 'hero-full',
      inlineImages: {},
    };

    // Prepend new article to blog posts
    const updatedArticles = [article, ...articles];

    // Commit to GitHub to persist and trigger Vercel redeploy
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // format: "owner/repo"

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return NextResponse.json(
        {
          error: 'GitHub not configured — post generated but not saved.',
          hint: 'Set GITHUB_TOKEN and GITHUB_REPO env vars in Vercel.',
          article,
        },
        { status: 500 }
      );
    }

    const filePath = 'src/lib/blog.json';

    // Get current file SHA (required for update)
    const fileRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!fileRes.ok) {
      const err = await fileRes.json();
      return NextResponse.json({ error: 'GitHub file fetch failed', details: err }, { status: 500 });
    }

    const { sha } = await fileRes.json();

    // Commit updated blog.json
    const content = Buffer.from(JSON.stringify(updatedArticles, null, 2)).toString('base64');

    const commitRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `blog: weekly auto-post "${article.title}"`,
          content,
          sha,
        }),
      }
    );

    if (!commitRes.ok) {
      const err = await commitRes.json();
      return NextResponse.json({ error: 'GitHub commit failed', details: err }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      slug: article.slug,
      title: article.title,
      wordCount,
      message: 'Post generated and committed. Vercel will auto-deploy in ~2 minutes.',
    });
  } catch (err: any) {
    console.error('[CRON GENERATE-POST ERROR]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
