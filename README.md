# Infire Inc. — infireinc.com

Built with Next.js 14, deployed on Vercel.

## Adding New Projects
Edit `src/lib/projects.json` and push to GitHub. Vercel auto-deploys.

## Adding Blog Articles
Edit `src/lib/blog.json` and push. Format:
```json
{
  "slug": "your-article-slug",
  "title": "Article Title",
  "category": "Code Update",
  "publishDate": "2026-03-20T08:00:00.000Z",
  "readTime": 5,
  "hook": "Opening paragraph...",
  "body": "Body text...",
  "takeaway": "Closing quote...",
  "seoTitle": "SEO Title | Infire Inc.",
  "seoDescription": "Meta description...",
  "featured": false
}
```

## Tech
- Next.js 14 (static export)
- Zero dependencies beyond React
- Auto-deploys via Vercel GitHub integration
