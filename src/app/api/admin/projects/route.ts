import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'src/lib/projects.json');

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
    // Return only fields needed for admin
    const lite = data.map((p: any) => ({
      slug: p.slug,
      projectName: p.projectName,
      city: p.city,
      sector: p.sector,
      description: p.description,
      narrative: p.narrative,
      featuredImage: p.featuredImage,
    }));
    return NextResponse.json(lite);
  } catch {
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, description, narrative, featuredImage } = body;
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
    const idx = data.findIndex((p: any) => p.slug === slug);
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    if (description !== undefined) data[idx].description = description;
    if (narrative !== undefined) data[idx].narrative = narrative;
    if (featuredImage !== undefined) data[idx].featuredImage = featuredImage;

    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ ok: true, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
