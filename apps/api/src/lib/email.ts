import nodemailer from 'nodemailer'

function transporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

const FROM = process.env.GMAIL_USER ?? 'zedspeaks.info@gmail.com'

const esc = (v: string) => v.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`)

function shell(content: string) {
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;background:#f8fafc;padding:40px 20px;margin:0">
<div style="max-width:380px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.1)">
  <h1 style="margin:0 0 20px;color:#db2777;font-size:22px">ZedSpeaks</h1>
  ${content}
</div></body></html>`
}

export async function sendApprovalEmail(to: string, frontendUrl: string) {
  await transporter().sendMail({
    from: `ZedSpeaks <${FROM}>`,
    to,
    subject: `You're approved for ZedSpeaks!`,
    html: shell(`
      <p style="color:#1e293b;font-size:18px;font-weight:700;margin:0 0 8px">You're approved!</p>
      <p style="color:#475569;margin:0 0 20px">Your ZedSpeaks account is now active. Sign in to get started.</p>
      <a href="${esc(frontendUrl)}/login" style="display:inline-block;padding:12px 24px;background:#db2777;color:#fff;border-radius:12px;font-weight:700;text-decoration:none">Open ZedSpeaks</a>
    `),
  })
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  _applicantEmail: string, // not included in the email: details stay in the dashboard
  frontendUrl: string,
) {
  await transporter().sendMail({
    from: `ZedSpeaks <${FROM}>`,
    to: adminEmail,
    subject: 'New ZedSpeaks access request',
    html: shell(`
      <p style="color:#475569;margin:0 0 16px">A new access request is waiting for your approval in the dashboard.</p>
      <a href="${esc(frontendUrl)}/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#db2777;color:#fff;border-radius:12px;font-weight:700;text-decoration:none">Review request</a>
    `),
  })
}
