import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UNDER_DEVELOPMENT_HTML } from "./lib/underDevelopmentHtml";

export function proxy(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const allowBd = process.env.ALLOW_BD_ACCESS === "true";
  const forceShow = process.env.SHOW_UNDER_DEVELOPMENT === "true";

  const host = (
    request.headers.get("host") ||
    request.nextUrl.hostname ||
    ""
  ).toLowerCase();

  const country = (
    request.nextUrl.searchParams.get("geo") ||
    (request as any).geo?.country ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country") ||
    request.headers.get("x-country-code") ||
    request.headers.get("x-appengine-country") ||
    request.headers.get("x-geo-country") ||
    ""
  )
    .trim()
    .toUpperCase();

  const isVercelApp = host.includes("vercel.app");
  const isBd = country === "BD" || country === "BANGLADESH";
  const shouldBlockBd = isBd && !allowBd;

  // Show Under Development screen on non-Vercel domains (e.g. www.protippz.com) for BD users (or when forceShow is enabled)
  if (!isVercelApp && (forceShow || (isProduction && shouldBlockBd))) {
    return new NextResponse(UNDER_DEVELOPMENT_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
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

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};


