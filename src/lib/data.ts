import { readFileSync } from 'fs';
import { join } from 'path';

const PROJECTS_PATH = join(process.cwd(), 'src/lib/projects.json');
const BLOG_PATH = join(process.cwd(), 'src/lib/blog.json');

export interface Project {
  slug: string;
  projectName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  projectType?: string;
  sector?: string;
  deliveryStatus?: string;
  description?: string;
  systemsScope?: string;
  estimatedSprinklers?: number;
  featured?: boolean;
  tags?: string | string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  narrative?: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  author?: string;
  publishDate?: string;
  category?: string;
  tags?: string | string[];
  readTime?: number;
  hook?: string;
  body?: string;
  takeaway?: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
}

function readProjects(): Project[] {
  return JSON.parse(readFileSync(PROJECTS_PATH, 'utf8')) as Project[];
}

function readArticles(): Article[] {
  return JSON.parse(readFileSync(BLOG_PATH, 'utf8')) as Article[];
}

export function getProjects(): Project[] {
  return readProjects().sort((a, b) => (b.estimatedSprinklers || 0) - (a.estimatedSprinklers || 0));
}

export function getProject(slug: string): Project | undefined {
  return readProjects().find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return readProjects().filter(p => p.featured).slice(0, 6);
}

export function getArticles(): Article[] {
  return readArticles().sort((a, b) =>
    new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()
  );
}

export function getArticle(slug: string): Article | undefined {
  return readArticles().find(a => a.slug === slug);
}

export function getSiteMetrics() {
  const projects = readProjects();
  const total = projects.reduce((sum, p) => sum + (p.estimatedSprinklers || 0), 0);
  const cities = new Set(projects.map(p => p.city).filter(Boolean)).size;
  return {
    totalSprinklers: Math.round(total),
    totalProjects: projects.length,
    cities,
    yearsActive: new Date().getFullYear() - 2016,
  };
}

export function fmtDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return dateStr.slice(0, 10); }
}
