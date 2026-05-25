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

const FROM = process.env.GMAIL_USER ?? 'noreply@zedspeaks.com'

function shell(content: string) {
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;background:#f8fafc;padding:40px 20px;margin:0">
<div style="max-width:380px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.1)">
  <h1 style="margin:0 0 20px;color:#db2777;font-size:22px">ZedSpeaks</h1>
  ${content}
</div></body></html>`
}

export async function sendApprovalEmail(to: string, name: string, frontendUrl: string) {
  await transporter().sendMail({
    from: `ZedSpeaks <${FROM}>`,
    to,
    subject: `You're approved for ZedSpeaks!`,
    html: shell(`
      <p style="color:#1e293b;font-size:18px;font-weight:700;margin:0 0 8px">Hi ${name}, you're approved!</p>
      <p style="color:#475569;margin:0 0 20px">Your ZedSpeaks account is now active. Sign in to get started.</p>
      <a href="${frontendUrl}/login" style="display:inline-block;padding:12px 24px;background:#db2777;color:#fff;border-radius:12px;font-weight:700;text-decoration:none">Open ZedSpeaks</a>
    `),
  })
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  applicantName: string,
  applicantEmail: string,
  relation: string,
  frontendUrl: string,
) {
  await transporter().sendMail({
    from: `ZedSpeaks <${FROM}>`,
    to: adminEmail,
    subject: `New ZedSpeaks access request from ${applicantName}`,
    html: shell(`
      <p style="color:#475569;margin:0 0 16px">A new access request is waiting for your approval.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="color:#94a3b8;padding:4px 0">Name</td><td style="color:#1e293b;font-weight:600">${applicantName}</td></tr>
        <tr><td style="color:#94a3b8;padding:4px 0">Email</td><td style="color:#1e293b">${applicantEmail}</td></tr>
        <tr><td style="color:#94a3b8;padding:4px 0">Role</td><td style="color:#1e293b">${relation}</td></tr>
      </table>
      <a href="${frontendUrl}/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#db2777;color:#fff;border-radius:12px;font-weight:700;text-decoration:none">Review request</a>
    `),
  })
}
