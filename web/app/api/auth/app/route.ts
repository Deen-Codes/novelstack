import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/app?token=…  — the mobile magic-link landing page.
//
// Email clients (Gmail, Apple Mail) strip or refuse custom-scheme links like
// novelstack:// on buttons, so the email links here instead — a normal https
// URL that every client renders as a real, tappable button. This page does
// NOT consume the token; it just bounces the device into the app, which then
// exchanges the token at /api/auth/verify. That keeps the token single-use.
export function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';

  // Tokens are base64url (createMagicToken). Reject anything else so a crafted
  // value can't be injected into the page.
  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    return new NextResponse('Invalid sign-in link.', {
      status: 400,
      headers: { 'content-type': 'text/plain' },
    });
  }

  const deepLink = `novelstack://auth-callback?token=${token}`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Opening NovelStack…</title>
<style>
  body{margin:0;background:#14110F;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;color:#F2E9DA;}
  .card{background:#1B1714;border:1px solid #2A231F;border-radius:18px;
    max-width:380px;width:88%;padding:36px 32px;text-align:center;}
  .logo{font-size:22px;font-weight:700;letter-spacing:-0.01em;color:#F2E9DA;}
  .dot{color:#C8414E;}
  h1{font-weight:600;letter-spacing:-0.01em;font-size:22px;color:#F2E9DA;margin:18px 0 6px;}
  p{font-size:14px;line-height:1.6;color:#A59886;margin:0 0 22px;}
  a.btn{display:block;background:#C8414E;color:#FFFFFF;text-decoration:none;
    font-size:15px;font-weight:700;padding:14px 0;border-radius:999px;}
  .hint{font-size:12px;color:#8A7E6E;margin:18px 0 0;}
</style>
</head>
<body>
  <div class="card">
    <div class="logo">novelstack<span class="dot">.</span></div>
    <h1>Opening the app…</h1>
    <p>You should be signed in automatically. If nothing happens, tap the button below.</p>
    <a class="btn" id="open" href="${deepLink}">Open NovelStack</a>
    <p class="hint">Make sure the NovelStack app is installed on this device.</p>
  </div>
  <script>
    // Bounce straight into the app on load.
    setTimeout(function(){ window.location.href = ${JSON.stringify(deepLink)}; }, 250);
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
