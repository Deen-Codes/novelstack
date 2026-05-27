// NovelStack — transactional email via Resend.
import 'server-only';
import { Resend } from 'resend';

const FROM = 'NovelStack <hello@novelstack.app>';

export async function sendMagicLinkEmail(email: string, link: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');

  const { error } = await new Resend(key).emails.send({
    from: FROM,
    to: email,
    subject: 'Your NovelStack sign-in link',
    html: magicLinkHtml(link),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

function magicLinkHtml(link: string): string {
  // Dark/ember theme — matches the in-app palette. Coral period on the
  // wordmark, cream text on a near-black canvas, coral CTA.
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#14110F;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table width="460" cellpadding="0" cellspacing="0" style="background:#1B1714;border:1px solid #2A231F;border-radius:16px;">
      <tr><td style="padding:32px 36px 8px;">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.01em;color:#F2E9DA;">novelstack<span style="color:#C8414E;">.</span></div>
      </td></tr>
      <tr><td style="padding:14px 36px 0;">
        <h1 style="margin:0;font-size:24px;font-weight:600;letter-spacing:-0.01em;color:#F2E9DA;">Your sign-in link</h1>
        <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#A59886;">Tap the button below to sign in to NovelStack. The same link works whether this is your first time here or your hundredth — no password to remember.</p>
      </td></tr>
      <tr><td style="padding:26px 36px 8px;">
        <a href="${link}" style="display:block;background:#C8414E;color:#FFFFFF;text-decoration:none;text-align:center;font-size:15px;font-weight:700;padding:14px 0;border-radius:999px;">Sign in to NovelStack</a>
      </td></tr>
      <tr><td style="padding:8px 36px 0;">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#8A7E6E;">Open this email on the device you want to sign in on. The link expires in 60 minutes and can be used once. If you didn't request it, you can ignore this email.</p>
      </td></tr>
      <tr><td style="padding:22px 36px 30px;">
        <div style="border-top:1px solid #2A231F;padding-top:16px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#6E6353;">Trouble with the button? Paste this link into your browser:<br /><span style="color:#A59886;word-break:break-all;">${link}</span></p>
        </div>
      </td></tr>
    </table>
    <p style="margin:18px 0 0;font-size:12px;color:#6E6353;">NovelStack · Stories worth following</p>
  </td></tr>
</table>`;
}
