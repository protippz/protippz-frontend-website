import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Restricted | PROTIPPZ</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #090a0f;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 480px;
      width: 100%;
      background: rgba(22, 22, 26, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    }
    .icon-container {
      width: 64px;
      height: 64px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: #ef4444;
    }
    .brand {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #308D6F;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #ffffff;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">PROTIPPZ</div>
    <div class="icon-container">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#ef4444" stroke-width="2.5"></line>
      </svg>
    </div>
    <h1>Access Restricted</h1>
    <p>PROTIPPZ is currently not available in your region (Bangladesh). We apologize for any inconvenience.</p>
    <div class="badge">Region Code: BD</div>
  </div>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const allowBd = process.env.ALLOW_BD_ACCESS === "true";

  // Geo-blocking check for live/production mode
  if (isProduction && !allowBd) {
    const country = (
      (request as any).geo?.country ||
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("cloudfront-viewer-country") ||
      request.headers.get("x-country-code") ||
      request.headers.get("x-appengine-country") ||
      ""
    ).toUpperCase();

    if (country === "BD") {
      return new NextResponse(BLOCKED_HTML, {
        status: 403,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }
  }

  // Existing route protection
  const token = request.cookies.get("token")?.value || "";
  const protectedRoutes = ["/rewardz"];
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/prottiz-special", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
