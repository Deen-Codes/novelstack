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
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EDE4D0;padding:32px 0;font-family:Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table width="460" cellpadding="0" cellspacing="0" style="background:#FBF7EA;border:1px solid #E2D7BD;border-radius:14px;">
      <tr><td style="padding:32px 36px 8px;">
        <div style="font-family:Georgia,serif;font-size:22px;color:#2A2418;">novelstack<span style="color:#E54B2A;">.</span></div>
      </td></tr>
      <tr><td style="padding:14px 36px 0;">
        <h1 style="margin:0;font-family:Georgia,serif;font-size:25px;font-weight:normal;color:#2A2418;">Your sign-in link</h1>
        <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#6B5E48;">Tap the button below to sign in to NovelStack. The same link works whether this is your first time here or your hundredth — no password to remember.</p>
      </td></tr>
      <tr><td style="padding:26px 36px 8px;">
        <a href="${link}" style="display:block;background:#E54B2A;color:#FBF7EA;text-decoration:none;text-align:center;font-size:15px;font-weight:bold;padding:14px 0;border-radius:24px;">Sign in to NovelStack</a>
      </td></tr>
      <tr><td style="padding:8px 36px 0;">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#8A7659;">Open this email on the device you want to sign in on. The link expires in 60 minutes and can be used once. If you didn't request it, you can ignore this email.</p>
      </td></tr>
      <tr><td style="padding:22px 36px 30px;">
        <div style="border-top:1px solid #E2D7BD;padding-top:16px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#A89A7E;">Trouble with the button? Paste this link into your browser:<br /><span style="color:#8A7659;word-break:break-all;">${link}</span></p>
        </div>
      </td></tr>
    </table>
    <p style="margin:18px 0 0;font-size:12px;color:#A2937A;">NovelStack · Stories worth following</p>
  </td></tr>
</table>`;
}
