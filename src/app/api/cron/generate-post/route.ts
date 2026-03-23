import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

// ─── Source blog configurations ───────────────────────────────────────────────

const SOURCES = [
  {
    name: 'qrfs',
    listingUrl: 'https://blog.qrfs.com/',
    // WordPress: articles linked from h2.entry-title > a
    articleLinkPattern: /href="(https?:\/\/blog\.qrfs\.com\/\d+[^"]+)"/g,
    contentSelectors: ['entry-content', 'post-content', 'article-content'],
  },
  {
    name: 'sprinklermatic',
    listingUrl: 'https://sprinklermatic.com/blog/',
    articleLinkPattern: /href="(https?:\/\/sprinklermatic\.com\/blog\/[a-z0-9\-]+\/)"/g,
    contentSelectors: ['entry-content', 'post-content', 'article-content'],
  },
  {
    name: 'nfpa',
    listingUrl: 'https://www.nfpa.org/news-blogs-and-articles/NFPA-Blogs',
    articleLinkPattern: /href="(\/news-blogs-and-articles\/blogs\/[^"]+)"/g,
    baseUrl: 'https://www.nfpa.org',
    contentSelectors: ['article-body', 'rich-text', 'blog-content'],
  },
];

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

// ─── HTML utilities ────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractSection(html: string, classNames: string[]): string {
  for (const cls of classNames) {
    const pattern = new RegExp(
      `class="[^"]*${cls}[^"]*"[^>]*>([\\s\\S]{200,})`,
      'i'
    );
    const m = html.match(pattern);
    if (m) {
      // Take up to 6000 chars of content
      return stripHtml(m[1].slice(0, 6000));
    }
  }
  // Fallback: strip all HTML
  return stripHtml(html).slice(0, 4000);
}

function extractTitle(html: string): string {
  const patterns = [
    /<h1[^>]*class="[^"]*(?:entry-title|post-title|article-title)[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
    /<h1[^>]*>([\s\S]*?)<\/h1>/i,
    /<title>([\s\S]*?)<\/title>/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return stripHtml(m[1]).trim().replace(/\s*[|\-–]\s*.+$/, '').trim();
  }
  return '';
}

async function fetchWithRetry(url: string, retries = 2): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) return await res.text();
      if (res.status === 403 || res.status === 401) return null; // blocked, don't retry
    } catch {
      if (i === retries) return null;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return null;
}

// ─── Slug helpers ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

// ─── Scrape: fetch listing → pick article → fetch body ────────────────────────

async function scrapeSource(
  sourceIdx: number
): Promise<{ title: string; body: string; sourceUrl: string } | null> {
  const source = SOURCES[sourceIdx];
  const listHtml = await fetchWithRetry(source.listingUrl);
  if (!listHtml) return null;

  const links: string[] = [];
  let m: RegExpExecArray | null;
  const pattern = new RegExp(source.articleLinkPattern.source, 'g');
  while ((m = pattern.exec(listHtml)) !== null) {
    const url = source.baseUrl ? source.baseUrl + m[1] : m[1];
    if (!links.includes(url)) links.push(url);
    if (links.length >= 8) break;
  }

  if (links.length === 0) return null;

  // Try articles until one returns content
  for (const url of links.slice(0, 5)) {
    const artHtml = await fetchWithRetry(url);
    if (!artHtml) continue;
    const title = extractTitle(artHtml);
    const body = extractSection(artHtml, source.contentSelectors);
    if (title && body.length > 300) {
      return { title, body, sourceUrl: url };
    }
  }

  return null;
}

