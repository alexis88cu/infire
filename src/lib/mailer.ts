import nodemailer from 'nodemailer';

export function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  const transporter = createTransporter();
  const fromAddress = from || `Infire Inc. <${process.env.GMAIL_USER}>`;
  await transporter.sendMail({ from: fromAddress, to, subject, html });
}
