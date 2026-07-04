import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value || '';
    const protectedRoutes = ["/rewardz"];
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL("/prottiz-special", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/rewardz"],
};
