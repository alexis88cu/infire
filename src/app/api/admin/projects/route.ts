import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'src/lib/projects.json');

function loadProjects() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

// GET — return all projects
export async function GET() {
  try {
    const projects = loadProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

// PATCH — update a single project's editable fields
export async function PATCH(req: NextRequest) {
  try {
    const { slug, updates } = await req.json();
    if (!slug || !updates) {
      return NextResponse.json({ error: 'slug and updates required' }, { status: 400 });
    }

    const projects = loadProjects();
    const idx = projects.findIndex((p: any) => p.slug === slug);
    if (idx === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Only allow safe fields to be updated
    const ALLOWED = ['description', 'narrative', 'featuredImage', 'shortDescription'];
    for (const key of ALLOWED) {
      if (updates[key] !== undefined) {
        projects[idx][key] = updates[key];
      }
    }

    writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
    return NextResponse.json({ ok: true, project: projects[idx] });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
