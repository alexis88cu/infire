import { NextResponse } from 'next/server';
import { getAllSubscribers } from '@/lib/subscribers-store';

export async function GET() {
  try {
    const subscribers = await getAllSubscribers();
    return NextResponse.json(subscribers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
