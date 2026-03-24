import { NextRequest, NextResponse } from 'next/server';

// This cron runs 2 hours after generate-post to ensure Vercel has redeployed
// with the new blog post before sending the newsletter.
// Schedule: Mondays 10:00 AM UTC (generate-post runs at 8:00 AM UTC)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const NEWSLETTER_SECRET = process.env.NEWSLETTER_SECRET;
  if (!NEWSLETTER_SECRET) {
    return NextResponse.json({ error: 'NEWSLETTER_SECRET not configured' }, { status: 500 });
  }

  try {
    // Determine own base URL for internal API call
    const host = req.headers.get('host') || 'infireinc.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Call the existing /api/newsletter endpoint with the latest post
    const res = await fetch(`${baseUrl}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: NEWSLETTER_SECRET }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[CRON SEND-NEWSLETTER ERROR]', data);
      return NextResponse.json(
        { error: 'Newsletter send failed', details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      broadcast_id: data.broadcast_id,
      article: data.article,
      sent: data.sent,
    });
  } catch (err: any) {
    console.error('[CRON SEND-NEWSLETTER ERROR]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
