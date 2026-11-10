import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UNDER_DEVELOPMENT_HTML } from "./lib/underDevelopmentHtml";
import { isTokenValid } from "./lib/authUtils";

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

  // Authentication check: verify token exists and is not expired
  const rawToken = request.cookies.get("token")?.value;
  const isLoggedIn = isTokenValid(rawToken);
  const hasStaleToken = Boolean(rawToken) && !isLoggedIn;

  const pathname = request.nextUrl.pathname;
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  // When user is successfully logged in:
  // If user tries to visit "/", "/sign-in", or "/tippz", navigate to "/community"
  if (isLoggedIn) {
    if (
      normalizedPath === "/" ||
      normalizedPath === "/tippz"
    ) {
      return NextResponse.redirect(new URL("/community", request.url));
    }
  }

  // Existing route protection
  const protectedRoutes = ["/rewardz"];
  if (protectedRoutes.includes(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/prottiz-special", request.url));
    }
  }

  const response = NextResponse.next();
  // Clear dead/expired cookie so it doesn't linger in browser
  if (hasStaleToken) {
    response.cookies.delete("token");
  }
  return response;
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};


