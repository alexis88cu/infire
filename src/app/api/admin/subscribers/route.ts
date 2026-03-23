import { NextResponse } from 'next/server';

export async function GET() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return NextResponse.json({ error: 'Resend not configured.' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: 'Resend error', details: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data.data ?? data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