// ─── Main cron handler ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const force = req.nextUrl.searchParams.get('force') === '1';

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO || 'alexis88cu/infire';

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Read current blog posts
    const blogPath = path.join(process.cwd(), 'src/lib/blog.json');
    const articles: any[] = JSON.parse(readFileSync(blogPath, 'utf-8'));

    // Skip if posted recently (unless forced)
    if (!force) {
      const sorted = [...articles].sort(
        (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
      const last = sorted[0];
      if (last) {
        const daysSince =
          (Date.now() - new Date(last.publishDate).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < 6) {
          return NextResponse.json({
            message: 'Already posted this week',
            lastPost: last.slug,
            daysAgo: Math.round(daysSince),
          });
        }
      }
    }

    // ── 1. Try to scrape source content ─────────────────────────────────────
    // Rotate sources by week number so we spread across all three
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    let scraped: { title: string; body: string; sourceUrl: string } | null = null;

    for (let attempt = 0; attempt < SOURCES.length; attempt++) {
      const sourceIdx = (weekNum + attempt) % SOURCES.length;
      scraped = await scrapeSource(sourceIdx);
      if (scraped) break;
    }

    // ── 2. Build Claude prompt ───────────────────────────────────────────────
    let prompt: string;

    if (scraped) {
      // Rewrite scraped content in technical language
      prompt = `You are a senior fire protection engineer writing for Infire Inc. (infireinc.net), a fire protection engineering consulting company in Miami, FL.

A recent fire protection industry article has been identified on this topic:
ORIGINAL TITLE: ${scraped.title}
ORIGINAL CONTENT EXCERPT:
${scraped.body.slice(0, 3000)}

Your task: Write an original, authoritative technical article for fire protection engineers that covers the same subject matter. The article must:
- Be completely original — no references to the source, no attribution
- Use precise NFPA code citations and engineering terminology
- Be written for licensed fire protection engineers, designers, and AHJs
- Expand on the technical details with additional depth and practical insights
- 650-950 words in the body

Body markdown format:
**Section Title — Optional Detail**

Technical paragraph content. Double newlines between paragraphs.

*Sub-heading* for subsections within a section.

Return ONLY a raw JSON object (no markdown fences) with:
{
  "title": "Specific technical title (max 72 chars)",
  "subtitle": "What the engineer will learn — precise and practical (max 120 chars)",
  "hook": "2-3 sentence opening that frames the engineering problem or code requirement. Direct, technical.",
  "body": "Full article body using the format above. 650-950 words.",
  "takeaway": "One-sentence key insight for field practitioners",
  "category": "Engineering Insight" or "Code Update" or "Inspection & ITM",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "seoTitle": "Title | Infire Inc. (max 70 chars)",
  "seoDescription": "150-160 char meta description"
}`;
    } else {
      // Fallback: generate original content from Claude's knowledge
      const existingTitles = articles.map((a: any) => a.title).join('\n');
      prompt = `You are a senior fire protection engineer writing for Infire Inc. (infireinc.net), a fire protection engineering consulting company in Miami, FL.

Write an original, authoritative technical article on a current fire protection engineering topic. Choose a topic NOT already covered by these existing articles:
${existingTitles}

Requirements:
- Pick a topic relevant to current NFPA standards, field engineering practice, or inspection/ITM
- Written for licensed fire protection engineers, designers, and AHJs
- Precise NFPA code citations, real engineering depth
- 650-950 words in the body

Body markdown format:
**Section Title — Optional Detail**

Technical paragraph. Double newlines between paragraphs.

*Sub-heading* for subsections.

Return ONLY a raw JSON object (no markdown fences) with:
{
  "title": "Specific technical title (max 72 chars)",
  "subtitle": "What the engineer will learn — precise and practical (max 120 chars)",
  "hook": "2-3 sentence opening that frames the engineering problem or code requirement. Direct, technical.",
  "body": "Full article body using the format above. 650-950 words.",
  "takeaway": "One-sentence key insight for field practitioners",
  "category": "Engineering Insight" or "Code Update" or "Inspection & ITM",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "seoTitle": "Title | Infire Inc. (max 70 chars)",
  "seoDescription": "150-160 char meta description"
}`;
    }

    // ── 3. Generate with Claude ──────────────────────────────────────────────
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
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse Claude response as JSON');
      generated = JSON.parse(jsonMatch[0]);
    }

    // ── 4. Build complete article object ────────────────────────────────────
    const slug = slugify(generated.title);
    const wordCount = generated.body.split(/\s+/).length;

    // Unsplash images mapped by category
    const categoryImages: Record<string, { url: string; alt: string }> = {
      'Engineering Insight': {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85&auto=format&fit=crop',
        alt: 'Fire protection engineering and piping systems',
      },
      'Code Update': {
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=85&auto=format&fit=crop',
        alt: 'Engineering code documentation and standards review',
      },
      'Inspection & ITM': {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&auto=format&fit=crop',
        alt: 'Fire protection system inspection and testing',
      },
    };
    const img = categoryImages[generated.category] || categoryImages['Engineering Insight'];

    const article = {
      _id: slug.replace(/-/g, '_').slice(0, 50),
      slug,
      title: generated.title,
      subtitle: generated.subtitle,
      author: 'Infire Author',
      publishDate: new Date().toISOString(),
      category: generated.category,
      tags: generated.tags,
      readTime: Math.max(3, Math.ceil(wordCount / 200)),
      featuredImage: img.url,
      seoTitle: generated.seoTitle,
      seoDescription: generated.seoDescription,
      publishedOnSite: true,
      featured: false,
      hook: generated.hook,
      body: generated.body,
      takeaway: generated.takeaway,
      imageConceptNote: `Fire protection engineering: ${generated.title}`,
      imageAlt: img.alt,
      imageLayout: 'hero-full',
      inlineImages: {},
    };

    const updatedArticles = [article, ...articles];

    // ── 5. Commit to GitHub ──────────────────────────────────────────────────
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        {
          error: 'GITHUB_TOKEN not configured — post generated but not saved.',
          article,
        },
        { status: 500 }
      );
    }

    const filePath = 'src/lib/blog.json';
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
      scraped: scraped ? scraped.sourceUrl : 'fallback-generated',
      message: 'Post published and committed. Vercel will auto-deploy.',
    });
  } catch (err: any) {
    console.error('[CRON GENERATE-POST ERROR]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
