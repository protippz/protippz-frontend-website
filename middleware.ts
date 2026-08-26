import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BAD_GATEWAY_HTML = `<html>
<head><title>502 Bad gateway</title></head>
<body>
<center><h1>502 Bad Gateway</h1></center>
<hr><center>nginx</center>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const allowBd = process.env.ALLOW_BD_ACCESS === "true";

  // Geo-blocking check for live/production mode -> return 502 Bad Gateway
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
      return new NextResponse(BAD_GATEWAY_HTML, {
        status: 502,
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
