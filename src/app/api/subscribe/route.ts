import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { addSubscriber } from '@/lib/subscribers-store';

export async function POST(req: NextRequest) {
  try {
    const { name, industry, email, newsletter } = await req.json();

    if (!name || !industry || !email) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@infireinc.com';
    const GMAIL_USER = process.env.GMAIL_USER;

    if (!GMAIL_USER) {
      // Dev mode: log and return success
      console.log('[SUBSCRIBE] New subscriber (no Gmail configured):', { name, industry, email, newsletter });
      return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
    }

    // 1. Save subscriber to GitHub-stored JSON
    await addSubscriber({ email, name, industry, newsletter: !!newsletter });

    // 2. Send welcome email to subscriber
    const firstName = name.split(' ')[0];
    const welcomeHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to Infire</title></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-size:1.4rem;font-weight:900;color:#f3793d;">INFIRE</span>
      <span style="font-size:0.8rem;color:#7d8590;margin-left:8px;">Fire Protection Engineering</span>
    </div>
    <h1 style="color:#e6edf3;font-size:1.6rem;font-weight:900;margin-bottom:12px;line-height:1.3;">
      You're subscribed, ${firstName}. 🔥
    </h1>
    <p style="color:#adb5bd;line-height:1.7;margin-bottom:20px;">
      Welcome to the Infire weekly briefing — your shortcut to what's changing in fire protection engineering, NFPA code, and field practice.
    </p>
    <div style="background:rgba(243,121,61,0.08);border:1px solid rgba(243,121,61,0.2);border-radius:8px;padding:20px;margin-bottom:28px;">
      <p style="color:#e6edf3;font-size:0.9rem;line-height:1.7;margin:0;">
        <strong>What to expect:</strong><br/>
        A new article every week covering NFPA updates, design insights, inspection topics, and real-world project lessons. No spam. Straight fire protection content.
      </p>
    </div>
    <p style="color:#adb5bd;line-height:1.7;margin-bottom:28px;">
      While you wait for the next issue, catch up on our latest articles:
    </p>
    <a href="https://infireinc.com/blog" style="display:inline-block;background:#f3793d;color:#fff;padding:12px 28px;border-radius:6px;font-weight:700;text-decoration:none;font-size:0.9rem;margin-bottom:32px;">
      Read the Blog →
    </a>
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
      <p style="color:#7d8590;font-size:0.78rem;line-height:1.6;margin:0;">
        You're receiving this because you subscribed at infireinc.com.<br/>
        <a href="https://infireinc.com" style="color:#f3793d;">Infire Inc.</a> · Miami, FL
      </p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to: email,
      subject: `Welcome to the Infire Weekly Briefing, ${firstName}!`,
      html: welcomeHtml,
    });

    // 3. Notify admin of new subscriber
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New subscriber: ${name} (${industry})`,
      html: `<p><strong>New subscriber:</strong><br/>Name: ${name}<br/>Industry: ${industry}<br/>Email: ${email}<br/>Newsletter: ${newsletter ? 'Yes' : 'No'}</p>`,
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' });

  } catch (err) {
    console.error('[SUBSCRIBE ERROR]', err);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}
